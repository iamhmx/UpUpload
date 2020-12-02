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
				// 已经上传了
				this.$message.success('秒传成功')
				return
			}
			// 传入已经上传过的切片数据，构造chunks数据
			this.chunks = this._genChunks(chunks, uploadedList)
			// 上传切片
			this.uploadChunks(uploadedList)
		},
		// 上传切片
		async uploadChunks(uploadedList = []) {
			const requests = this._genRequest(this._genUploadData(uploadedList))
			await Promise.all(requests)
			// 请求合并
			await this.mergeRequest()
		},
	},
}
</script>

<style lang="scss" scoped>
</style>