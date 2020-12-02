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
		<UploadBtn :file="file" @upload="upload"></UploadBtn>
		<br />
		<Progress :percentage="percentage"></Progress>
	</div>
</template>

<script>
import { fileSize } from '../../utils'
import './index.scss'
export default {
	data() {
		return {
			file: null,
			percentage: 0,
			highlight: '',
		}
	},
	computed: {
		showSize() {
			return fileSize(this.file.size)
		},
	},
	methods: {
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
				this.percentage = 0
			}
		},
		async upload() {
			if (!this.file) {
				this.$message.error('请先选择文件')
				return
			}
			this.percentage = 0
			let form = new FormData()
			form.append('file', this.file)
			let res = await this.$http.post('/api/upload', form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent) => {
					this.percentage = Number(
						((progressEvent.loaded / progressEvent.total) * 100).toFixed(1)
					)
				},
			})
			console.log('res：', res.data)
			this.$message.success('上传成功')
		},
	},
}
</script>

<style lang="scss" scoped>
</style>