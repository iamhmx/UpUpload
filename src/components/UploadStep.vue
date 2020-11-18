<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-17 14:34:39
-->
<template>
	<div
		class="upload-item"
		@click="enter"
		@mouseover="mouseoverHandle"
		@mouseleave="leaveHandle"
	>
		<div class="item-content">
			<span style="margin-left: 5px">{{ item.name }}</span>
			<i class="el-icon-arrow-right"></i>
		</div>
		<div class="ani top"></div>
		<div class="ani right"></div>
		<div class="ani bottom"></div>
		<div class="ani left"></div>
	</div>
</template>

<script>
export default {
	name: 'UploadStep',
	props: {
		item: {
			type: Object,
			default: () => {},
		},
	},
	methods: {
		enter() {
			this.$router.push({
				name: `upload${this.item.id + 1}`,
			})
		},
		mouseoverHandle() {
			this.addAni()
		},
		leaveHandle() {
			this.removeAni()
		},
		addAni() {
			let top = document.getElementsByClassName('top')[this.item.id]
			top.classList.add('tbAni')
			let right = document.getElementsByClassName('right')[this.item.id]
			right.classList.add('lrAni')
			let left = document.getElementsByClassName('left')[this.item.id]
			left.classList.add('lrAni')
			let bottom = document.getElementsByClassName('bottom')[this.item.id]
			bottom.classList.add('tbAni')
		},
		removeAni() {
			let top = document.getElementsByClassName('top')[this.item.id]
			top.classList.remove('tbAni')
			let right = document.getElementsByClassName('right')[this.item.id]
			right.classList.remove('lrAni')
			let left = document.getElementsByClassName('left')[this.item.id]
			left.classList.remove('lrAni')
			let bottom = document.getElementsByClassName('bottom')[this.item.id]
			bottom.classList.remove('tbAni')
		},
	},
}
</script>

<style lang="scss" scoped>
$color: #67c23a;
$duration: 0.5s;
.upload-item {
	border: 1px solid #dcdfe6;
	border-radius: 2px;
	height: 80px;
	margin-bottom: 20px;
	padding: 0 20px;
	position: relative;
	cursor: pointer;
	color: #606266;
	transition: background $duration;
	&:hover {
		background: rgba($color, 0.1);
	}
	.item-content {
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.ani {
		position: absolute;
		background: $color;
	}
	.top,
	.bottom {
		height: 1px;
	}
	.right,
	.left {
		width: 1px;
	}
	.top {
		top: 0;
		right: 0;
	}
	.right {
		bottom: 0;
		right: 0;
	}
	.bottom {
		bottom: 0;
		left: 0;
	}
	.left {
		top: 0;
		left: 0;
	}
	.tbAni {
		animation: tbAnimation $duration;
		animation-fill-mode: forwards;
	}
	.lrAni {
		animation: rlAnimation $duration;
		animation-fill-mode: forwards;
	}
	@keyframes tbAnimation {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}
	@keyframes rlAnimation {
		from {
			height: 0;
		}
		to {
			height: 100%;
		}
	}
}
</style>