<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-17 11:27:42
-->
<template>
	<div class="home-box">
		<div class="title">
			<div class="tip tip1">U</div>
			<div class="tip tip2">p</div>
			<div class="name">Upload</div>
			<div class="dot">.</div>
			<div class="name">js</div>
		</div>
		<div class="content">
			<UploadStep
				v-for="item in steps"
				:key="item.name"
				:item="item"
			></UploadStep>
		</div>
	</div>
</template>

<script>
import UploadStep from '../components/UploadStep'
export default {
	name: 'home',
	components: {
		UploadStep,
	},
	data() {
		return {
			steps: [
				{
					id: 0,
					name: 'v1.0：进度条',
					icon: 'el-icon-light-rain',
				},
				{
					id: 1,
					name: 'v2.0：拖拽',
					icon: 'el-icon-lightning',
				},
				{
					id: 2,
					name: 'v3.0：图片格式校验',
					icon: 'el-icon-heavy-rain',
				},
				{
					id: 3,
					name: 'v4.0：大文件切片',
					icon: 'el-icon-sunrise',
				},
				{
					id: 4,
					name: 'v5.0：秒传&断点续传',
					icon: 'el-icon-sunrise-1',
				},
				{
					id: 5,
					name: 'v6.0：并发控制',
					icon: 'el-icon-sunset',
				},
				{
					id: 6,
					name: 'v7.0：失败重试&错误控制',
					icon: 'el-icon-sunny',
				},
			],
		}
	},
	mounted() {
		setTimeout(() => {
			let el = document.getElementsByClassName('name')[1]
			el.classList.add('ext')
		}, 2000)
		setTimeout(() => {
			let el = document.getElementsByClassName('dot')[0]
			el.classList.add('dot1')
		}, 2000)
		setTimeout(() => {
			let el = document.getElementsByClassName('content')[0]
			el.classList.add('contentAni')
		}, 3000)
	},
}
</script>

<style lang="scss">
$tipDuration: 0.6s;
.home-box {
	.title {
		text-align: center;
		padding: 20px 0;
		font-weight: 500;
		font-size: 70px;
		div {
			display: inline-block;
		}
		.tip {
			color: rgb(103, 194, 58);
		}
		.tip1 {
			animation: tip1Animation $tipDuration;
			animation-timing-function: ease-in-out;
			animation-fill-mode: forwards;
		}
		.tip2 {
			animation: tip2Animation $tipDuration;
			animation-timing-function: ease-in-out;
			animation-fill-mode: forwards;
		}
		.name {
			animation: nameAnimation $tipDuration;
			animation-fill-mode: forwards;
			animation-delay: 1s;
			opacity: 0;
		}
		.ext {
			animation: extAnimation $tipDuration;
			animation-fill-mode: forwards;
		}
		.dot {
			opacity: 0;
		}
		.dot1 {
			display: inline-block;
			animation: dotAnimation $tipDuration;
			animation-fill-mode: forwards;
		}
		@keyframes tip1Animation {
			0% {
				transform: translateY(-100px);
				opacity: 0;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}
		@keyframes tip2Animation {
			0% {
				transform: translateY(100px);
				opacity: 0;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}
		@keyframes nameAnimation {
			0% {
				transform: translateX(100px);
				opacity: 0;
			}
			100% {
				transform: translateX(0);
				opacity: 1;
			}
		}
		@keyframes extAnimation {
			from {
				transform: translateX(0);
				opacity: 1;
			}
			to {
				transform: translateX(10px);
				opacity: 1;
			}
		}
		@keyframes dotAnimation {
			0% {
				transform: translateY(-100px);
				opacity: 1;
			}
			20% {
				transform: translateY(10px);
				opacity: 1;
			}
			40% {
				transform: translateY(-30px);
				opacity: 1;
			}
			60% {
				transform: translateY(5px);
				opacity: 1;
			}
			80% {
				transform: translateY(-10px);
				opacity: 1;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
	.content {
		padding: 20px 60px;
		opacity: 0;
	}
	.contentAni {
		opacity: 0;
		animation: contentAnimation $tipDuration;
		animation-fill-mode: forwards;
	}
	@keyframes contentAnimation {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
}
</style>
