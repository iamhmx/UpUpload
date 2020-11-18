<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 15:35:10
-->
<template>
	<div v-if="chunks.length > 0" :style="`width:${cubeWidth}px`">
		<div v-for="item in chunks" :key="item.index" class="cube">
			<div class="progress" :style="getStyle(item)"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CubeProgress',
	props: {
		chunks: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		cubeWidth() {
			return Math.ceil(Math.sqrt(this.chunks.length)) * 22
		},
	},
	methods: {
		getStyle(item) {
			let color = ''
			if (item.progress === -1) {
				color = 'red'
			} else if (item.progress === 100) {
				color = '#67C23A'
			} else {
				color = 'orange'
			}
			return `height:${(18 * item.progress) / 100}px;background:${color}`
		},
	},
}
</script>

<style lang="scss" scoped>
</style>