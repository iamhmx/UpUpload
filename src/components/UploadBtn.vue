<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 14:00:30
-->
<template>
	<div class="btn-box">
		<el-button
			class="upload-btn"
			:disabled="!this.file"
			size="small"
			type="primary"
			@click="uploadHandle"
			>上传</el-button
		>
	</div>
</template>

<script>
export default {
	name: 'UploadBtn',
	props: ['file'],
	methods: {
		uploadHandle() {
			this.$emit('upload')
		},
	},
}
</script>

<style lang="scss" scoped>
</style>