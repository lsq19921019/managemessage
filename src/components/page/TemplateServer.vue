<template>
    <section>
        <!-- <el-row>
            <el-checkbox v-model="signConfigStatus" @change="optionSignConfigStatus">开启客服消息</el-checkbox>
        </el-row> -->

                            <div style="display: flex;justify-content: center;align-items: Center;margin-bottom:20px">
                                <el-button @click="editTmp('',tmp_list.length)" :disabled="tmp_list&&tmp_list.length==3?true:false" type="success">新增消息模板</el-button>
                            </div>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
        
         <el-form label-width="100px">
                <el-row style="width:80%;margin:0 auto;margin-bottom:20px;" :span="20">
                    <el-col>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix"><span>消息模板2</span> </div>
                            <el-form-item label="消息开关">
                            <el-switch
                            v-model="editData.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                            </el-switch>
                            </el-form-item>
                            <el-form-item label="名称">
                                <el-input placeholder="请输入名称" v-model="editData.name"></el-input>
                            </el-form-item>
                            <el-form-item label="执行时间">
                            <el-time-select
                            @change ="selChangeFun"
                             :editable="false"
                                v-model="editData.doTime"
                                :picker-options="{
                                    start: '00:00',
                                    step: '01:00',
                                    end: '23:30'
                                }"
                                placeholder="选择时间">
                            </el-time-select>
                            </el-form-item>
                            <el-form-item label="消息类型">
                                <el-radio-group v-model="editData.type">
                                    <el-radio v-for = 'item in type_list_1' :label="item.type">{{item.name}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-if="editData.type==1" label="文本内容">
                                <el-input placeholder="请输入文本内容" type="textarea" v-model="editData.textContent"></el-input>
                            </el-form-item>
                            <el-row v-else>
                            <el-form-item label="标题">
                                <el-input placeholder="请输入标题" v-model="editData.title"></el-input>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input placeholder="请输入描述" v-model="editData.description"></el-input>
                            </el-form-item>
                            <el-form-item label="跳转url">
                                <el-input placeholder="请输入跳转url" v-model="editData.clickUrl"></el-input>
                            </el-form-item>
                            <el-form-item label="图片url">
                                <el-input placeholder="请输入图片url" v-model="editData.picUrl"></el-input>
                            </el-form-item>
                            </el-row>
                            <el-form-item label="用户性别">
                                <el-radio-group v-model="editData.userSex">
                                    <el-radio v-for = 'item in sex_list_1' :label="item.type">{{item.name}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div style="display: flex;justify-content: center;align-items: Center;">
                                <el-button @click="saveData(0,editData)" type="primary">保存</el-button>
                                <el-button @click="handleClose" type="info">取消</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
        </el-form>
</el-dialog>

        <el-form label-width="100px" v-for="(item, index) in tmp_list" :key="index">
                <el-row style="width:80%;margin:0 auto;margin-bottom: 20px;" :span="20">
                    <el-col>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix"><span>消息模板{{index+1}}</span> </div>
                            <el-form-item label="消息开关:">
                            <span>{{getSwitchStatusName(item.status)}}</span>
                            </el-form-item>
                            <el-form-item label="名称:">
                            <span>{{item.name}}</span>
                            </el-form-item>
                            <el-form-item label="执行时间:">
                            <span>{{item.doTime}}</span>
                            </el-form-item>
                            <el-form-item label="消息类型:">
                            <span>{{switchType(item.type)}}</span>
                            </el-form-item>
                            <el-form-item v-if="item.type==1" label="文本内容">
                            <span>{{item.textContent}}</span>
                            </el-form-item>
                            <el-row v-else>
                            <el-form-item label="标题:">
                            <span>{{item.title}}</span>
                            </el-form-item>
                            <el-form-item label="描述:">
                            <span>{{item.description}}</span>
                            </el-form-item>
                            <el-form-item label="跳转url:">
                            <span>{{item.clickUrl}}</span>
                            </el-form-item>
                            <el-form-item label="图片url:">
                            <span>{{item.picUrl}}</span>
                            </el-form-item>
                            </el-row>
                            <el-form-item label="用户性别:">
                            <span>{{switchSex(item.userSex)}}</span>
                            </el-form-item>
                            <div style="display: flex;justify-content: center;align-items: Center;">
                                <el-button @click="editTmp(item,index)" type="primary">修改</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
        </el-form>

        
    </section>
</template>

<script>
export default {
  data() {
    return {
        selChange:0,
        editData:'',
        dialogVisible:false,
        tmp_list:[],
      signConfig: {},
      signConfigStatus: "",
      signConfigRules: {},
      signConfigRemark: [],
      switch_val_0:false,
      switch_val_1:false,
      switch_val_2:false,
      msg_text_content_2:'',
      msg_text_content_1:'',
      msg_text_content_0:'',
      send_time_0:'',
      send_time_1:'',
      send_time_2:'',
      msg_name_2:'',
      msg_name_1:'',
      msg_name_0:'',
      msg_imgurl_2:'',
      msg_imgurl_1:'',
      msg_imgurl_0:'',
      msg_tourl_2:'',
      msg_tourl_1:'',
      msg_tourl_0:'',
      msg_desc_2:'',
      msg_desc_1:'',
      msg_desc_0:'',
      msg_title_2:'',
      msg_title_1:'',
      msg_title_0:'',
      sex_0: 0,
      sex_list_0: [
        {
          name: "全部",
          type: 0
        },
        {
          name: "男",
          type: 1
        },
        {
          name: "女",
          type: 2
        }
      ],
      msgType_0: 1,
      type_list_0: [
        {
          name: "文本",
          type: 1
        },
        {
          name: "图文",
          type: 2
        }
      ],
      sex_1: 0,
      sex_list_1: [
        {
          name: "全部",
          type: 0
        },
        {
          name: "男",
          type: 1
        },
        {
          name: "女",
          type: 2
        }
      ],
      msgType_1: 1,
      type_list_1: [
        {
          name: "文本",
          type: 1
        },
        {
          name: "图文",
          type: 2
        }
      ],
      sex_2: 0,
      sex_list_2: [
        {
          name: "全部",
          type: 0
        },
        {
          name: "男",
          type: 1
        },
        {
          name: "女",
          type: 2
        }
      ],
      msgType_2: 1,
      type_list_2: [
        {
          name: "文本",
          type: 1
        },
        {
          name: "图文",
          type: 2
        }
      ],
    };
  },
  created() {
    this.getSignConfig();
    this.getListData();
  },
  mounted() {
      this.getData();
    //   console.log(this.getSwitchStatus(2));
  },
/*  更新或保存客服消息：
http://2o038u1170.iok.la:35375/mpos/sys/kefu/saveConfig/+authId
参数：
id：String 客服消息id，修改信息时需要，若为保存则把值置空;
name:客服消息名称，可随意修改
doTime：String 执行时间，如14:00，则格式为1400;
type:  消息类型。1：文本；2：图文
textContent：type为1时，对应的文本内容
title：type为2时，对应的图文标题
description：type为2时，对应的图文描述
clickUrl：type为2时，对应的图文的图片链接
picUrl：type为2时，对应的图文的图片链接
userSex：发送用户性别。0:全部；1：男；2：女

获取公众号客服消息：
http://2o038u1170.iok.la:35375/mpos/sys/kefu/getConfig/+authId
*/
  methods: {
      selChangeFun(){
          this.selChange = 1;
      },
      editTmp(obj,i){
          if(obj){
                this.editData = '';
                this.dialogVisible = true;
                this.editData = JSON.stringify(obj);
                this.editData = JSON.parse(this.editData);
                // console.log(this.editData.status);
                this.editData.index = i;
                this.editData.status = this.getSwitchBoolean(this.editData.status);
                this.editData.doTime = this.editData.doTime?this.editData.doTime:'';
            }else{
                this.editData = {
                    id:'',
                    name:'',
                    doTime:'',
                    type:1,
                    textContent:'',
                    title:'',
                    description:'',
                    clickUrl:'',
                    picUrl:'',
                    userSex:0,
                    status:false
                };
                this.dialogVisible = true;
                // this.editData.index = i;
            }
        },
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
          this.dialogVisible = false;
						done();
					})
					.catch(_ => {});
			},
      getSwitchStatusName(status){
          return status==0?'关':'开';
      },
      getSwitchBoolean(status){
          return status==0?false:true;
      },
      getSwitchStatus_(status){
          return status?1:0;
      },
      getSwitchStatus(no){
          return this['switch_val_'+no]?1:0;
      },
      getSendTime(no,time){
          return no?this['send_time_'+no]:time;
      },
      switchTime(time){
          return time?time:'';
      },
      switchType(type){
          return type==2?'图文':'文本';
      },
      switchSex(sex){
          switch (parseInt(sex)) {
              case 2:
                  return '女';
                  break;
          
              case 1:
                  return '男';
                  break;
          
              case 0:
                  return '全部';
                  break;
          
              default:
                  break;
          }
      },
      
      getListData(){
          let self = this;
            self.$axios.post(
                "/mpos/sys/kefu/getRecord/" + localStorage.getItem("curr_mpId"),
			      {
                      page:1,
                      pageSize:10
                  }
                )
                .then(res => {
                    // self.tmp_list = res.data.data;
                    console.log(res.data.data);
                                // if (res.data.status == 1) {
                                //     var data = res.data.data || {};
                                //     self.signConfig = data;
                                //     if (data.status == 1) {
                                //     self.signConfigStatus = true;
                                //     }
                                //     //提供广告小尾巴的数据
                                //     if (
                                //     data.remark !== undefined &&
                                //     data.remark != null &&
                                //     data.remark != ""
                                //     ) {
                                //     var remarksAll = data.remark.split("[{[END]}]");
                                //     console.log(remarksAll);
                                //     for (var i = 0; i < remarksAll.length; i++) {
                                //         if (remarksAll[i] != "") {
                                //         console.log(remarksAll[i]);
                                //         var remarkSub = remarksAll[i].split("[{[DESC]}]");
                                //         self.signConfigRemark.push({
                                //             desc: remarkSub[0],
                                //             url: remarkSub[1]
                                //         });
                                //         }
                                //     }
                                //     }
                                // }
                });
      },
      getData(){
          let self = this;
            self.$axios.post(
                "/mpos/sys/kefu/getConfig/" + localStorage.getItem("curr_mpId"),
			      {}
                )
                .then(res => {
                    self.tmp_list = res.data.data;
                    console.log(res.data.data);
                                // if (res.data.status == 1) {
                                //     var data = res.data.data || {};
                                //     self.signConfig = data;
                                //     if (data.status == 1) {
                                //     self.signConfigStatus = true;
                                //     }
                                //     //提供广告小尾巴的数据
                                //     if (
                                //     data.remark !== undefined &&
                                //     data.remark != null &&
                                //     data.remark != ""
                                //     ) {
                                //     var remarksAll = data.remark.split("[{[END]}]");
                                //     console.log(remarksAll);
                                //     for (var i = 0; i < remarksAll.length; i++) {
                                //         if (remarksAll[i] != "") {
                                //         console.log(remarksAll[i]);
                                //         var remarkSub = remarksAll[i].split("[{[DESC]}]");
                                //         self.signConfigRemark.push({
                                //             desc: remarkSub[0],
                                //             url: remarkSub[1]
                                //         });
                                //         }
                                //     }
                                //     }
                                // }
                });
      },
      saveData(no,obj){
          let self = this;
          if(obj){
              if(!obj.doTime){
                    this.$message.error("请选择时间!");
                    return;
              }
            //   obj.doTime = self.getSendTime(null,obj.doTime);
              obj.status = self.getSwitchStatus_(obj.status);
              console.log(obj.status);
          }
          let matchUrl = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
          let datas = obj?JSON.stringify(obj):JSON.stringify({
                          id:'1',
                            name:self['msg_name_'+no],
                            doTime:self.getSendTime(no),
                            type:self['msgType_'+no],
                            textContent:self['msg_text_content_'+no],
                            title:self['msg_title_'+no],
                            description:self['msg_desc_'+no],
                            clickUrl:self['msg_tourl_'+no],
                            picUrl:self['msg_imgurl_'+no],
                            userSex:self['sex_'+no],
                            status:self.getSwitchStatus(no)
                      });
            let tmp_obj = JSON.parse(datas);
            if(tmp_obj.type==2){
                if(!matchUrl.test(tmp_obj.clickUrl)||!matchUrl.test(tmp_obj.picUrl)){
                    this.$message.error("url格式不正确!");
                    self.editData.status = self.getSwitchBoolean(self.editData.status);
                    return;
                }
            }
            let time_check = 0;
            let count = 0;
            if(self.tmp_list.length==1){
                if(obj.id){
                        count=0;
                }else{
                    self.tmp_list.forEach((element,index) => {
                        if(tmp_obj.doTime === element.doTime){
                            count++;
                        }
                    });
                }
            }else if(self.tmp_list.length<3){
                
                if(obj.id){
                    // if(self.selChange){
                        self.tmp_list.forEach((element,index) => {
                            console.log(index);
                            if(index === tmp_obj.index){
                                return true;
                            }
                            if(tmp_obj.doTime === element.doTime){
                                count++;
                            }
                        });
                    // }else{
                    //     count=0;
                    // }
                }else{
                    self.tmp_list.forEach((element,index) => {
                        if(tmp_obj.doTime === element.doTime){
                            count++;
                        }
                    });
                }
            }else{
                if(obj.id){
                    // if(self.selChange){
                        self.tmp_list.forEach((element,index) => {
                            console.log(index);
                            if(index === tmp_obj.index){
                                return true;
                            }
                            if(tmp_obj.doTime === element.doTime){
                                count++;
                            }
                        });
                    // }else{
                    //     count=0;
                    // }
                }else{
                    self.tmp_list.forEach((element,index) => {
                        console.log(index);
                        if(index === tmp_obj.index){
                            return true;
                        }
                        if(tmp_obj.doTime === element.doTime){
                            count++;
                        }
                    });
                }
            }
            if(count>0){
                this.$message.error("时间点有重复!");
                console.log(count);
                this.selChange = 0;
                return;
            }
                this.selChange = 0;
                // return;
            // return;
            self.$axios.post(
                "/mpos/sys/kefu/saveConfig/" + localStorage.getItem("curr_mpId"),
			      { 
			      	data:datas
			      }
                )
                .then(res => {
                    if(obj&&(parseInt(res.data.code)==1000)){
                        self.dialogVisible = false;
                        self.getData();
                        console.log(res);
                        
                    }else if(parseInt(res.data.code)==1000){
                        console.log(res);
                        self.getData();
                    }
                                // if (res.data.status == 1) {
                                //     var data = res.data.data || {};
                                //     self.signConfig = data;
                                //     if (data.status == 1) {
                                //     self.signConfigStatus = true;
                                //     }
                                //     //提供广告小尾巴的数据
                                //     if (
                                //     data.remark !== undefined &&
                                //     data.remark != null &&
                                //     data.remark != ""
                                //     ) {
                                //     var remarksAll = data.remark.split("[{[END]}]");
                                //     console.log(remarksAll);
                                //     for (var i = 0; i < remarksAll.length; i++) {
                                //         if (remarksAll[i] != "") {
                                //         console.log(remarksAll[i]);
                                //         var remarkSub = remarksAll[i].split("[{[DESC]}]");
                                //         self.signConfigRemark.push({
                                //             desc: remarkSub[0],
                                //             url: remarkSub[1]
                                //         });
                                //         }
                                //     }
                                //     }
                                // }
                });
      },
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
        (this.signConfigStatus ? "开启" : "关闭") + "客服消息",
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
.ht40{
    padding:15px 0;
}
</style>

