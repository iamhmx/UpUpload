<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'app',
}
</script>

<style lang="scss">
html,
body {
	width: 100%;
	height: 100%;
	margin: 0;
	background-color: #eee;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #303133;
	margin: 0 auto;
	min-height: 100%;
	width: 700px;
	background: white;
}
</style>
