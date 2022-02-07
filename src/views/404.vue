<template>
	<a-result status="404" title="404" sub-title="对不起, 该页面不存在。">
		<template #extra>
			<router-link class="ant-btn ant-btn-primary" to="/">返回</router-link>
		</template>
	</a-result>
</template>