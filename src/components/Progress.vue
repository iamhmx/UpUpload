<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 14:02:08
-->
<template>
	<div>
		<div style="margin-bottom: 5px">{{ title }}：</div>
		<el-progress
			:stroke-width="18"
			:text-inside="true"
			:percentage="percentage"
			status="success"
		></el-progress>
	</div>
</template>

<script>
export default {
	name: 'Progress',
	props: {
		title: {
			type: String,
			default: '总进度',
		},
		percentage: {
			type: Number,
			default: 0,
		},
	},
}
</script>

<style lang="scss" scoped>
</style>