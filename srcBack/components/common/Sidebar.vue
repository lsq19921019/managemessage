<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router 
                background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                          <i :class="subItem.icon"></i>{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <!-- <el-menu-item :index="item.index"> -->
                    <el-menu-item :index="item.index">
                    <!-- <el-menu-item :key="item.index" :value="item.route"> -->
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "el-icon-info",
          index: "base",
          title: "基础设置"
        },
        // {
        //   icon: "el-icon-edit-outline",
        //   index: "guest",
        //   //route 的路由参数配置如下,暂未使用该形式
        //   route: {
        //     path: "/guest",
        //     // name:"/guest",
        //     query: {
        //       //要传的参数
        //       id: "1"
        //     }
        //   },
        //   title: "访客记录"
        // },
        {
          icon: "el-icon-menu",
          index: "mpMenu",
          title: "公众号菜单"
        },
        {
          icon: "el-icon-date",
          index: "sign",
          title: "积分签到",
          subs: [
            {
              icon: "el-icon-setting",
              index: "signConfig",
              title: "签到设置"
            },
            {
              icon: "el-icon-tickets",
              index: "signData",
              title: "签到数据"
            }
          ]
        },
        {
          icon: "el-icon-loading",
          index: "turntable",
          title: "转盘抽奖",
          subs: [
            {
              icon: "el-icon-setting",
              index: "turntableConfig",
              title: "转盘设置"
            },
            {
              icon: "el-icon-tickets",
              index: "turntableData",
              title: "转盘数据"
            }
          ]
        },
        {
          icon: "el-icon-goods",
          index: "score",
          title: "兑换商城",
          subs: [
            {
              icon: "el-icon-setting",
              index: "scoreAward",
              title: "奖品管理"
            },
            {
              icon: "el-icon-check",
              index: "scoreRecord",
              title: "兑换管理"
            }
          ]
        },
        {
          icon: "el-icon-star-on",
          index: "userCenter",
          title: "用户中心",
          subs: [
            {
              icon: "el-icon-caret-left",
              index: "tagManage",
              title: "标签管理"
            },
            {
              icon: "el-icon-tickets",
              index: "fansData",
              title: "粉丝数据"
            }
          ]
        },

        {
          icon: "el-icon-message",
          index: "template",
          title: "模板消息",
          subs: [
            {
              icon: "el-icon-setting",
              index: "templateManage",
              title: "模板管理"
            },
            {
              icon: "el-icon-printer",
              index: "templateMsg",
              title: "消息发送"
            },
            {
              icon: "el-icon-tickets",
              index: "templateRecord",
              title: "发送记录"
            }
          ]
        }
        // {
        //   icon: "el-icon-tickets",
        //   index: "order",
        //   title: "订单管理"
        // },
        // {
        //   icon: "el-icon-bell",
        //   index: "remind",
        //   title: "工作提醒"
        // },
        // {
        //   icon: "el-icon-service",
        //   index: "seller",
        //   title: "业务员"
        // },
        // {
        //   icon: "el-icon-setting",
        //   index: "readme",
        //   title: "自述"
        // },
        // {
        //   icon: "el-icon-menu",
        //   index: "2",
        //   title: "表格",
        //   subs: [
        //     {
        //       index: "basetable",
        //       title: "基础表格"
        //     },
        //     {
        //       index: "vuetable",
        //       title: "Vue表格组件"
        //     }
        //   ]
        // },
        // {
        //   icon: "el-icon-date",
        //   index: "3",
        //   title: "表单",
        //   subs: [
        //     {
        //       index: "baseform",
        //       title: "基本表单"
        //     },
        //     {
        //       index: "vueeditor",
        //       title: "编辑器"
        //     },
        //     {
        //       index: "markdown",
        //       title: "markdown"
        //     },
        //     {
        //       index: "upload",
        //       title: "文件上传"
        //     }
        //   ]
        // },
        // {
        //   icon: "el-icon-star-on",
        //   index: "basecharts",
        //   title: "图表"
        // },
        // {
        //   icon: "el-icon-upload2",
        //   index: "drag",
        //   title: "拖拽"
        // }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 250px;
  left: 0;
  top: 70px;
  bottom: 0;
  background: #2e363f;
}
.sidebar > ul {
  height: 100%;
}
</style>
