<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-11 17:48:49
-->
<template>
	<div>
		<InputBox @dragFile="dragFile">
			<el-button class="upload-btn" size="small" @click="getFile"
				>选择或拖入文件</el-button
			>
			<span v-if="file" style="margin-left: 10px">{{ file.name }}</span>
			<input
				ref="input"
				type="file"
				style="visibility: hidden; width: 0px; height: 0px"
				@change="fileChange"
			/>
		</InputBox>
		<br />
		<FileSize :file="file"></FileSize>
		<br />
		<Slice @getSize="getSize"></Slice>
		<br />
		<UploadBtn :file="file" @upload="upload"></UploadBtn>
		<br />
		<Progress :percentage="percentage"></Progress>
		<br />
		<CubeProgress :chunks="chunks"></CubeProgress>
	</div>
</template>

<script>
import sparkMD5 from 'spark-md5'
import './index.scss'

export default {
	data() {
		return {
			file: null,
			percentage: 0,
			chunks: [],
		}
	},
	methods: {
		getSize(size) {
			this.size = parseInt(size * 1024 * 1024)
		},
		dragFile(file) {
			this.file = file
			this.percentage = 0
		},
		getFile() {
			this.$refs.input.dispatchEvent(new MouseEvent('click'))
		},
		fileChange(e) {
			if (e.target.files && e.target.files[0]) {
				this.file = e.target.files[0]
			}
		},
		async calculateHashIdle(chunks) {
			return new Promise((resolve) => {
				const spark = new sparkMD5.ArrayBuffer()
				let count = 0

				const appendToSpark = async (file) => {
					return new Promise((resolve) => {
						const reader = new FileReader()
						reader.readAsArrayBuffer(file)
						reader.onload = (e) => {
							spark.append(e.target.result)
							resolve()
						}
					})
				}
				const workLoop = async (deadline) => {
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
		// 文件切片
		genFileChunks(file) {
			const chunks = []
			let cur = 0
			while (cur < file.size) {
				chunks.push({
					index: cur,
					file: file.slice(cur, cur + this.size),
				})
				cur += this.size
			}
			return chunks
		},
		async upload() {
			if (!this.file) {
				this.$message.error('请先选择文件')
				return
			}
			// 文件切片
			const chunks = this.genFileChunks(this.file)
			// 计算文件hash
			this.hash = await this.calculateHashIdle(chunks)
			console.log('hash：', this.hash)
			// 查看是否已经上传
			let {
				data: { uploaded, uploadedList },
			} = await this.$http.post('/api/check', {
				hash: this.hash,
				ext: this.file.name.split('.').pop(),
			})
			console.log('校验文件：', uploaded, uploadedList)
			if (uploaded) {
				this.$confirm('秒传成功，是否删除重新上传？', '提示', {
					type: 'success',
					confirmButtonText: '好的',
					cancelButtonText: '算了',
				}).then(async () => {
					await this.$http.post('/api/delete', {
						name: this.hash + '.' + this.file.name.split('.').pop(),
					})
					await this.upload()
				})
				return
			}

			this.chunks = chunks.map((c, index) => {
				const name = this.hash + '-' + index
				return {
					hash: this.hash,
					name,
					index,
					file: c.file,
					// 将已经上传的切片标记
					progress: uploadedList.indexOf(name) !== -1 ? 100 : 0,
				}
			})
			console.log('chunks：', this.chunks)

			this.uploadChunks(uploadedList)
		},
		async uploadChunks(uploadedList = []) {
			let chunks = this.chunks
				.filter((item) => uploadedList.indexOf(item.name) === -1) // 只上传还未上传的切片，断点续传
				.map((chunk) => {
					// 转成promise
					const form = new FormData()
					form.append('file', chunk.file)
					form.append('hash', chunk.hash)
					form.append('name', chunk.name)
					return { form, index: chunk.index, error: 0 }
				})
			// 控制并发
			await this.sendRequest(chunks)
			// 请求合并
			await this.mergeRequest()
		},
		// 并发控制
		async sendRequest(chunks, limit = 4) {
			return new Promise((resolve, reject) => {
				const len = chunks.length
				let counter = 0
				// 错误计数，错误三次，取消上传
				let isStop = false
				const start = async () => {
					if (isStop) {
						this.$message.error('失败超过3次，停止上传')
						return
					}
					// 取出第一个chunk
					const task = chunks.shift()
					if (task) {
						const { form, index } = task
						try {
							await this.$http.post('/api/upload_chunk_mock_failed', form, {
								headers: {
									'Content-Type': 'multipart/form-data',
								},
								onUploadProgress: (progress) => {
									// 不是整体的进度条了，而是每个区块有自己的进度条，整体的进度条需要计算
									this.chunks[index].progress = Number(
										((progress.loaded / progress.total) * 100).toFixed(2)
									)
								},
							})
							if (counter == len - 1) {
								// 最后一个任务
								resolve()
							} else {
								counter++
								// 启动下一个任务
								start()
							}
						} catch (e) {
							// 标记错误
							this.chunks[index].progress = -1
							if (task.error < 3) {
								task.error++
								// 失败将任务重新放入队列
								chunks.unshift(task)
								start()
							} else {
								// 错误三次
								isStop = true
								reject()
							}
						}
					}
				}

				while (limit > 0) {
					// 启动limit个任务
					start()
					limit -= 1
				}
			})
		},
		// 切片发送完成，发送合并请求
		async mergeRequest() {
			const res = await this.$http.post('/api/merge', {
				ext: this.file.name.split('.').pop(),
				size: this.size,
				hash: this.hash,
			})
			console.log('合并结果：', res)
		},
	},
}
</script>

<style lang="scss" scoped>
</style>