<template>
    <section>
        <el-form :model="ruleForm2" :rules="rules2" status-icon style="width:600px"  ref="ruleForm2" label-width="160px">
            <el-form-item label="新用户赠送积分数:" prop="defaultScore">
                <el-input v-model="ruleForm2.defaultScore" ></el-input>
            </el-form-item>
            <el-form-item label="新用户赠送转盘次数:" prop="defaultTurnTableTimes">
                <el-input v-model="ruleForm2.defaultTurnTableTimes"></el-input>
            </el-form-item>
            <el-form-item label="公众号单独域名(可空)" prop="domain">
                <el-input v-model="ruleForm2.domain"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
            </el-form-item>
        </el-form>
    </section>
</template>
<script>
export default {
  data() {
    var checkNum = (rule, value, callback) => {
      //   alert(value);
      if (value === "" || value == undefined) {
        return callback(new Error("不能为空"));
        // return;
      }
      console.log(value);
      
      var regPos = /^\\d+$/;// 非负整数
       var r = /^\+?[0-9]*$/;

      console.log(r.test(value));
      if (!r.test(value)) {
        return callback(new Error("请输入数字值"));
      }
      //   if (!Number.isInteger(value)) {
      //   }
      callback();
    };
    return {
      ruleForm2: {
        defaultScore: "",
        defaultTurnTableTimes: "",
        domain: ""
      },
      rules2: {
        defaultScore: [{ validator: checkNum, trigger: "change" }],
        defaultTurnTableTimes: [{ validator: checkNum, trigger: "change" }],
        domain: []
      },
      mpId: ""
    };
  },
  created() {
    this.getMpConfig();
    // this.$store.dispatch('getMp');
  },
  methods: {
    getMpConfig() {
      let self = this;
      self.$http
        .get("/mpos/sys/common/getMpConfig", {
          params: {
            mpId: parseInt(localStorage.getItem("curr_mpId"))
          }
        })
        .then(res => {
          if (res.data.status == "1") {
            var data = res.data.data || {};
            self.ruleForm2 = data;
            // console.log(res.data.data);
          }
        });
    },
    submitForm(formName) {
      let self = this;
      console.log(this.$refs.ruleForm2.validate());
      self.$refs.ruleForm2.validate(valid => {
        if (valid) {
          //   this.$refs.ruleForm2.resetFields();
          self.ruleForm2.mpId = localStorage.getItem("curr_mpId");
          self.$http
            .get("/mpos/sys/common/UMpConfig", {
              params: self.ruleForm2
            })
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.data.message);
              }
            });
        } else {
          //   alert(2);
        }
      });
    }
  }
};
</script>
