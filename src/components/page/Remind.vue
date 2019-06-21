<template>
  <section>
      <div class="condition">
        <el-select v-model="eq_isFinished" placeholder="任务状态" clearable>
            <el-option  v-for="item in remindFinishedType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker v-model="conditionDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="listRemindCondition"></el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handlePlus()"></el-button>
      </div>

      <!-- 列表 -->
    <el-table :data="tableData"  style="width: 100%" ref="multipleTable" v-loading="listLoading" 
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
        <el-table-column prop="seller.name" label="业务员" width="100"></el-table-column>
        <el-table-column prop="content" label="任务内容" width="300"></el-table-column>
        <el-table-column prop="isFinished" label="完成状态" width="120">
            <template scope="scope">
                <span v-if="scope.row.isFinished == '1'" >已完成</span>
                <span v-else-if="scope.row.isFinished == '0'" >未完成</span>
            </template>
        </el-table-column>
        <el-table-column prop="isRemind" label="提醒状态" width="120">
            <template scope="scope">
                <span v-if="scope.row.isRemind == '1'" >已提醒</span>
                <span v-else-if="scope.row.isRemind == '0'" >未提醒</span>
            </template>
         </el-table-column>
         <el-table-column prop="remindType" label="提醒方式" width="120">
            <template scope="scope">
                <span v-if="scope.row.remindType == '1'" >邮件</span>
                <span v-else-if="scope.row.remindType == '0'" >短信</span>
            </template>
         </el-table-column>
        <el-table-column prop="remindTime" label="提醒时间" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="130">
            <template scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope)"></el-button>
            </template>
        </el-table-column>
    </el-table>

     <!-- 保存客户信息(新增/修改) -->
        <el-dialog :title="optionCMD" :visible.sync="saveFormVisible" :close-on-click-modal="false">
			<el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
                <el-form-item label="业务员" prop="sellerId">
                    <el-select v-model="saveForm.sellerId" placeholder="请选择">
                        <el-option v-for="item in saveForm_sellerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="完成状态" prop="isFinished">
                  <el-select v-model="saveForm.isFinished" clearable :disabled="saveForm.isFinishedSelectDisabled">
                    <el-option  v-for="item in remindFinishedType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="提醒时间" prop="remindTime">
                  <el-date-picker v-model="saveForm.remindTime" type="datetime" placeholder="选择日期时间"
                         :picker-options="pickerOptions1" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item label="提醒方式">
                   <el-radio v-model="saveForm.remindType" label="1">邮件</el-radio>
                   <el-radio v-model="saveForm.remindType" label="2">短信</el-radio>
                </el-form-item>
                <el-form-item label="任务内容">
                    <el-input type="textarea" v-model="saveForm.remark" placeholder="提醒要做什么事情;例: 提醒XX保养/保险等"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="saveFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
			</div>
		</el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      eq_isFinished: "",
      conditionDate: "",

      listLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      saveFormVisible: false, //编辑界面是否显示
      saveLoading: false,
      optionCMD: "新增",
      saveForm_sellerOption: [],
      remindFinishedType: [
        { value: "0", label: "未完成" },
        { value: "1", label: "已完成" }
      ],
      saveFormRules: {
        sellerId: [
          { required: true, message: "请选择业务员", trigger: "change" }
        ],
        isFinished: [
          { required: true, message: "请选择任务状态", trigger: "change" }
        ],
        remindTime: [{ required: true, message: "请选择日期", trigger: "blur" }]
      },
      saveForm: {
        cmd: "NEW"
      }
    };
  },
  created() {
    this.listRemindCondition();
  },
  methods: {
    tableRowClassName(row, rowIndex) {
      var remindIsFinished = row.row.isFinished;
      if (remindIsFinished == "1") {
        return "deal-row";
      }
    },
    listRemindCondition() {
      let self = this;
      self.listLoading = true;
      var conditionParams = {
        isFinished: self.eq_isFinished,
        currentPage: self.currentPage,
        pageSize: self.pageSize
      };

      if (this.conditionDate != "" && this.conditionDate != null) {
        conditionParams.startTime = this.conditionDate[0].Format(
          "yyyy-MM-dd hh:mm:ss"
        );
        conditionParams.endTime = this.conditionDate[1].Format(
          "yyyy-MM-dd 23:59:59"
        );
      }
      self.$http
        .get("/sys/remind/listRemindCondition", {
          params: conditionParams
        })
        .then(function(res) {
          self.tableData = res.data.data.resultList;
          self.totalCount = res.data.data.totalCount;
          self.listLoading = false;
        });
    },
    handleCurrentChange(val) {
      //翻页动作
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.listRemindCondition();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新增点击事件
    handlePlus() {
      if (this.$refs["saveForm"]) {
        this.$refs["saveForm"].resetFields();
      }
      //   this.$refs.saveForm.resetFields();
      this.saveFormVisible = true;
      this.saveForm = {
        remindType: "1",
        isFinished: "0",
        isRemind: "0",
        isFinishedSelectDisabled: true
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
      this.$message("编辑第" + (scope.$index + 1) + "行");
    },
    handleDelete(scope) {
      this.$confirm("确定删除该提醒信息吗? 删除不可恢复!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .get("/sys/remind/deleteRemind", {
            params: { id: scope.row.id }
          })
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            }
            this.listRemindCondition();
          });
      });
    },
    saveSubmit() {
      let self = this;
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗?", "提示", {}).then(() => {
             delete this.saveForm.seller;
            self.saveLoading = true;
            self.$http
              .get("/sys/remind/saveRemind", {
                headers: "",
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
                  this.listRemindCondition();
                } else {
                  this.$message.error(res.data.data);
                }
                self.saveFormVisible = false;
              });
          });
        }
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
    }
  }
};
</script>
