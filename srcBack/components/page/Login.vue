<template>
    <div class="login-wrap">
        <div class="ms-title">公众号管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <div class="login-name">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                </div>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="ENTER YOUR PASSWORD" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#ff4949;">{{ruleForm.loginMessage}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      ruleForm: {
        username: "admin",
        password: "",
        loginMessage: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    // alert(1);
  },
  methods: {
    submitForm(formName) {
      const self = this;
      // self.$http.get("/sys/customer/getCustomerById?id=1").then(function(res){
      //     console.log(res.data);
      // })
      // console.log(self.$store.state.mpId);

      // self.$store.commit("setMpId", "5");

      // console.log(self.$store.state.mpId);

      this.ruleForm.loginMessage = "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.$http
            .get("/mpos/sys/sysUser/ajaxLogin", {
              params: {
                username: this.ruleForm.username,
                password: this.ruleForm.password
              }
            })
            .then(function(res) {
              console.log(res.data);
              if (res.data.status == 0) {
                this.ruleForm.loginMessage = res.data.message;
              } else {
                //登录成功以后获取默认操作的公众号
                self.$http
                  .get("/mpos/sys/common/autherInfos", {
                    params: {}
                  })
                  .then(res => {
                    if (res.data.status == "1") {
                      var autherInfos = res.data.data || {};
                      // self.autherInfos = data;
                      if (autherInfos.length > 0) {
                        // self.mpId = data[0].authId;
                        // self.$store.commit("setMpId", autherInfos[0].mpId);
                        // self.$store.commit('setAutherInfos',autherInfos);
                        // console.log(self.$store.state.mpId);
                        // console.log(self.$store.state.autherInfos);

                        localStorage.setItem("curr_mpId", autherInfos[0].authId);
                        localStorage.setItem("curr_serviceTypeInfo",autherInfos[0].serviceTypeInfo)
                        localStorage.setItem(
                          "autherInfos",
                          JSON.stringify(autherInfos)
                        );
                         self.$router.replace("/base");
                      }
                    }
                  });
               
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

      // self.$refs[formName].validate((valid) => {
      //     if (valid) {
      //         localStorage.setItem('ms_username',self.ruleForm.username);
      //         self.$router.push('/readme');
      //     } else {
      //         console.log('error submit!!');
      //         return false;
      //     }
      // });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  /*background: #fff;*/
}
.login-name {
  display: none;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>