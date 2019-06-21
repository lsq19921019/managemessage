<template>
  <section>
      <div class="condition">
          <el-button type="primary" icon="el-icon-plus" @click="handlePlus()"></el-button>
      </div>

      <!-- 列表 -->
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" v-loading="listLoading" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column prop="id" label="编号"  width="0" v-if="show"></el-table-column> -->
            <el-table-column prop="name" label="姓名" width="160"></el-table-column>
            <el-table-column prop="phoneNum" label="电话" width="210"></el-table-column>
            <el-table-column prop="qq" label="QQ" width="250"></el-table-column>
            <el-table-column prop="address" label="住址" width="350"></el-table-column>
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
					<el-input v-model.trim="saveForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="电话" prop="phoneNum">
					      <el-input v-model.number.trim="saveForm.phoneNum" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model.trim="saveForm.qq" placeholder="请输入QQ号码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址">
					<el-input v-model.trim="saveForm.address" type="textarea"></el-input>
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
      listLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      saveFormVisible: false, //编辑界面是否显示
      saveLoading: false,
      optionCMD: "新增",
      saveFormRules: {
        name: [
            { required: true, trigger: "blur",message: "姓名必填"}
        ],
        phoneNum: [
            {required: true,  message: "手机号必填"},
        ],
        qq: [
            {required: true, message: "QQ号必填"},
            // {type: 'number', message: "QQ号纯数字"}
        ]
      },
      saveForm: {
        cmd: "NEW",
        id: 0
      }
    };
  },
  created() {
    this.listSellerByPage();
  },
  methods: {
    handleCurrentChange(val) {
      //翻页动作
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.listCustomerCondition();
    },
    listSellerByPage() {
      let self = this;
      self.listLoading = true;
      console.log(self.like_name);
      self.$http
        .get("/sys/seller/listSellerByPage", {
          params: {
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setOptionCMD(cmd) {
      this.saveForm.cmd = cmd;
      this.optionCMD = cmd == "new" ? "新增" : "编辑";
    },
    saveSubmit() {
      let self = this;
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗?", "提示", {}).then(() => {
            self.saveLoading = true;
            self.$http
              .get("/sys/seller/saveSeller", {
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
                  this.listSellerByPage();
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
      this.saveFormVisible = true;
      this.saveForm = {};
      this.setOptionCMD("new");
    },
    //删除点击事件
    handleDelete(scope) {
      //先判断该可否能否删除
      this.$http
        .get("/sys/seller/verifyDeleteSeller", {
          params: {
            id: scope.row.id
          }
        })
        .then(res => {
          if (res.data.data == "1") {
            this.$confirm(
              "确定删除业务员: " + scope.row.name + " 信息吗? 删除不可恢复!",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              this.$http
                .get("/sys/seller/deleteSeller", {
                  params: { id: scope.row.id }
                })
                .then(res => {
                  if (res.data.success) {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    });
                  }
                  this.listSellerByPage();
                });
            });
          } else {
            this.$message.error(
              "业务员: " + scope.row.name + "的信息被引用,无法直接删除!"
            );
          }
        });
      //   this.$message.error("删除第" + (index + 1) + "行");
    },
  }
};
</script>

