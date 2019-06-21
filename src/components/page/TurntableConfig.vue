<template>
    <section>
        <el-row>
            <el-checkbox v-model="ttStatus" @change="optinonttstatus">开启转盘(建议配置好奖品等信息后再开启)</el-checkbox>
        </el-row>
        <el-row style="margin-top: 20px;" :gutter="20">
            <el-form :model="ttConfig" ref="ttConfig">
                <el-card>
                    <div slot="header" class="clearfix"><span>基础配置</span></div>
                    <el-col>
                        <el-form-item>
                            <el-input v-model="ttConfig.payScore">
                                <template slot="prepend">抽奖消耗积分</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item>
                            <el-input v-model="ttConfig.dayTimes">
                                <template slot="prepend">每人每天可玩次数</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 用户每日抽奖次数会在晚上12点重新开始计算 -->
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="ttConfig.everyDaysCanWin">
                                <template slot="prepend">中奖总频率限制,每</template>
                                <template slot="append">天</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="ttConfig.everyDaysCanWinTimes">
                                <template slot="prepend">只能中奖</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="ttConfig.entityEveryDaysCanWin">
                                <template slot="prepend">实物中奖频率限制,每</template>
                                <template slot="append">天</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="ttConfig.entityEveryDaysCanWinTimes">
                                <template slot="prepend">只能中实物奖品</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="ttConfig.scoreEveryDaysCanWin">
                                <template slot="prepend">积分中奖频率限制,每</template>
                                <template slot="append">天</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="ttConfig.scoreEveryDaysCanWinTimes">
                                <template slot="prepend">只能中积分奖品</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-col :span="12">
                            <el-card>
                                <div slot="header" class="clearfix"><span>转盘规则 可调用代码</span></div>
                                <div class="codeDiv"><span class="codeKey">{payscore}</span><span>单局消耗积分</span></div>
                                <div class="codeDiv"><span class="codeKey">{daytimes}</span><span>每天可玩次数</span></div>
                            </el-card>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <el-input v-model="ttConfig.rule" type="textarea" style="font-size:13px;" :autosize="{ minRows: 7, maxRows: 7}"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col>
                        <el-card>
                            <div slot="header" class="clearfix"><span>奖品设置</span></div>
                            <div class="setRule">
                                1、奖品设置中请至少设置一个谢谢参与和奖品;<br>
                                2、设置奖品数量，每当有人中奖该奖品数量减一（设置奖品数量为0，则该奖品抽中的几率为0）；<br>
                                3、中奖基数为不小于0的整数，设置上限为10000，中奖基数越大，则中奖几率越大（设置中奖基数为0，则该奖品抽中的几率为0);<br>
                                4、【必中】在谢谢参与基数为0的情况下，抽中库存为0的商品，则自动再次抽中该商品。<br>
                            </div>
                             <el-table
							    ref="singleTable"
							    :data="awards"
							    style="width: 100%">
							    <el-table-column
							      label="必中"
							      width="50">
							       <template slot-scope="scope">
							        <el-radio v-model="radio" :label = "scope.$index" @change = 'pitchOn'>{{space}}</el-radio>
							      </template>
							    </el-table-column>
							    <el-table-column
							      label="奖品名称"
							      width="120">
							      <template slot-scope="scope">
							        <el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>							      
							      </template>
							    </el-table-column>
							    <el-table-column
							      label="奖品类型"
							      width="150">
							      <template slot-scope="scope">
						        	<el-select 
						        		v-model="scope.row.type" 
						        		placeholder="请选择" 
						        		@change = 'awardsTypeChange(scope.row.type,scope.$index)' 
						        		:value-key = "'select-'+scope.$index">
									    <el-option
									      v-for="item in options"
									      :key="item.value"
									      :label="item.label"
									      :value="item.value">
									    </el-option>
									  </el-select>
							      </template>
							    </el-table-column>
							    <el-table-column
							      label="中奖基数">
							      <template slot-scope="scope">
							        <el-input v-model="scope.row.rate" ></el-input>
							      </template>
							    </el-table-column>
							    <el-table-column
							      label="中奖数量">
							      <template slot-scope="scope">
							        <el-input v-model="scope.row.stock" ></el-input>
							      </template>
							    </el-table-column>
							    <el-table-column
							      label="奖品备注">
							      <template slot-scope="scope">
							        <el-input v-model="scope.row.remark" :placeholder="scope.row.type == 1 ? '请填写积分数量':''" ></el-input>
							      </template>
							    </el-table-column>
							      <!--property="pic"-->
							    <el-table-column
							      label="奖品图片">
							      <template slot-scope="scope">

							       <el-upload
									  class="avatar-uploader"
									  action="/mpos/sys/turntable/uploadAwardImg"
									  :data = "upImgQuery"
									  :show-file-list="false"
									  :on-success="handleAvatarSuccess"
							      	  :before-upload="beforeAvatarUpload"
									  >
									  <img v-if="scope.row.pic" :src="baseUrl+scope.row.pic" class="avatar" @click = 'getAwardsIdx(scope.$index)'>
									  <i v-else class="el-icon-plus avatar-uploader-icon" @click = 'getAwardsIdx(scope.$index)'></i>
									</el-upload>
							      </template>							      
							    </el-table-column>
							  </el-table>
                        	<!-- <div @click = 'postData'>提交上传</div> -->
                            <el-button type="primary" @click ="postData">提交</el-button>
                        </el-card>
                    </el-col>
                </el-card>
                
            </el-form>
        </el-row>
    </section>
</template>
<script>
export default {
  data() {
    return {
      space: "", //仅仅是用来占位的，为了不显示文字
      ttStatus: false,
      ttConfig: {},
      awards: [],
      radio: -1,
      baseUrl: "",
      imgaeIdx: -1,
      options: [
        {
          value: 0,
          label: "谢谢参与"
        },
        {
          value: 1,
          label: "赠送积分"
        },
        {
          value: 2,
          label: "赠送实物"
        }
      ],
      upImgQuery: {
        mpId: localStorage.getItem("curr_mpId")
      }
    };
  },
  created() {
    this.baseUrl = this.$store.state.baseUrl;
    this.rTTConfig();
  },
  methods: {
    postData() {
      //   console.log(this.$http);
      //   console.log(this);
      let self = this;
      //   console.log(self.ttConfig);
      if (this.verify()) {
        this.$confirm("确定提交保存", "提示", {}).then(() => {
          this.$axios
            .post(
              "/mpos/sys/turntable/uTTConfig/" +
                localStorage.getItem("curr_mpId"),
              {
                data: JSON.stringify({
                  config: self.ttConfig,
                  awards: self.awards
                })
              }
            )
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: "转盘配置修改成功",
                  type: "success"
                });
              } else {
                this.$message.error("操作失败!请联系管理员");
              }
            });
        });
      }
    },
    verify() {
      let isAjax = false;
      this.awards.forEach((item, idx) => {
        if (item.name !== "") {
          if (item.rate !== "") {
            if (item.pic !== "") {
              if (item.stock !== "") {
                if (item.type == 1) {
                  if (item.remark != "") {
                    // return true;
                    isAjax = true;
                  } else {
                    this.$message.error("积分奖品备注不能为空!");
                    // return false;
                  }
                } else {
                  //   return true;
                  isAjax = true;
                }
              } else {
                this.$message.error("奖品数量不能为空!");
                // return false;
              }
            } else {
              this.$message.error("图片不能为空!");
              //   return false;
            }
          } else {
            this.$message.error("中奖基数不能为空!");
            // return false;
          }
        } else {
          this.$message.error("奖品名称不能为空!");
          //   return false;
        }
      });
      return isAjax;
    },
    awardsTypeChange(type, idx) {
      //   this.awards[idx].stock = "";
      //   this.awards[idx].remark = "";
    },
    getAwardsIdx(idx) {
      this.imgaeIdx = idx;
    },
    handleAvatarSuccess(res, file, fileList) {
      console.log(res);
      // this.awards[this.imgaeIdx].pic = URL.createObjectURL(file.raw);
      this.awards[this.imgaeIdx].pic = res;
    },
    beforeAvatarUpload(file) {
      const isLt100KB = file.size / 1024 < 101;
      if (!isLt100KB) {
        this.$message.error("上传头像图片大小不能超过 100KB!");
      }
      return isLt100KB;
    },
    pitchOn() {
      this.awards.forEach((item, idx) => {
        if (this.radio == idx) {
          //   console.log(this.awards[idx]);
          item.isDefault = 1;
        } else {
          item.isDefault = 0;
        }
      });
    },
    rTTConfig() {
      this.$http
        .get(
          "/mpos/sys/turntable/rTTConfig/" + localStorage.getItem("curr_mpId"),
          { params: {} }
        )
        .then(res => {
          if (res.data.status == 1) {
            if (res.data.data.config.status == 1) {
              this.ttStatus = true;
            }
            this.ttConfig = res.data.data.config;
            this.awards = res.data.data.awards;
            this.awards.forEach((item, idx) => {
              if (item.isDefault == 1) {
                this.radio = idx;
              }
            });
          } else {
          }
        });
    },
    optinonttstatus() {
      let self = this;
      this.$confirm(
        (this.ttStatus ? "开启" : "关闭") + "转盘抽奖功能",
        "提示",
        {}
      )
        .then(() => {
          self.$http
            .get(
              "/mpos/sys/turntable/optionStatus/" +
                localStorage.getItem("curr_mpId") +
                "/" +
                self.ttStatus,
              {
                params: {}
              }
            )
            .then(res => {
              console.log(res.status);
              if (res.data.status == 1) {
                this.$message({
                  message:
                    this.ttStatus == true
                      ? "转盘抽奖功能开启成功"
                      : "转盘抽奖功能已关闭",
                  type: "success"
                });
              } else {
                this.$message.error("操作失败!请联系管理员");
              }
            });
        })
        .catch(() => {
          this.ttStatus = !this.ttStatus;
        });
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.el-upload--text {
  width: 50px;
  height: 50px;
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
.setRule {
  font-size: 13px;
}
</style>

