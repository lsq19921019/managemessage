<template>
    <section>
        <el-row>
            <el-checkbox v-model="signConfigStatus" @change="optionSignConfigStatus">开启签到</el-checkbox>
        </el-row>
        <el-form :model="signConfig" ref="signConfig" :rules="signConfigRules" >
            <el-row style="margin-top: 20px;" :gutter="20">
                <el-col :span="12">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix"><span>签到积分</span> </div>
                        <el-form-item>
                            <el-input v-model="signConfig.morningScore">
                                <template slot="prepend">上午签到时间: 00:00-12:00 奖励</template>
                                    <template slot="append">积分</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="signConfig.afternoonScore">
                                <template slot="prepend">下午签到时间: 12:00-00:00 奖励</template>
                                    <template slot="append">积分</template>
                            </el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix"> <span>连续签到奖励积分</span></div>
                            <el-form-item>
                            <el-input v-model="signConfig.continueDay">
                                <template slot="prepend">每连续签到</template>
                                    <template slot="append">&nbsp;&nbsp;&nbsp;天</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="signConfig.continueAwardScore">
                                <template slot="prepend">可获得奖励</template>
                                    <template slot="append">积分</template>
                            </el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;" :gutter="20">
                   <el-col :span="12">
                    <el-card class="box-card2">
                        <div slot="header" class="clearfix"><span>可调用代码</span></div>
                        <div style="font-size:12px">签到自动回复的内容可以完全自定义，调用下面的代码即可，包括：</div>
                        <el-col :span="12" >
                            <div class="codeDiv"><span class="codeKey">{nickname}</span><span>用户昵称</span></div>
                            <div class="codeDiv"><span class="codeKey">{signtime}</span><span>最后签到时间</span></div>
                            <div class="codeDiv"><span class="codeKey">{getscore}</span><span>本次获得积分</span></div>
                            <div class="codeDiv"><span class="codeKey">{totalscore}</span><span>当前总积分</span></div>
                            <div class="codeDiv"><span class="codeKey">{continuesigndays}</span><span>连续签到天数</span></div>
                            <div class="codeDiv"><span class="codeKey">{totalsigndays}</span><span>总签到天数</span></div>
                            <div class="codeDiv"><span class="codeKey">{ranking}</span><span>今天签到排名</span></div>
                        </el-col>
                        <el-col :span="12">
                           <div class="codeDiv"><span class="codeKey">{rolerank}</span><span>签到规则和排名</span></div>
                           <div class="codeDiv"><span class="codeKey">{remark}</span><span>尾巴小广告</span></div>
                           <div class="codeDiv"><span class="codeKey">{morningscore}</span><span>早上签到积分</span></div>
                           <div class="codeDiv"><span class="codeKey">{afternoonscore}</span><span>下午签到积分</span></div>
                           <div class="codeDiv"><span class="codeKey">{continueday}</span><span>连续签到几天奖励</span></div>
                           <div class="codeDiv"><span class="codeKey">{continueawardscore}</span><span>奖励几积分</span></div>
                        </el-col>
                    </el-card>
                   </el-col>
                   <el-col :span="12">
                    <el-card class="box-card2">
                        <div slot="header" class="clearfix"><span>签到规则</span></div>
                        <el-form-item>
                            <el-input type="textarea" style="font-size:13px;" :autosize="{ minRows: 13, maxRows: 13}" v-model="signConfig.role"></el-input>
                        </el-form-item>
                    </el-card>
                   </el-col>
            </el-row>
            <el-row style="margin-top: 20px;" :gutter="20">
                <el-col :span="6">
                    <el-card class="box-card3">
                        <div slot="header" class="clearfix"><span>上午签到成功回复</span></div>
                        <el-form-item>
                            <el-input type="textarea" style="font-size:13px;" :autosize="{ minRows: 13, maxRows: 13}" v-model="signConfig.morningSuccessText"></el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card3">
                        <div slot="header" class="clearfix"><span>上午签到失败回复</span></div>
                        <el-form-item>
                            <el-input type="textarea" style="font-size:13px;" :autosize="{ minRows: 13, maxRows: 13}" v-model="signConfig.morningFailText"></el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card3">
                        <div slot="header" class="clearfix"><span>下午签到成功回复</span></div>
                        <el-form-item>
                            <el-input type="textarea" style="font-size:13px;" :autosize="{ minRows: 13, maxRows: 13}" v-model="signConfig.afternoonSuccessText"></el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card3">
                        <div slot="header" class="clearfix"><span>下午签到失败回复</span></div>
                        <el-form-item>
                            <el-input type="textarea" style="font-size:13px;" :autosize="{ minRows: 13, maxRows: 13}" v-model="signConfig.afternoonFailText"></el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;" :gutter="20">
                <el-card class="box-card3">
                    <div slot="header" class="clearfix"><span>广告小尾巴</span>
                        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="addAds">添加广告</el-button>
                    </div>
                    <el-form-item
                        v-for="(remark) in signConfigRemark"
                        :key="remark.key"
                    >
                    <el-row :gutter="20">
                        <el-col :span="11">
                            <el-input v-model="remark.desc">
                                <template slot="prepend">广告文字</template>
                            </el-input>
                        </el-col>
                        <el-col :span="11">
                            <el-input v-model="remark.url">
                                <template slot="prepend">广告链接</template>
                            </el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button @click.prevent="removeRemark(remark)">删除</el-button>
                        </el-col>
                    </el-row>
                    </el-form-item>
                </el-card>
            </el-row>
            <el-row type="flex" justify="center" style="margin-top: 20px;" :gutter="20">
                 <el-button  type="primary" @click="submitForm('signConfig')">提交</el-button>
            </el-row>
        </el-form>
        
    </section>
</template>

<script>
export default {
  data() {
    return {
      signConfig: {},
      signConfigStatus: "",
      signConfigRules: {},
      signConfigRemark: []
    };
  },
  created() {
    this.getSignConfig();
  },
  methods: {
    getSignConfig() {
      let self = this;
      self.$http
        .get(
          "/mpos/sys/sign/getSignConfig/" + localStorage.getItem("curr_mpId"),
          {
            params: {}
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            var data = res.data.data || {};
            self.signConfig = data;
            if (data.status == 1) {
              self.signConfigStatus = true;
            }
            //提供广告小尾巴的数据
            if (
              data.remark !== undefined &&
              data.remark != null &&
              data.remark != ""
            ) {
              var remarksAll = data.remark.split("[{[END]}]");
              console.log(remarksAll);
              for (var i = 0; i < remarksAll.length; i++) {
                if (remarksAll[i] != "") {
                  console.log(remarksAll[i]);
                  var remarkSub = remarksAll[i].split("[{[DESC]}]");
                  self.signConfigRemark.push({
                    desc: remarkSub[0],
                    url: remarkSub[1]
                  });
                }
              }
            }
          }
        });
    },
    optionSignConfigStatus() {
      let self = this;
      this.$confirm(
        (this.signConfigStatus ? "开启" : "关闭") + "签到功能",
        "提示",
        {}
      )
        .then(() => {
          self.$http
            .get(
              "/mpos/sys/sign/optionSignConfigStatus/" +
                localStorage.getItem("curr_mpId") +
                "/" +
                self.signConfigStatus,
              {
                params: {}
              }
            )
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message:
                    this.signConfigStatus == true
                      ? "签到功能开启成功"
                      : "签到功能已关闭",
                  type: "success"
                });
              } else {
                this.$message.error("操作失败!");
              }
            });
        })
        .catch(() => {
          this.signConfigStatus = !this.signConfigStatus;
        });
    },
    addAds() {
      var leng = this.signConfigRemark.length;
      if (leng >= 5) {
        this.$alert("为保证用户体验,广告最多不能超过5个", "提示", {});
        return;
      }
      this.signConfigRemark.push({ desc: "", url: "", key: Date.now() });
    },
    removeRemark(item) {
      var index = this.signConfigRemark.indexOf(item);
      if (index !== -1) {
        this.signConfigRemark.splice(index, 1);
      }
    },
    checkNum(value) {
      //   alert(value);
      if (value === "" || value == undefined) {
        return false;
      }
      var regPos = /^\\d+$/; // 非负整数
      var r = /^\+?[0-9]*$/;
      if (!r.test(value)) {
        return false;
      }
      return true;
    },
    checkReamrk() {
      if (this.signConfigRemark.length > 5) {
        this.$message.error("广告数量不能多于5条,请检查!");
        return false;
      }
      if (this.signConfigRemark.length != 0) {
        for (var i = 0; i < this.signConfigRemark.length; i++) {
          if (
            this.signConfigRemark[i].desc === "" ||
            this.signConfigRemark[i].url === ""
          ) {
            this.$message.error("广告信息有误,请检查!");
            return false;
          }
        }
      }
      return true;
    },
    validData() {
      if (
        !(
          this.checkNum(this.signConfig.morningScore) &&
          this.checkNum(this.signConfig.afternoonScore) &&
          this.checkNum(this.signConfig.continueAwardScore)
        )
      ) {
        this.$message.error("积分信息有误,请检查!");
      }
      if (!this.checkNum(this.signConfig.continueDay)) {
        this.$message.error("签到天数有误,请检查!");
        return false;
      }
      if (!this.checkReamrk()) {
        return false;
      }
      return true;
    },
    submitForm(formName) {
      this.validData();
      var ramarkStr = "";
      this.$confirm(
        "确定提交保存",
        "提示",
        {}
      ).then(() => {
        if (this.signConfigRemark.length != 0) {
          for (var i = 0; i < this.signConfigRemark.length; i++) {
            var tem = ""
              .concat(this.signConfigRemark[i].desc)
              .concat("[{[DESC]}]")
              .concat(this.signConfigRemark[i].url)
              .concat("[{[END]}]");
            ramarkStr = ramarkStr + tem;
          }
        }
        this.signConfig.remark = ramarkStr;
        this.$http
          .get("/mpos/sys/sign/uSignConfig", {
            params: this.signConfig
          })
          .then(res => {
            console.log(res.data);
            if (res.data.status == 1) {
              this.$message({
                message: "签到配置修改成功",
                type: "success"
              });
            } else {
              this.$message.error("操作失败,请联系管理员");
            }
          });
      });
    }
  }
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  min-width: 280px;
}
.box-card2 {
  min-width: 280px;
  height: 350px;
}
.box-card3 input {
  font-size: 13px;
}
.codeDiv {
  width: 100%;
  padding-top: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}
.codeKey {
  background-color: #0e90d2;
  color: white;
  padding-left: 6px;
  padding-right: 6px;
}
</style>

