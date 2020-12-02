/*
 * @Author: mingxing.huang
 * @Date: 2020-12-02 10:30:52
 */
import sparkMD5 from 'spark-md5'
import './index.scss'

export default {
  data() {
    return {
      // 要上传的文件
      file: null,
      // 计算hash进度
      hashProgress: 0,
      // 切片数据
      chunks: []
    }
  },
  computed: {
    // 根据每一片的进度，计算上传总进度
    totalProgress() {
      if (!this.file || this.chunks.length === 0) {
        return 0
      }
      const loaded = this.chunks
        .map(item => (item.file.size * item.progress) / 100)
        .reduce((acc, cur) => acc + cur, 0)
      return parseInt(((loaded * 100) / this.file.size).toFixed(2))
    }
  },
  methods: {
    // 切片大小，byte
    getSize(size) {
      this.chunkSize = parseInt(size * 1024 * 1024)
    },
    // 拖拽文件
    dragFile(file) {
      this.file = file
      this.percentage = 0
    },
    // 触发input点击
    getFile() {
      this.$refs.input.dispatchEvent(new MouseEvent('click'))
    },
    // input选择文件
    fileChange(e) {
      if (e.target.files && e.target.files[0]) {
        this.file = e.target.files[0]
      }
    },
    // 利用window.requestIdleCallback计算文件md5
    async calculateHashIdle(chunks) {
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0

        const appendToSpark = async file => {
          return new Promise(resolve => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = e => {
              spark.append(e.target.result)
              resolve()
            }
          })
        }
        const workLoop = async deadline => {
          // timeRemaining获取当前帧的剩余时间
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            // 空闲时间，且有任务
            await appendToSpark(chunks[count].file)
            count++
            if (count < chunks.length) {
              this.hashProgress = Number(
                ((100 * count) / chunks.length).toFixed(2)
              )
            } else {
              this.hashProgress = 100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(workLoop)
        }
        // 浏览器一旦空闲，就会调用workLoop
        window.requestIdleCallback(workLoop)
      })
    },
    // 利用Web Worker计算文件md5
    async calculateHashWebWorker(chunks) {
      return new Promise(resolve => {
        console.log('location：', location)
        const worker = new worker(`./hash.js`)
        console.log('worker：', worker)
        worker.postMessage({
          chunks: chunks
        })
        worker.onmessage(e => {
          const { progress, hash } = e.data
          this.hashProgress = Number(progress.toFixed(2))
          if (hash) {
            resolve(hash)
          }
        })
      })
    },
    // 文件切片
    genFileChunks(file) {
      const chunks = []
      let cur = 0
      while (cur < file.size) {
        chunks.push({
          index: cur,
          file: file.slice(cur, cur + this.chunkSize)
        })
        cur += this.chunkSize
      }
      return chunks
    },
    // 切片发送完成，发送合并请求
    async mergeRequest() {
      const res = await this.$http.post('/api/merge', {
        ext: this.file.name.split('.').pop(),
        size: this.chunkSize,
        hash: this.hash
      })
      console.log('合并结果：', res)
    },
    // 构造切片数据
    _genChunks(chunks, uploadedList) {
      return chunks.map((c, index) => {
        // hash+序号，作为切片名称
        const name = this.hash + '-' + index
        return {
          hash: this.hash,
          name,
          index,
          file: c.file,
          progress: uploadedList
            ? uploadedList.indexOf(name) !== -1
              ? 100
              : 0
            : 0
        }
      })
    },
    // 生成上传数据：[{form, index, error}, {form, index, error}]
    _genUploadData(uploadedList = []) {
      return this.chunks
        .filter(item => uploadedList.indexOf(item.name) === -1) // 只上传还未上传的切片，断点续传
        .map(chunk => {
          // 转成promise
          const form = new FormData()
          form.append('file', chunk.file)
          form.append('hash', chunk.hash)
          form.append('name', chunk.name)
          return { form, index: chunk.index, error: 0 }
        })
    },
    // 生成调用请求：[Promise, Promise]
    _genRequest(uploadData) {
      return uploadData.map(({ form, index }) =>
        this.$http.post('/api/upload_chunk', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progress => {
            // 这里是每个切片的进度，整体的进度需要计算
            this.chunks[index].progress = Number(
              ((progress.loaded / progress.total) * 100).toFixed(2)
            )
          }
        })
      )
    },
    // 检查是否已经上传
    async _checkUpload() {
      let {
        data: { uploaded, uploadedList }
      } = await this.$http.post('/api/check', {
        hash: this.hash,
        ext: this.file.name.split('.').pop()
      })
      return { uploaded, uploadedList }
    }
  }
}
