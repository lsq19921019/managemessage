<template>
	<div class="qrInfo">
		<el-row>
			<el-button type="primary" size="mini" icon="el-icon-plus" @click="popAdd"></el-button>
		</el-row>
		<el-row>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="编号" width="180">
				</el-table-column>
				<el-table-column prop="name" label="名字" width="180">
				</el-table-column>
				<el-table-column prop="keys" label="关键字" width="180">
				</el-table-column>
				<el-table-column prop="tags" label="标签">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间">
				</el-table-column>
				<el-table-column label="二维码" width="180">
					<template slot-scope="scope">
						<img :src="scope.row.url" alt="" class="img" />
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<div class="pagination">
			<el-pagination background :page-size="condition.pageSize" @current-change="changePage" layout="prev, pager, next" :total="condition.total">
			</el-pagination>
		</div>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="60px">
				<el-form-item label="名字">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="关键字">
					<el-input v-model="form.keys" placeholder="请输入关键字组，例如:关键字1_关键字2"></el-input>
				</el-form-item>
				<el-form-item label="标签">
					<el-input v-model="form.tags" placeholder="请输入标签编号，例如:101_102"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addQr">创建</el-button>
					<el-button @click="offAdd">取消</el-button>
				</el-form-item>
			</el-form>
			<div class="hint">注意：多个关键字或者多个标签，请用下划线隔开；如关键字：签到_领奖_找券</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				mpId: "",
				dialogVisible: false,
				form: {
					name: "",
					keys: "",
					tags: ""
				},
				condition: {
					subType: "-1",
					sex: "-1",
					tagId: "",
					nickname: "",
					openId: "",
					page: 1,
					pageSize: 5
				},
				tableData: [{
					id: "",
					name: "",
					key: "",
					tag: "",
					url: ""
				}]
			}
		},
		created() {
			this.changePage(1);
		},
		methods: {
			popAdd() {
				this.dialogVisible = true
			},
			offAdd() {
				this.dialogVisible = false;
			},
			addQr() {
				switch(true) {
					case this.form.name == "":
						return this.pophint("名字不能为空");
					case this.form.keys == "" && this.form.tags == "":
						return this.pophint("关键字和标签至少填一项");
					default:
						this.$http
							.get(
								"/mpos/sys/mpQrcode/cQrcode/" + localStorage.getItem("curr_mpId"), {
									params: {
										name: this.form.name,
										keys: this.form.keys,
										tags: this.form.tags
									}
								})
							.then(res => {
								if(res.data.status) {
									//重置表单
									this.changePage(1);
									this.$message({
										message: "添加成功",
										type: "success"
									});
									this.offAdd();
								}
							});
				}

			},
			pophint(text) {
				this.$confirm(text)
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			changePage(page) {
				this.condition.page = page;
				this.getListData();
			},
			getListData() {
				this.$http
					.get(
						"/mpos/sys/mpQrcode/rQrcodes/" + localStorage.getItem("curr_mpId"), {
							params: {
								size: this.condition.pageSize,
								current: this.condition.page,
							}
						})
					.then(res => {
						let data = res.data.data;
						this.tableData = data.records.map(item => {
							if(item.keys) {
								let keyArr = item.keys.split("_"),
									tagArr = item.tags.split("_");
								keyArr.shift();
								tagArr.shift();
								item.key = keyArr.join(",");
								item.tag = tagArr.join(',');
								return item;
							}
							return item;
						})
						this.condition.total = data.total;
					});
			}
		}
	};
</script>
<style>
	.img {
		width: 80px;
	}
</style>