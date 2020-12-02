// 引入spark-md5
self.importScripts('spark-md5.min.js')

self.onmessage = e => {
  // 接受主线程传递的数据
  const { chunks } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  // 计算进度
  let progress = 0
  // 切片个数
  let count = 0

  const loadNext = index => {
    const reader = new FileReader()
    // 读取一个切片文件
    reader.readAsArrayBuffer(chunks[index].file)
    reader.onload = e => {
      count++
      spark.append(e.target.result)
      if (count == chunks.length) {
        // 计算完成，返回进度100和hash值
        self.postMessage({
          progress: 100,
          hash: spark.end()
        })
      } else {
        progress += 100 / chunks.length
        self.postMessage({
          progress
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
