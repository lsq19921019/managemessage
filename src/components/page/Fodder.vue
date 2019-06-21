<template>
	<div class="main">
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="图片" name="first">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column label="图片" width="80">
						<template slot-scope="scope">
							<img :src="baseUrl + scope.row.url" alt="" class="show-img" v-if = "scope.row.url"/>
							<div v-else>暂无图片</div>
						</template>
					</el-table-column>
					<el-table-column label="编号">
						<template slot-scope="scope">
							{{scope.row.mediaId}}
						</template>
					</el-table-column>
					<el-table-column label="最后修改时间">
						<template slot-scope="scope">
							{{scope.row.updateTime}}
						</template>
					</el-table-column>
					<el-table-column label="文件名">
						<template slot-scope="scope">
							{{scope.row.name}}
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="语音" name="second">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column label="编号">
						<template slot-scope="scope">
							{{scope.row.mediaId}}
						</template>
					</el-table-column>
					<el-table-column label="最后修改时间">
						<template slot-scope="scope">
							{{scope.row.updateTime}}
						</template>
					</el-table-column>
					<el-table-column label="文件名">
						<template slot-scope="scope">
							{{scope.row.name}}
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="视频" name="third">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column label="编号">
						<template slot-scope="scope">
							{{scope.row.mediaId}}
						</template>
					</el-table-column>
					<el-table-column label="最后修改时间">
						<template slot-scope="scope">
							{{scope.row.updateTime}}
						</template>
					</el-table-column>
					<el-table-column label="文件名">
						<template slot-scope="scope">
							{{scope.row.name}}
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<div class="pagination">
			<el-pagination background :page-size="condition.pageSize" @current-change="changePage" layout="prev, pager, next" :total="condition.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Fodder',
		data: function() {
			return {
				baseUrl: "http://test.nabaapp.cn/mpos/sys/material/doImg?imgUrl=",
				activeName: "first",
				condition: {
					subType: "-1",
					sex: "-1",
					tagId: "",
					nickname: "",
					openId: "",
					page: 1,
					pageSize: 20
				},
				tableData: [],
				type: "image"
			}
		},

		methods: {
			handleEdit(index, row) {
				console.log(index, row);
			},
			handleDelete(index, row) {
				console.log(index, row);
			},
			handleClick(tab, event) {
				switch(this.activeName) {
					case "first":
						this.type = "image";
						break;
					case "second":
						this.type = "voice";
						break;
					case "third":
						this.type = "video";
						break;
				}
				this.condition.page = 1;
				this.getListData();
			},
			changePage(page) {
				this.condition.page = page;
				this.getListData();
			},
			getListData() {
				this.$http
					.get(
						"/mpos/sys/material/rMaterialsFile/" + localStorage.getItem("curr_mpId"), {
							params: {
								page: this.condition.page,
								type: this.type,
							}
						})
					.then(res => {
						let data = res.data.data;
						this.condition.total = data.totalCount;
						this.tableData = data.items;
					});
			}
		},
		computed: {

		},
		components: {

		},
		created: function() {
			this.getListData();
		}
	}
</script>

<style scoped>
	.show-img {
		width: 50px;
		height: 50px;
	}
</style>