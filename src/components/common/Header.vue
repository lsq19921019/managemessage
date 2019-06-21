<template>
    <section>
    <div class="header">
        <!-- <div class="logo">后台管理系统</div> -->
        
        <div class="user-info">
          
            <el-row style="width:400px;" :gutter="20">
              <!-- <el-col :span="12">
                <i class="el-icon-bell" style="font-size: 27px;color: #f90;"></i>
                <span style="background-color:red; border-radius: 4px; padding: 2px 5px;">{{countRemindUnfinished}}</span> /
                <span>{{countRemindToday}}</span>
              </el-col> -->
              <el-col :span="30">
              <el-select v-model="mpId" @change="changeMpId">
                  <el-option
                    v-for="item in autherInfos"
                    :key="item.authId"
                    :label="item.nickName"
                    :value="item.authId">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-dropdown  @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img class="user-logo" src="../../../static/img/img.jpg">
                        {{username}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginout">退出</el-dropdown-item>
                        <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>

        </div>
    </div>
     <el-dialog title="重置密码"  :visible.sync="saveFormVisible" :close-on-click-modal="false">
         <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="saveForm.password" auto-complete="off" placeholder="最少6位数" style="width:50%;"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
                <el-input v-model="saveForm.verifyCode" placeholder="请输入验证码" style="width:50%; margin-right:20px;"></el-input>
                <el-button @click="getVerifyCode()">{{buttonName}}</el-button>
                <el-button type="primary" @click.native="editPassword" :loading="saveLoading">提交</el-button>
            </el-form-item>
         </el-form>
		</el-dialog>
    </section>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6) {
          callback(new Error("密码长度最少6位"));
        } else {
          callback();
        }
      }
    };
    return {
      name: "admin",
      saveFormVisible: false,
      buttonName: "",
      saveLoading: false,
      countRemindUnfinished: "0",
      countRemindToday: "0",
      saveFormRules: {
        password: [{ validator: validatePass, required: true }],
        verifyCode: [{ required: true, trigger: "blur", message: "验证码必填" }]
      },
      saveForm: {
        password: "",
        verifyCode: ""
      },
      autherInfos: {},
      mpId: ""
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  created() {
    let self = this;
    // this.countRemind();
    // var int = setInterval(function(){self.countRemind()}, 1000*60*60);
    // this.getAutherInfos();
    this.mpId = parseInt(localStorage.getItem("curr_mpId"));
    this.autherInfos = JSON.parse(localStorage.getItem("autherInfos"));
    console.log(this.autherInfos);
    // console.log(this.autherInfos);
  },
  methods: {
    getAutherInfos() {
      let self = this;
      self.$http
        .get("/mpos/sys/common/autherInfos", {
          params: {}
        })
        .then(res => {
          if (res.data.status == "1") {
            var data = res.data.data || {};
            self.autherInfos = data;
            if (data.length > 0) {
              // self.mpId = data[0].authId;
              // self.$store.commit("setMpId", self.mpId);
              // console.log(self.$store.state.mpId);
            }
          }
        });
    },
    changeMpId(mpId) {
      let data = this.autherInfos.filter(item => {
        if (item.authId == mpId) {
          return item;
        }
      })[0];
      // self.$store.commit("setMpId", self.mpId);
      localStorage.setItem("curr_mpId", data.authId);
      localStorage.setItem("curr_serviceTypeInfo", data.serviceTypeInfo);
      location.reload(true);
    },
    countRemind() {
      let self = this;
      self.$http
        .get("/sys/remind/countRemindUnfinished", {
          params: {}
        })
        .then(res => {
          if (res.data.success == true) {
            this.countRemindUnfinished = res.data.data;
          }
        });
      self.$http
        .get("/mpos/sys/remind/countRemindToday", {
          params: {}
        })
        .then(res => {
          if (res.data.success == true) {
            this.countRemindToday = res.data.data;
          }
        });

      console.log(this.countRemindUnfinished + "--" + this.countRemindToday);
    },
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else if (command == "editPassword") {
        this.buttonName = "获取验证码";
        this.saveFormVisible = true;
        if (this.$refs["saveForm"]) {
          this.$refs["saveForm"].resetFields();
        }
      }
    },
    getVerifyCode() {
      let self = this;
      self.$http
        .get("/sys/sysuser/getVerifyCodeEditPassword", {
          params: {}
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.success == true) {
            this.buttonName = "获取成功";
          } else {
            this.buttonName = "验证码获取失败";
          }
        });
    },
    editPassword() {
      let self = this;
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.$confirm("确定修改登录密码?", "提示", {}).then(() => {
            self.saveLoading = true;
            self.$http
              .get("/sys/sysuser/resetPassword", {
                params: self.saveForm
              })
              .then(res => {
                self.saveLoading = false;
                console.log(res.data);
                if (res.data.success) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  // this.listSellerByPage();
                } else {
                  this.$message.error(res.data.message);
                }
                self.saveFormVisible = false;
              });
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  line-height: 70px;
  color: #fff;
}
.header .logo {
  float: left;
  width: 250px;
  text-align: center;
}
.user-info {
  float: right;
  /* padding-right: 50px; */
  font-size: 16px;
  color: #fff;
}
.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #fff;
  cursor: pointer;
  vertical-align: middle;
}
.user-info .user-logo {
  position: absolute;
  left: 0;
  top: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
