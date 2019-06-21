<template>
    <section>
        <!-- rScoreStoreRecord -->
        <el-row>
            
        </el-row>
        <el-row>
            <el-table :data="exchanges" v-loading="exchangesLoading">
                <el-table-column prop="id" label="编号" width="50"></el-table-column>
                <el-table-column prop="headImgUrl" label="头像" width="50">
                    <template slot-scope="scope">
                        <img :src="scope.row.headImgUrl" style="width: 30px;height: 30px">
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="nickname" label="昵称" width="120" show-overflow-tooltip></el-table-column> -->
                <el-table-column  label="昵称/openId" width="250" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{scope.row.nickname}}</div>
                        <div>{{scope.row.openId}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" width="130" show-overflow-tooltip></el-table-column>
                <el-table-column prop="fromWhere" label="来源" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.fromWhere == 'turnTable'">转盘抽奖</span>
                        <span v-else-if="scope.row.fromWhere == 'scoreStore'">积分商城</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="90">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == '0'">待审核</div>
                        <div v-else-if="scope.row.status == '1'">待发放</div>
                        <div v-else-if="scope.row.status == '2'">不通过</div>
                        <div v-else-if="scope.row.status == '3'">已发放</div>
                        <div>{{scope.row.statusMsg}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="receiverName" label="收件人" width="80" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="receiverPhone" label="收件人/电话/地址" width="180">
                    <template slot-scope="scope">
                        <div>{{scope.row.receiverName}}</div>
                        <div>{{scope.row.receiverPhone}}</div>
                        <div>{{scope.row.receiverAddr}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderId" label="快递单号" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="90">
                    <template scope="scope">
                        <!-- <el-button-group>
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)"></el-button>
                            <el-button type="info" size="mini"  @click="oScoreStoreStatus(scope)">{{scope.row.status == 1 ? '下架' : '上架'}}</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="dScoreStore(scope)"></el-button>
                        </el-button-group> -->
                        <el-button type="primary" size="mini" @click = 'penWindow(scope.row)'>
                            <span v-if="scope.row.status == '0'">审核</span>
                            <span v-else-if="scope.row.status == '1'">发货</span>
                            <span v-else-if="scope.row.status == '2'">再审</span>
                            <span v-else-if="scope.row.status == '3'">编辑</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background :page-size="condition.pageSize"
                        @current-change ="rScoreStoreRecord"
                        layout="prev, pager, next"
                        :total="exchangesCount">
                </el-pagination>
            </div>
        </el-row>
        <el-dialog
		  title="提示"
		  :visible.sync="checkVisible"
		  width="30%">
			  <el-row>
			  	<el-radio-group v-model="active_data.status">
					<el-row class = 'ht40'>
						<el-radio  :label="1">通过</el-radio>						
					</el-row>
					<el-row class = 'ht40'>
						<el-radio :label="2">不通过</el-radio>
					</el-row>
					<el-row>
						<el-input v-model = 'active_data.statusMsg'></el-input>						
					</el-row>
				</el-radio-group>
			  </el-row>  	
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="checkVisible = false">取 消</el-button>
			    <el-button type="primary" @click="checkConfirm">确 定</el-button>
			  </span>
		</el-dialog>
		  <el-dialog
		  title="提示"
		  :visible.sync="expressVisible"
		  width="30%">
			  <el-row>
					<el-row>
						<el-col :span = "4" class = 'line-ht40-center'>物流信息</el-col>
						<el-col :span = "20">							
							<el-input v-model = 'active_data.orderId'></el-input>						
						</el-col>
					</el-row>
			  </el-row>  	
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="expressVisible = false">取 消</el-button>
			    <el-button type="primary" @click="expressConfirm">确 定</el-button>
			  </span>
		</el-dialog>
		  <el-dialog
		  title="提示"
		  :visible.sync="finishVisible"
		  width="30%">
			  <el-row class = 'line-ht40-center on_25'>
					所有流程已经完成，不可操作
			  </el-row>  	
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="finishVisible = false">取 消</el-button>
			    <el-button type="primary" @click="finishVisible = false">确 定</el-button>
			  </span>
		</el-dialog>
    </section>
</template>

<script>
export default {
  data() {
    return {
      condition: {
        name: "",
        phone: "",
        status: "",
        orderId: "",
        page: 1,
        pageSize: 30
      },
      exchanges: [],
      exchangesCount: "",
      exchangesLoading: false,
      checkVisible: false,
      check_text: "",
      active_data: {},
      expressVisible: false,
      finishVisible: false
    };
  },
  created() {
    this.rScoreStoreRecord(1);
  },
  methods: {
    penWindow(data) {
      let status = data.status;
      this.active_data = data;
      if (status == 0 || status == 2) {
        this.checkVisible = true;
      } else if (status == 1 || 3) {
        this.expressVisible = true;
      }
    },
    checkConfirm() {
      if (this.active_data.status != 2) {
        this.active_data.statusMsg = "";
      }
      this.postData();
      this.checkVisible = false;
    },
    expressConfirm() {
      if (this.active_data.orderId != "") {
        this.active_data.status = 3;
        this.expressVisible = false;
        this.postData();
      } else {
        this.$message.error("物流信息不能留空!");
      }
    },
    postData() {
      this.$axios
        .get(
          "/mpos/sys/scoreStore/uScoreStoreRecordStatus/" +
            localStorage.getItem("curr_mpId"),
          {
            params: {
              id: this.active_data.id,
              status: this.active_data.status,
              statusMsg: this.active_data.statusMsg,
              orderId: this.active_data.orderId
            }
          }
        )
        .then(res => {
          console.log(res);
        });
    },
    finishConfirm() {
      this.finishVisible = false;
    },
    hanldOption(page) {
      this.rScoreStoreRecord(page);
    },
    rScoreStoreRecord(page) {
      this.condition.page = page;
      this.$axios
        .get(
          "/mpos/sys/scoreStore/rScoreStoreRecord/" +
            localStorage.getItem("curr_mpId"),
          {
            params: this.condition
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            this.exchanges = res.data.data.data;
            this.exchangesCount = res.data.data.count;
            // console.log(this.exchanges);
          }
        });
    }
  }
};
</script>
<style scoped>
.ht40 {
  height: 40px;
}
.line-ht40-center {
  line-height: 40px;
  text-align: center;
}
.on_25 {
  font-size: 25px;
}
</style>

