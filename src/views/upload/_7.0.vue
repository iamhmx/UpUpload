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
		<Progress title="计算MD5" :percentage="hashProgress"></Progress>
		<br />
		<Progress :percentage="totalProgress"></Progress>
		<br />
		<CubeProgress :chunks="chunks"></CubeProgress>
	</div>
</template>

<script>
import mixin from './mixin'

export default {
	mixins: [mixin],
	methods: {
		async upload() {
			this.chunks = []
			if (!this.file) {
				this.$message.error('请先选择文件')
				return
			}
			// 文件切片
			const chunks = this.genFileChunks(this.file)
			// 计算文件hash
			this.hash = await this.calculateHashIdle(chunks)
			// 查看是否已经上传
			let { uploaded, uploadedList } = await this._checkUpload()
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
			// 传入已经上传过的切片数据，构造chunks数据
			this.chunks = this._genChunks(chunks, uploadedList)
			// 上传切片
			this.uploadChunks(uploadedList)
		},
		async uploadChunks(uploadedList = []) {
			let chunks = this._genUploadData(uploadedList)
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
							// 调用模拟失败接口，有30%的失败概率
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
	},
}
</script>

<style lang="scss" scoped>
</style>