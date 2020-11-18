<!--
 * @Author: mingxing.huang
 * @Date: 2020-11-18 10:31:03
-->
<template>
	<div class="upload-box">
		<VersionBar></VersionBar>
		<h2>{{ $route.meta.title }}</h2>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'Layout',
}
</script>

<style lang="scss" scoped>
.upload-box {
	padding: 80px;
	font-size: 14px;
}
</style>