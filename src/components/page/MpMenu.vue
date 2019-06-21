<template>
	<section>
		<el-button type="primary" icon="el-icon-plus" v-show="data5.length < 3" size="mini" @click = 'appMune'></el-button>
		<el-row :gutter="20">
			<!-- <el-col :span="12" style="minWidth:310px;">
            <el-tabs type="border-card" tabPosition="bottom" style="height: 300px;">
                <el-tab-pane label="用户管理">

                </el-tab-pane>
                <el-tab-pane label="配置管理">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            </el-tabs>
        </el-col> -->
			<el-col :span="8" style="minWidth:300px">
				<div class="block">
					<el-tree 
						:data="data5" 
						:props="defaultProps" 
						node-key="id" 
						default-expand-all
					  	:expand-on-click-node="false"
						@node-click="handleNodeClick"
						:render-content="renderContent">
					</el-tree>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="optionMenuData">
					<template></template>
					<template v-if='nowData'>
						<el-row class='optionMenuData-title-row'>
							<el-col :span="8" class='optionMenuData-title-name'>{{nowData.name}}</el-col>
							<el-col :span='16'>
								<el-button type="text" size="medium " class='fr' @click = "deleteMune">
									删除菜单
								</el-button>
							</el-col>
						</el-row>
						<el-row class='frist-hint' v-if='nowData.subButton.length > 0'>
							已添加子菜单,尽可设置菜单名称。
						</el-row>
						<el-row class='m-t30'>
							<el-col :span="4" class='mune-name'>
								菜单名称
							</el-col>
							<el-col :span="16">
								<!--<el-input v-model="input_text" placeholder="请输入内容" size = 'small'></el-input>-->
								<el-input v-model="nowData.name" placeholder="请输入内容" size='small'></el-input>
								<div class='input_hint'>字数不超过5个汉字或15个字母</div>
							</el-col>
						</el-row>
						<template v-if='nowData.subButton.length <= 0'>
							<el-row>
								<el-col :span='4' class='submune-title'>子菜单内容</el-col>
								<el-radio-group v-model="nowData.innerType" @change='changeType'>
									<el-radio :label="0" class='submune-radio'>点击菜单</el-radio>
									<el-radio :label="1" class='submune-radio'>跳转网页</el-radio>
									<el-radio :label="2" class='submune-radio'>微信小程序</el-radio>
								</el-radio-group>
							</el-row>
							<div>
								<!--平台模块-->
								<template v-if="nowData.innerType == 0">
									<div class='platform-list-center'>
										<el-row v-for="item in platform_list" class='platfor-item'>
											<el-radio v-model='nowData.key' :label='item.key' :disabled  =  "item.disabled ">{{item.name}}</el-radio>
										</el-row>
									</div>
								</template>
								<!--跳转网页模块-->
								<template v-if="nowData.innerType == 1">
									<div class='web-center'>
										<el-row class='web-title'>
											点击订阅者会跳到以下链接
										</el-row>
										<el-row class='web-input'>
											<el-col :span="4" class='web-name'>
												页面地址
											</el-col>
											<el-col :span="20">
												<el-input v-model="nowData.url" placeholder="请输入内容" size='small'></el-input>
												<div class='input_hint'>必须以http://或https://开头</div>
											</el-col>
										</el-row>
										<el-table :data="web_list" style="width: 100%">
											<el-table-column prop="name" label="名称" width='100'>
											</el-table-column>
											<el-table-column prop="url" label="链接">
											</el-table-column>
										</el-table>
									</div>
								</template>
								<!--微信小程序-->
								<template v-if="nowData.innerType == 2">
									<div class="wx-xcx">
										<div class='wx-box'>
											<div>小程序AppID <span class='cl-dd514c'>（必填）</span></div>
											<div>
												<el-input v-model="nowData.appId" placeholder="请输入内容"></el-input>
											</div>
											<div>仅支持当前公众号关联的小程序</div>
										</div>
										<div class='wx-box'>
											<div>小程序页面<span class='cl-dd514c'>（必填）</span></div>
											<div>
												<el-input v-model="nowData.pagePath" placeholder="请输入内容"></el-input>
											</div>
										</div>
										<div class='wx-box'>
											<div>备用网页 <span class="cl-dd514c">（必填）</span></div>
											<div>
												<el-input v-model="nowData.url" placeholder="请输入内容"></el-input>
											</div>
											<div>（旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。）</div>
										</div>
									</div>
								</template>
							</div>
						</template>
					</template>
				</div>
			</el-col>
		</el-row>
		<el-row style = "margin-top:20px;">
			<el-col :span = "12">
				<el-button type="primary" @click='postData'>先本地保存</el-button>
			</el-col>
			<el-col :span = "12">				
				<el-button type="primary" @click='effectMenu'>再发布生效</el-button>
			</el-col>
		</el-row>
	</section>
</template>
<script>
let Oid = 100000;
export default {
  data() {
    return {
      input_text: "",
      ruleForm2: {
        defaultScore: "",
        defaultTurnTableTimes: "",
        domain: ""
      },
      platform_list: [
        {
          name: "签到",
          key: "MPOS_SIGNKEY",
          disabled: false
        },
        {
          name: "生成二维码",
          key: "WEI_ZHI",
          disabled: true
        }
      ],
      web_list: [
        {
          name: "转盘",
          url: "/index.html#turntable/"
        },
        {
          name: "积分签到",
          url: "/index.html#scorestore/"
        }
      ],
      data5: [],
      href_mpId: "",
      mpId: "",
      defaultProps: {
        children: "subButton",
        label: "name"
      },
      nowData: null,
      showPlusBtn: true,
      baseUrl: ""
    };
  },
  created() {
    this.baseUrl = this.$store.state.baseUrl;
    this.href_mpId = localStorage.getItem("curr_mpId");
    this.web_list.map(item => {
      item.url = this.baseUrl + item.url + this.href_mpId;
      return item;
    });
    this.getMpMenu();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      if (this.data5.indexOf(data) != -1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.append(data)}
              >
                添加子菜单
              </el-button>
            </span>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }
    },
    deleteMune() {
      let idx = this.data5.indexOf(this.nowData);
      if (idx != -1) {
        this.data5.splice(idx, 1);
      } else {
        this.data5.forEach((item, index) => {
          idx = item.subButton.indexOf(this.nowData);
          if (idx > -1) {
            return item.subButton.splice(idx, 1);
          }
        });
      }
    },
    changeType() {
      let data_type = this.nowData.innerType;
      if (data_type == 0) {
        this.nowData.type = "click";
      } else if (data_type == 1 || data_type == 2) {
        this.nowData.key = "";
        this.nowData.type = "view";
      }
    },
    postData(post_type) {
      let [pass, idx, sub_idx, list, list_len, sub_len] = [
        true,
        0,
        sub_idx,
        this.data5,
        this.data5.length,
        0
      ];
      while (pass && idx < list.length) {
        if (list[idx].subButton.length > 0) {
          [sub_idx, sub_len] = [0, list[idx].subButton.length];
          while (pass && sub_idx < sub_len) {
            if (this.verify(list[idx].subButton[sub_idx])) {
              pass = false;
            }
            sub_idx++;
          }
        } else {
          if (list[idx].name !== "") {
            pass = false;
          }
        }
        idx++;
      }
      if (pass) {
        let self = this;
        this.$confirm("确定保存?", "提示", {
          type: "warning"
        }).then(() => {
          this.$axios
            .post(
              "/mpos/sys/mpMenu/saveWxMenu/" +
                localStorage.getItem("curr_mpId"),
              {
                data: JSON.stringify(self.data5)
              }
            )
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              } else {
                this.$message.error("操作失败!请联系管理员");
              }
            });
        });
      }
    },
    effectMenu() {
      this.$confirm("确定发布?", "提示", {
        type: "warning"
      }).then(() => {
        this.$axios
          .post(
            "/mpos/sys/mpMenu/effectMenu/" + localStorage.getItem("curr_mpId")
          )
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: "生效成功",
                type: "success"
              });
            } else {
              this.$message.error("操作失败!请联系管理员");
            }
          });
      });
    },
    verify(data) {
      if (data.name !== "") {
        if (data.innerType == 0) {
          if (data.key !== "") {
            console.log("通过验证");
          } else {
            // console.log("菜单点击必须选择")
            this.$message.error("菜单点击必须选择");
            return true;
          }
        } else if (data.innerType == 1 || data.innerType == 2) {
          if (data.url !== "") {
            if (data.innerType == 2) {
              if (data.appId !== "") {
                if (data.pagePath !== "") {
                  console.log("通过验证");
                } else {
                  // console.log('pagePath不能为空')
                  this.$message.error("小程序页面不能为空");
                  return true;
                }
              } else {
                this.$message.error("小程序appId不能为空");
                return true;
              }
            } else {
              console.log("通过验证");
            }
          } else {
            // console.log("url不能留空")
            this.$message.error("页面地址不能为空");
            return true;
          }
        }
      } else {
        // console.log("菜单名不能为空")
        this.$message.error("菜单名不能为空");
        return true;
      }
    },
    getMpMenu() {
      let self = this;
      self.$http
        .get(
          "/mpos/sys/mpMenu/getMpMenu/" + localStorage.getItem("curr_mpId"),
          {
            params: {}
          }
        )
        .then(res => {
          if (res.data.status == "1") {
            self.data5 = res.data.data;
          }
        });
    },
    CreatMune(name) {
      [
        this.appId,
        this.id,
        this.innerType,
        this.key,
        this.mediaId,
        this.name,
        this.pagePath,
        this.parentId,
        this.rank,
        this.subButton,
        this.type,
        this.url
      ] = ["", Oid, 0, "", "", name, "", 0, 0, [], "click", ""];
    },
    appMune() {
      this.data5.push(new this.CreatMune("主菜单"));
    },
    append(data) {
      if (data.subButton.length < 5) {
        Oid++;
        //					function CreatMune (){
        //						[ this.appId,this.id,this.innerType,this.key,this.mediaId,this.name,this.pagePath,this.parentId,this.rank,this.subButton,this.type,this.url] =
        //						["",Oid,0,'','','子菜单',"",0,0,[],"view",""]
        //					}
        data.subButton.push(new this.CreatMune("子菜单"));
      } else {
        // console.log('子菜单已达到上限')
        this.$message.error("该节点子菜单已达到上限,不能添加!");
      }
    },

    //			remove(node, data) {
    //				const parent = node.parent;
    //				const children = parent.data.children || parent.data;
    //				const index = children.findIndex(d => d.id === data.id);
    //				children.splice(index, 1);
    //			},
    handleNodeClick(data, a, b) {
      //				console.log(data);
      //				console.log(a);
      //   a.data.name="haha";
      //				console.log(b);
      //				console.log(this.nowData)
      this.nowData = data;
      this.input_text = data.name;
      console.log(this.nowData);
    }
  }
};
</script>
</script>

<style>
.fl {
  float: left;
}

.fr {
  float: right;
}

.cl-dd514c {
  color: #dd514c;
}

.m-t30 {
  margin-top: 30px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.optionMenuData {
  box-sizing: border-box;
  min-width: 400px;
  padding: 0 15px;
  background-color: #ebeef5;
  width: 100%;
  height: 600px;
}

.optionMenuData .optionMenuData-title-row {
  border-bottom: 1px solid gray;
}

.optionMenuData .optionMenuData-title-row .optionMenuData-title-name {
  font-size: 15px;
  line-height: 36px;
}

.optionMenuData .frist-hint {
  margin-top: 20px;
  font-size: 14px;
  color: #8d8d8d;
  line-height: 1;
}

.optionMenuData .mune-name {
  font-size: 14px;
  line-height: 32px;
}

.optionMenuData .input_hint {
  font-size: 14px;
  color: #8d8d8d;
  line-height: 20px;
}

.optionMenuData .submune-title {
  font-size: 14px;
  line-height: 32px;
}

.optionMenuData .submune-radio {
  line-height: 34px;
}

.optionMenuData .platform-list-center {
  box-sizing: border-box;
  padding: 0 20px;
  background: white;
}

.optionMenuData .platform-list-center .platfor-item {
  line-height: 45px;
}

.optionMenuData .web-center {
  padding: 0 20px;
  font-size: 14px;
  color: #8d8d8d;
  background: white;
}

.optionMenuData .web-center .web-title {
  line-height: 50px;
}

.optionMenuData .web-center .web-name {
  color: black;
  line-height: 32px;
}

.optionMenuData .web-center .web-input {
  padding-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
}

.optionMenuData .wx-xcx {
  padding: 20px 20px;
  font-size: 14px;
  line-height: 28px;
  background: white;
}

.optionMenuData .wx-xcx .wx-box {
  margin-bottom: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>