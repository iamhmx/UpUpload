<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 14:04:13
-->
<template>
	<div
		:class="['drag', highlight]"
		@dragover="dragOver"
		@dragleave="dragLeave"
		@drop="drop"
	>
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'InputBox',
	props: {
		canDrag: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			highlight: '',
		}
	},
	methods: {
		dragOver(e) {
			if (!this.canDrag) {
				return
			}
			this.highlight = 'highlight'
			e.preventDefault()
		},
		dragLeave(e) {
			if (!this.canDrag) {
				return
			}
			this.highlight = ''
			e.preventDefault()
		},
		drop(e) {
			if (!this.canDrag) {
				return
			}
			if (e.dataTransfer.files[0]) {
				let file = e.dataTransfer.files[0]
				this.$emit('dragFile', file)
			}
			this.highlight = ''
			e.preventDefault()
		},
	},
}
</script>

<style lang="scss" scoped>
.highlight {
	border-color: orange;
}
</style>