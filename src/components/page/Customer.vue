<<template>
    <section>
        <!-- 条件框 -->
        <div class="condition">
            <el-input class="condition-input" v-model="like_name" placeholder="客户名关键字" clearable @keyup.enter.native="listCustomerCondition"></el-input>
            <el-input class="condition-input" v-model="like_phoneNum" placeholder="电话" clearable @keyup.enter.native="listCustomerCondition"></el-input>
            <el-select v-model="eq_type" placeholder="客户状态" clearable>
                <el-option  v-for="item in customerType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="listCustomerCondition"></el-button>
            <el-button type="primary" icon="el-icon-plus" @click="handlePlus"></el-button>
        </div>
    
        <!-- 列表 -->
        <el-table :data="tableData" style="width: 100%" ref="multipleTable" v-loading="listLoading" 
                  @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column prop="id" label="编号"  width="0" v-if="show"></el-table-column> -->
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="type" label="状态" width="80">
                <template scope="scope">
                    <span v-if="scope.row.type == '0'">潜在</span>
                    <span v-else-if="scope.row.type == '1'">预定</span>
                    <span v-else-if="scope.row.type == '2'" >退订</span>
                    <span v-else-if="scope.row.type == '3'" >成交</span>
                    <span v-else-if="scope.row.type == '4'" >退款</span>
                    <span v-else >潜在</span>
                </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="80" :formatter="formatSex"></el-table-column>    
            <el-table-column prop="phoneNum" label="电话" width="140"></el-table-column>
            <el-table-column prop="addr" label="住址" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="card" label="身份证" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="birthday" label="生日" width="80"></el-table-column>
            <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination background :page-size="pageSize"
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalCount">
            </el-pagination>
        </div>

        <!-- 保存客户信息(新增/修改) -->
        <el-dialog :title="optionCMD" :visible.sync="saveFormVisible" :close-on-click-modal="false">
			<el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="saveForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="电话">
					<el-input v-model="saveForm.phoneNum"></el-input>
				</el-form-item>
                <el-form-item label="身份证">
                    <el-input v-model="saveForm.card"></el-input>
                </el-form-item>
                <el-form-item label="地址">
					<el-input type="textarea" v-model="saveForm.addr"></el-input>
				</el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="saveForm.remark" placeholder="客户基本属性信息,例:XX介绍,XX活动得知,可空"></el-input>
                </el-form-item>
				<!-- <el-form-item label="性别">
					<el-radio-group v-model="saveForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<!-- <el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item> -->
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
    // 判断重名
    var validataName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        console.log(this.saveForm.id + "-----");
        console.log(this.saveForm.name);
        let self = this;
        self.$http
          .get("/sys/customer/verifyName", {
            params: {
              name: self.saveForm.name
            }
          })
          .then(res => {
            console.log(res.data.data);
            if (
              res.data.data.vilidity == true ||
              (res.data.data.vilidity == false &&
                res.data.data.id == this.saveForm.id)
            ) {
              callback();
            } else {
              callback(new Error("重名了! 添加前缀标识,例:某某村_"));
            }
          });
      }
    };
    return {
      like_name: "",
      like_phoneNum: "",
      eq_type: "",
      listLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      saveFormVisible: false, //编辑界面是否显示
      saveLoading: false,
      optionCMD: "新增",
      customerType: [
        { value: "0", label: "潜在"},
        { value: "1", label: "预定" },
        { value: "2", label: "退订" },
        { value: "3", label: "成交" },
        { value: "4", label: "退款" }
      ],
      saveFormRules: {
        name: [
          {
            validator: validataName,
            required: true,
            trigger: "blur"
          }
        ]
      },
      saveForm: {
        cmd: "NEW",
        id: 0
        // phoneNum: '',
        // card: '',
        // addr: '',
        // remark: ''
      }
    };
  },
  created() {
    this.listCustomerCondition();
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
    //性别现实转换
    formatSex: function(row, column) {
      return row.sex == "1" ? "男" : row.sex == "0" ? "女" : "未知";
    },
    handleCurrentChange(val) {
      //翻页动作
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.listCustomerCondition();
    },
    listCustomerCondition() {
      let self = this;
      self.listLoading = true;
      self.$http
        .get("/sys/customer/listCustomerCondition", {
          params: {
            name: self.like_name,
            phoneNum: self.like_phoneNum,
            type: self.eq_type,
            currentPage: self.currentPage,
            pageSize: self.pageSize
          }
        })
        .then(function(res) {
          console.log(res.data);
          self.tableData = res.data.data.resultList;
          self.totalCount = res.data.data.totalCount;
          self.listLoading = false;
        });
    },
    saveSubmit() {
      let self = this;
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗?", "提示", {}).then(() => {
            self.saveLoading = true;
            self.$http
              .get("/sys/customer/saveCustomer", {
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
                  this.listCustomerCondition();
                } else {
                  this.$message.error(res.data.data);
                }
                self.saveFormVisible = false;
              });
          });
        }
      });
    },
    // 编辑点击事件
    handleEdit(scope) {
      // scope.$index, scope.row,scope
      if (this.$refs["saveForm"]) {
        this.$refs["saveForm"].resetFields();
      }
      this.saveFormVisible = true;
      this.saveForm = Object.assign({}, scope.row);
      this.setOptionCMD("edit");
      // this.saveForm.sex = parseInt(this.saveForm.sex);
      this.$message("编辑第" + (scope.$index + 1) + "行");
    },
    // 新增点击事件
    handlePlus() {
      if (this.$refs["saveForm"]) {
        this.$refs["saveForm"].resetFields();
      }
      //   this.$refs.saveForm.resetFields();
      this.saveFormVisible = 'true';
      this.saveForm = {};
      this.setOptionCMD("new");
    },
    //删除点击事件
    handleDelete(scope) {
      //先判断该可否能否删除
      this.$http
        .get("/sys/customer/verifyDeleteCustomer", {
          params: {
            id: scope.row.id
          }
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.data == "1") {
            this.$confirm(
              "确定删除客户: " + scope.row.name + " 信息吗? 删除不可恢复!",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              this.$http
                .get("/sys/customer/deleteCustomer", {
                  params: { id: scope.row.id }
                })
                .then(res => {
                  if (res.data.success) {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    });
                  }
                  this.listCustomerCondition();
                });
            });
          } else {
            this.$message.error(
              "客户: " + scope.row.name + "的信息被引用,无法直接删除!"
            );
          }
        });
      //   this.$message.error("删除第" + (index + 1) + "行");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setOptionCMD(cmd) {
      this.saveForm.cmd = cmd;
      this.optionCMD = cmd == "new" ? "新增" : "编辑";
    }
  },
  mounted() {
    // this.restaurants = this.listCustomerMatchName();
  }
};
</script>

<style>
.condition-input {
  width: 180px;
  /* padding: 0 15px 0 0px; */
}
</style>

