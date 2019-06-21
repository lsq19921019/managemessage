<template>
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="关键字回复" name="first">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column label="规则名称" width="180">
						<template slot-scope="scope">
							<span>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="关键字">
						<template slot-scope="scope">
							<span>{{ scope.row.keys }}</span>
						</template>
					</el-table-column>

					<el-table-column label="开关" width="180">
						<template slot-scope="scope">
							<span>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template slot-scope="scope">
							<span>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="关注回复" name="second">

			</el-tab-pane>
			<el-tab-pane label="默认回复" name="third">

			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	export default {
		name: 'KeyWord',
		data: function() {
			return {
				activeName: "first",
				tableData: [{
					name: "测试",
					keys : "小编，大编",
					
				}]
			}
		},
		methods: {

		},
		computed: {

		},
		components: {

		},
		created: function() {

		}
	}
</script>

<style scoped>

</style>