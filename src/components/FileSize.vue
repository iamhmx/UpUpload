<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 13:58:07
-->
<template>
	<div>文件大小：{{ showSize }}</div>
</template>

<script>
import { fileSize } from '../utils'
export default {
	name: 'FileSize',
	props: ['file'],
	computed: {
		showSize() {
			return fileSize(this.file)
		},
	},
}
</script>

<style lang="scss" scoped>
</style>