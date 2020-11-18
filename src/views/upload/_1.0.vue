<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-11 17:48:49
-->
<template>
	<div>
		<InputBox :canDrag="false">
			<input type="file" @change="fileChange" />
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
import './index.scss'
export default {
	data() {
		return {
			file: null,
			percentage: 0,
		}
	},
	methods: {
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