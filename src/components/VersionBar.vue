<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 10:18:27
-->
<template>
	<div class="version-bar-box">
		<el-button
			icon="el-icon-s-home"
			size="small"
			type="success"
			@click="$router.push({ name: 'Home' })"
			>首页</el-button
		>
		<el-button
			size="small"
			:type="item.id === $route.name ? 'primary' : ''"
			v-for="item in versions"
			:key="item.id"
			@click="jump(item.id)"
			>{{ item.name }}</el-button
		>
	</div>
</template>

<script>
export default {
	name: 'VersionBar',
	data() {
		return {
			versions: [
				{
					id: 'upload1',
					name: 'v1.0',
				},
				{
					id: 'upload2',
					name: 'v2.0',
				},
				{
					id: 'upload3',
					name: 'v3.0',
				},
				{
					id: 'upload4',
					name: 'v4.0',
				},
				{
					id: 'upload5',
					name: 'v5.0',
				},
				{
					id: 'upload6',
					name: 'v6.0',
				},
				{
					id: 'upload7',
					name: 'v7.0',
				},
			],
		}
	},
	methods: {
		jump(id) {
			if (id === this.$route.name) {
				return
			}
			this.$router.push({ name: id })
		},
	},
}
</script>

<style lang="scss" scoped>
.version-bar-box {
	margin-bottom: 20px;
}
</style>