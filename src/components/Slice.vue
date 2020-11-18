<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 14:57:14
-->
<template>
	<div>
		切片大小：
		<el-radio-group v-model="size" size="mini">
			<el-radio-button v-for="s in sizeArray" :label="s.value" :key="s.label">{{
				s.label
			}}</el-radio-button>
		</el-radio-group>
	</div>
</template>

<script>
export default {
	name: 'Slice',
	data() {
		return {
			size: 0.01,
			sizeArray: [
				{
					label: '≈10 kb',
					value: 0.01,
				},
				{
					label: '≈100 kb',
					value: 0.1,
				},
				{
					label: '1 mb',
					value: 1,
				},
				{
					label: '10 mb',
					value: 10,
				},
			],
		}
	},
	watch: {
		size: {
			immediate: true,
			handler(value) {
				this.$emit('getSize', value)
			},
		},
	},
}
</script>

<style lang="scss" scoped>
</style>