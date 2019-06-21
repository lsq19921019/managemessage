<template>
    <section>
        <!-- 条件框 -->
        <div class="condition">
            <!-- <el-input class="condition-input" v-model="like_name" placeholder="姓名" clearable @keyup.enter.native="listGuestCondition"></el-input> -->
            <el-select v-model="eq_customerId" filterable remote clearable  placeholder="请输入客户姓名关键词"
                :remote-method="remoteMethodCustomer" :loading="customerOptionLoading" >
                <el-option v-for="item in saveForm_customerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- <el-input class="condition-input" v-model="like_phoneNum" placeholder="电话" clearable @keyup.enter.native="listGuestCondition"></el-input> -->
            <el-date-picker v-model="conditionDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="listGuestCondition"></el-button>
            <el-button type="primary" icon="el-icon-plus" @click="handlePlus()"></el-button>
        </div>
        
    
        <!-- 列表 -->
        <el-table :data="tableData" style="width: 100%" ref="multipleTable" v-loading="listLoading" @selection-change="handleSelectionChange">>
            <el-table-column prop="customer.name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="seller.name" label="业务员" width="120"></el-table-column>
            <el-table-column prop="budget" label="预算(万)" width="120"></el-table-column>
            <el-table-column prop="guestTime" label="来访时间" width="220"></el-table-column>
            <el-table-column prop="remark" label="备注" width="390" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 保存访客信息(新增/修改) -->
        <el-dialog :title="optionCMD" :visible.sync="saveFormVisible" :close-on-click-modal="false">
			<el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
				<el-form-item label="客户姓名" prop="customerId">
                    <el-select v-model="saveForm.customerId" filterable remote clearable  placeholder="请输入关键词"
                        :remote-method="remoteMethodCustomer" :loading="customerOptionLoading" >
                        <el-option v-for="item in saveForm_customerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="业务员" prop="sellerId">
                     <el-select v-model="saveForm.sellerId" placeholder="请选择">
                        <el-option v-for="item in saveForm_sellerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="预算(万)">
                    <el-input v-model="saveForm.budget"></el-input>
                </el-form-item>
                <el-form-item label="来访时间" prop="guestTime">
					<!-- <el-input type="textarea" v-model="saveForm.addr"></el-input> -->
                     <el-date-picker v-model="saveForm.guestTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="saveForm.remark" placeholder="意向车商,型号等信息"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="saveFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
			</div>
		</el-dialog>

         <!-- 分页 -->
        <div class="pagination">
            <el-pagination background :page-size="pageSize"
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalCount">
            </el-pagination>
        </div>
    </section>
</template>
  
<script>
export default {
  data() {
    var validateGuestDateTime = (rule, value, callback) => {
      alert(typeof value + "======");
      if (value === "" || value == undefined) {
        callback(new Error("请输入姓名"));
      } else {
        alert(value + "------");
      }
      callback();
    };
    return {
      eq_customerId: "",
      conditionDate: "",

      listLoading: false,
      customerOptionLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      saveFormVisible: false, //编辑界面是否显示
      saveLoading: false,
      optionCMD: "新增",
      saveFormRules: {
        customerId: [
          { required: true, message: "请选择客户", trigger: "change" }
        ],
        sellerId: [
          { required: true, message: "请选择业务员", trigger: "change" }
        ],
        guestTime: [
          {
            // validator: validateGuestDateTime,
            // type: "date",
            required: true,
            message: "请选择日期",
            trigger: "blur"
          }
        ]
      },
      saveForm: {
        // customerId: '',
        // sellerId: ''
      },
      saveForm_customerOption: [],
      saveForm_sellerOption: []
    };
  },
  created() {
    // this.listGuestCondition();
    console.log(this.$route.query.id);
  },
  methods: {
    handleCurrentChange(val) {
      //翻页动作
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.listGuestCondition();
    },
    listGuestCondition() {
      let self = this;
      self.listLoading = true;
      var conditionParams = {
        currentPage: self.currentPage,
        pageSize: self.pageSize
      };
      if (this.eq_customerId !== "") {
        conditionParams.customerId = this.eq_customerId;
      }
      if (this.conditionDate != "" && this.conditionDate != null) {
        conditionParams.startTime = this.conditionDate[0].Format(
          "yyyy-MM-dd 00:00:00"
        );
        conditionParams.endTime = this.conditionDate[1].Format(
          "yyyy-MM-dd 23:59:59"
        );
      }
      self.$http
        .get("/sys/guest/listGuestCondition", {
          params: conditionParams
        })
        .then(function(res) {
          //   console.log(res.data);
          self.tableData = res.data.data.resultList;
          self.totalCount = res.data.data.totalCount;
          self.listLoading = false;
        });
    },
    // 新增点击事件
    handlePlus() {
      if (this.$refs["saveForm"]) {
        this.$refs["saveForm"].resetFields();
      }
      //   this.$refs.saveForm.resetFields();
      this.saveFormVisible = true;
      this.saveForm = {
        // customer: {},
        // seller: {}
      };
      this.setOptionCMD("new");
    },
    handleEdit(scope) {
      if (this.$refs["saveForm"]) {
        this.$refs["saveForm"].resetFields();
      }
      this.saveFormVisible = true;
      this.saveForm = Object.assign({}, scope.row);
      this.setOptionCMD("edit");
      //如果是修改操作,则放置客户和业务员的默认值
      this.remoteMethodCustomer(scope.row.customer.name); //  默认客户
      this.saveForm.customerId = scope.row.customer.id + ""; //默认业务员
      this.saveForm.sellerId = scope.row.seller.id + "";
      // this.saveForm.guestTime = new Date(
      //   Date.parse(scope.row.guestTime.replace(/-/g, "/"))
      // );
      this.$message("编辑第" + (scope.$index + 1) + "行");
    },
    handleDelete(scope) {
      // scope.$index, scope.row,scope
      // this.$message.error("删除第" + (index + 1) + "行");
      this.$confirm("确定删除该条访客记录吗? 删除不可恢复!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .get("/sys/guest/deleteGuest", {
            params: { id: scope.row.id }
          })
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.listGuestCondition();
            }
          });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setOptionCMD(cmd) {
      let self = this;
      this.saveForm.cmd = cmd;
      this.optionCMD = cmd == "new" ? "新增" : "编辑";
      //准备业务员列表数据供下拉框使用
      self.$http
        .get("/sys/seller/listSellerAll", {
          params: {}
        })
        .then(function(res) {
          self.saveForm_sellerOption = res.data.data.map(item => {
            return { value: item.id + "", label: item.name };
          });
          console.log(self.saveForm_sellerOption);
        });
    },
    remoteMethodCustomer(query) {
      let self = this;
      this.saveForm_customerOption = [];
      if (query !== "") {
        // console.log(query);
        self.$http
          .get("/sys/customer/listCustomerMatchName", {
            params: {
              name: query
            }
          })
          .then(function(res) {
            this.saveForm_customerOption = res.data.data.map(item => {
              return { value: item.id + "", label: item.name };
            });
            console.log(this.saveForm_customerOption);
          });
      }
    },
    saveSubmit() {
      let self = this;
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗?", "提示", {}).then(() => {
            // alert(this.saveForm.guestTime);
            // this.saveForm.guestTime = this.saveForm.guestTime.Format(
            //   "yyyy-MM-dd hh:mm:ss"
            // );
            delete this.saveForm.customer;
            delete this.saveForm.seller;
            self.saveLoading = true;
            self.$http
              .get("/sys/guest/saveGuest", {
                params: self.saveForm
              })
              .then(res => {
                self.saveLoading = false;
                console.log(res.data.success);
                if (res.data.success) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.listGuestCondition();
                } else {
                  this.$message.error(res.data.data);
                }
                self.saveFormVisible = false;
              });
          });
          //   alert("submit!");
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
