<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-11 17:48:49
-->
<template>
	<div>
		<div style="font-size: 14px">
			<div>
				图片格式校验不能简单的依据后缀名，需要读取图片头信息来确定格式：
			</div>
			<ul>
				<li>
					PNG：文件头标识 (8 bytes)
					<span class="ext-highlight">89 50 4E 47 0D 0A 1A 0A</span>
				</li>
				<li>
					JPG/JPEG：文件头标识 (2 bytes)
					<span class="ext-highlight">FF D8</span>，文件结束标识 (2 bytes)
					<span class="ext-highlight">FF D9</span>
				</li>
				<li>
					GIF：文件头标识 (6 bytes)
					<span class="ext-highlight">47 49 46 38 39(37) 61</span>
				</li>
			</ul>
		</div>
		<br />
		<InputBox @dragFile="dragFile">
			<el-button class="upload-btn" size="small" @click="getFile"
				>选择或拖入图片</el-button
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
		<br />
		<p v-show="imageUrl">
			<img
				:src="`http://localhost:3009/${imageUrl}`"
				style="max-width: 540px"
			/>
		</p>
	</div>
</template>

<script>
import './index.scss'
export default {
	data() {
		return {
			file: null,
			percentage: 0,
			highlight: '',
			imageUrl: '',
		}
	},
	methods: {
		dragFile(file) {
			this.file = file
			this.percentage = 0
		},
		getFile() {
			this.$refs.input.dispatchEvent(new MouseEvent('click'))
		},
		async fileChange(e) {
			if (e.target.files && e.target.files[0]) {
				if (await this.isImage(e.target.files[0])) {
					this.file = e.target.files[0]
				} else {
					this.$message.error('格式不正确')
				}
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
			this.imageUrl = res.data
			this.$message.success('上传成功')
		},
		// 二进制对象转字符串
		blobToString(blob) {
			return new Promise((resolve) => {
				const reader = new FileReader()
				reader.readAsBinaryString(blob)
				reader.onload = () => {
					// console.log('二进制转字符串：', reader.result)
					const res = reader.result
						.split('')
						.map((v) => v.charCodeAt())
						.map((v) => v.toString(16).toUpperCase())
						.map((v) => v.padStart(2, '0'))
						.join(' ')
					// console.log('res：', res)
					resolve(res)
				}
			})
		},
		async isPNG(file) {
			const ret = await this.blobToString(file.slice(0, 8))
			return ret == '89 50 4E 47 0D 0A 1A 0A'
		},
		async isJPG(file) {
			let start = await this.blobToString(file.slice(0, 2))
			let end = await this.blobToString(file.slice(-2, file.size))
			return start === 'FF D8' && end === 'FF D9'
		},
		async isGIF(file) {
			const ret = await this.blobToString(file.slice(0, 6))
			return ret === '47 49 46 38 39 61' || ret === '47 49 46 38 37 61'
		},
		async isImage(file) {
			return (
				(await this.isPNG(file)) ||
				(await this.isJPG(file)) ||
				(await this.isGIF(file))
			)
		},
	},
}
</script>

<style lang="scss" scoped>
</style>