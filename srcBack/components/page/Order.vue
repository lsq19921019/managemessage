<template>
  <section>
     <!-- 条件框 -->
      <div class="condition">
          <el-select v-model="eq_customerId" filterable remote clearable  placeholder="请输入客户姓名关键词"
                :remote-method="remoteMethodCustomer" :loading="customerOptionLoading" >
                <el-option v-for="item in saveForm_customerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
             <el-select v-model="eq_orderType" placeholder="订单状态" clearable>
                <el-option  v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker v-model="conditionDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="listOrderCondition"></el-button>
            <el-button type="primary" icon="el-icon-plus" @click="handlePlus()"></el-button>
      </div>

       <!-- 列表 -->
        <el-table :data="tableData"  style="width: 100%" ref="multipleTable" v-loading="listLoading" 
                     :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
            <el-table-column prop="customer.name" label="姓名" width="100" fixed></el-table-column>
            <el-table-column prop="seller.name" label="业务员" width="90" fixed></el-table-column>
            <el-table-column prop="type" label="状态" width="70" fixed>
               <template scope="scope">
                    <span v-if="scope.row.type == '1'" >预定</span>
                    <span v-else-if="scope.row.type == '2'" >退订</span>
                    <span v-else-if="scope.row.type == '3'" >成交</span>
                    <span v-else-if="scope.row.type == '4'" >退款</span>
                    <span v-else >预定</span>
                </template>
            </el-table-column>
            <el-table-column prop="instalment" label="分期/月" width="90" fixed="">
              <template scope="scope">
                    <span v-if="scope.row.instalment == 0">全款</span>
                    <span v-else>{{scope.row.instalment}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="prepay" label="定金/元" width="100" fixed></el-table-column>
            <el-table-column prop="money" label="总额/元" width="100" fixed></el-table-column>
            <el-table-column prop="remark" label="备注" width="220" show-overflow-tooltip fixed></el-table-column>
            <el-table-column prop="reserveTime" label="订单时间" width="125" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dealTime" label="成交时间" width="125" show-overflow-tooltip></el-table-column>
            <el-table-column prop="unsubscribeTime" label="退订时间" width="125" show-overflow-tooltip></el-table-column>
            <el-table-column prop="refundTime" label="退款时间" width="125" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="130" fixed="right">
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
            <el-row >
              <el-col :span="12">
                <el-form-item label="客户姓名" prop="customerId">
                <el-select v-model="saveForm.customerId" filterable remote clearable  placeholder="请输入关键词"
                    :remote-method="remoteMethodCustomer" :loading="customerOptionLoading" >
                    <el-option v-for="item in saveForm_customerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                    <el-form-item label="业务员" prop="sellerId">
                        <el-select v-model="saveForm.sellerId" placeholder="请选择">
                            <el-option v-for="item in saveForm_sellerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="交易状态" prop="type">
                  <el-select v-model="saveForm.type" placeholder="订单状态" clearable :disabled="saveForm.typeSelectDisabled">
                    <el-option  v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分期/月" prop="instalment">
                  <el-input v-model.number="saveForm.instalment" placeholder="0:表示全款"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11">
                <el-form-item label="定金/元">
                    <el-input v-model="saveForm.prepay"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                 <el-form-item label="总额/元">
                  <el-input v-model="saveForm.money"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="预定时间" prop="reserveTime">
                  <el-date-picker v-model="saveForm.reserveTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="退订时间" prop="unsubscribeTime">
                  <el-date-picker v-model="saveForm.unsubscribeTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
              
            <el-row>
              <el-col :span="12">
                <el-form-item label="交易时间" prop="dealTime">
                      <el-date-picker v-model="saveForm.dealTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="退款时间" prop="refundTime">
                      <el-date-picker v-model="saveForm.refundTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                </el-col>
            </el-row> 
              <el-form-item label="备注">
                  <el-input type="textarea" v-model="saveForm.remark" placeholder="购买车商,车型,颜色等配置信息及相关赠送物品信息"></el-input>
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
    return {
      eq_customerId: "",
      conditionDate: "",
      eq_orderType: "",
      listLoading: false,
      customerOptionLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      saveFormVisible: false, //编辑界面是否显示
      saveLoading: false,
      optionCMD: "新增",
      saveForm_customerOption: [],
      saveForm_sellerOption: [],
      orderType: [
        { value: "1", label: "预定" },
        { value: "2", label: "退订" },
        { value: "3", label: "成交" },
        { value: "4", label: "退款" }
      ],
      saveFormRules: {
        customerId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        sellerId: [
          { required: true, message: "请选择业务员", trigger: "change" }
        ],
        type: [{ required: true, message: "订单类型不能为空" }],
        instalment: [
          { required: true, message: "分期不能为空" },
          { type: "number", message: "月数必须为数字值" }
        ],
        reserveTime: [{ required: true, message: "请选择日期" }]
      },
      saveForm: {
        // customerId: '',
        // sellerId: ''
      }
    };
  },
  created() {
    this.listOrderCondition();
  },
  methods: {
    tableRowClassName(row,rowIndex) {
      var orderType = row.row.type;
      if (orderType == "1") {
        return "reserve-row";
      } else if (orderType == "2") {
        return "unsubscribe-row";
      } else if (orderType == "3") {
        return "deal-row";
      } else if (orderType == "4") {
        return "refund-row";
      }
      return "potential-row";
    },
    handleCurrentChange(val) {
      //翻页动作
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.listOrderCondition();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    listOrderCondition() {
      let self = this;
      self.listLoading = true;
      var conditionParams = {
        currentPage: self.currentPage,
        pageSize: self.pageSize
      };
      if (this.eq_customerId !== "") {
        conditionParams.customerId = this.eq_customerId;
      }
      if (this.eq_orderType !== "") {
        conditionParams.type = this.eq_orderType;
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
        .get("/sys/order/listOrderCondition", {
          params: conditionParams
        })
        .then(function(res) {
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
        type: "1",
        typeSelectDisabled: true
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
      this.$message("编辑第" + (scope.$index + 1) + "行");
    },
    handleDelete(scope) {
      this.$confirm("确定删除该订单信息吗? 删除不可恢复!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .get("/sys/order/deleteOrder", {
            params: { id: scope.row.id }
          })
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            }
            this.listOrderCondition();
          });
      });
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
            //转换后台String 日期格式
            // if (
            //   this.saveForm.reserveTime != undefined &&
            //   this.saveForm.reserveTime != ""
            // ) {
            //   this.saveForm.reserveTime = this.saveForm.reserveTime.Format(
            //     "yyyy-MM-dd hh:mm:ss"
            //   );
            // }
            // if (
            //   this.saveForm.unsubscribeTime != undefined &&
            //   this.saveForm.unsubscribeTime != ""
            // ) {
            //   this.saveForm.unsubscribeTime = this.saveForm.unsubscribeTime.Format(
            //     "yyyy-MM-dd hh:mm:ss"
            //   );
            // }
            // if (
            //   this.saveForm.dealTime != undefined &&
            //   this.saveForm.dealTime != ""
            // ) {
            //   this.saveForm.dealTime = this.saveForm.dealTime.Format(
            //     "yyyy-MM-dd hh:mm:ss"
            //   );
            // }
            // if (
            //   this.saveForm.refundTime != undefined &&
            //   this.saveForm.refundTime != ""
            // ) {
            //   this.saveForm.refundTime = this.saveForm.refundTime.Format(
            //     "yyyy-MM-dd hh:mm:ss"
            //   );
            // }
            delete this.saveForm.customer;
            delete this.saveForm.seller;
            self.saveLoading = true;
            self.$http
              .get("/sys/order/saveOrder", {
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
                  this.listOrderCondition();
                } else {
                  this.$message.error(res.data.data);
                }
                self.saveFormVisible = false;
              });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>