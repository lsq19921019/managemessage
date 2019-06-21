<template>
    <div>
    
		<el-row>
			<el-table :data="tableData" style="width: 100%">
				<!-- <el-table-column prop="id" label="编号" width="180">
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
				</el-table-column> -->
				<el-table-column prop="name" label="名称" width="300">
				</el-table-column>
				<el-table-column label="用户性别">
					<template slot-scope="scope">
                    <span>{{getSexType(scope.row.userSex)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="消息类型">
					<template slot-scope="scope">
                        <span>{{getMsgType(scope.row.msgType)}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="sendCount" label="预估发送人数">
				</el-table-column>
				<!-- <el-table-column prop="doTime" label="执行时间">
                
				</el-table-column> -->
				<el-table-column label="执行时间">
					<template slot-scope="scope">
                    <span>{{switchTime(scope.row.doTime)}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="sendTime" label="发送时间">
				</el-table-column>
			</el-table>
		</el-row>
		<div class="pagination">
			<el-pagination background :page-size="condition.pageSize" @current-change="changePage" layout="prev, pager, next" :total="condition.total">
			</el-pagination>
		</div>
        
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
      getMsgType(type){
          return type==2?'图文':'文本';
      },
      getSexType(sex){
          switch (parseInt(sex)) {
              case 2:
                  return '女';
                  break;
          
              case 1:
                  return '男';
                  break;
          
              case 0:
                  return '全部';
                  break;
          
              default:
                  break;
          }
      },
      switchTime(time){
          return time?time.slice( 0 , 2 ) + ':' + time.slice( 2 ):'';
      },
			changePage(page) {
				this.condition.page = page;
				this.getListData();
			},
			getListData() {
				this.$axios
					.post(
						"/mpos/sys/kefu/getRecord/" + localStorage.getItem("curr_mpId"), {
								pageSize: this.condition.pageSize,
								page: this.condition.page,
						})
					.then(res => {
						let data = res.data.data;
                        console.log(data.records);
						// this.tableData = data.records.map(item => {
						// 	if(item.keys) {
						// 		let keyArr = item.keys.split("_"),
						// 			tagArr = item.tags.split("_");
						// 		keyArr.shift();
						// 		tagArr.shift();
						// 		item.key = keyArr.join(",");
						// 		item.tag = tagArr.join(',');
						// 		return item;
						// 	}
						// 	return item;
						// })
                        this.tableData = data.records;
						this.condition.total = data.total;
					});
			}
		}
}
</script>
<style>
    
</style>