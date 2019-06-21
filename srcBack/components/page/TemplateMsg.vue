<template>
 	<div>
 		<el-row class = 'ht40'>
 			  <el-radio-group v-model="sex">
			    <el-radio v-for = 'item in sex_list' :label="item.type">{{item.name}}</el-radio>
			  </el-radio-group>
 		</el-row>
 		<el-row class = 'mgb20'>
 			<el-select v-model="select_tId" placeholder="请选择" @change = "changeTemplate">
			    <el-option
			      v-for=" (item,idx) in template_list"
			      :key="item.templateId"
			      :label="item.title"
			      :value="idx"
			      >
			    </el-option>
		  	</el-select>
 		</el-row>
 		<el-row class = 'mgb20'>
 			<el-col :span = "12">
 				<el-transfer v-model="select_sheng" :data="sheng" :props = "transfer_props" @change = "getCityList" :titles = 'sheng_title'></el-transfer>
 			</el-col>
 			<el-col :span = "12">
 				<el-transfer v-model="select_city" :data="city" :props = "transfer_props" :titles = 'city_title'></el-transfer>
 			</el-col>
 		</el-row>
 		<el-row >
			<el-col :span = "18"  class = 'mgb20'>
 				<el-col :span = "4" class = 'line-ht40-center'>跳转地址：</el-col>
 				<el-col :span = "20">
 					<el-input v-model = "link_url"></el-input>
 				</el-col> 				
 			</el-col>
 			<el-col :span = '18' v-for = "(item,index) in input_list" class = 'mgb20'>
	 			<el-row :key = "'input_'+index">
		 			<template v-for = '_item in item' >
		 				<el-col :span="getInputLength(item.length)" v-if = "_item.indexOf('DATA') != -1" >
		 						<el-input type="text" v-model="post_obj[_item.split('.')[0]]" :key = "'input-'+index"></el-input>		 						
		 				</el-col>
		 				<el-col :span="4"  v-if = "_item.indexOf('DATA') == -1" class = 'line-ht40-center'>
		 					{{_item}}					
		 				</el-col>
		 			</template>
	 			</el-row> 				
 			</el-col>
 			<el-col :span = '6' style = "white-space: pre-line;">{{select_template.example}}</el-col>
 		</el-row>
 		<el-row>
 			<el-col :span = "12">
 				<el-button type="primary" @click = "postData()" class = 'center'>提交发送</el-button> 				
 			</el-col>
 			<el-col :span = '12'>
 				<el-button type="primary" @click = "rCount" class = 'center' >推送人数</el-button> 				
 			</el-col>
 		</el-row>
 	</div>
</template>
<script>
import siteData from "../../../static/js/cities.js";
export default {
  data() {
    return {
      sheng: [],
      select_tId: 0,
      select_sheng: [],
      sheng_title: ["可选省份", "已选省份"],
      city: [],
      select_city: [],
      city_title: ["可选市级", "已选市级"],
      transfer_props: {
        key: "text",
        label: "text"
      },
      sex: 0,
      sex_list: [
        {
          name: "不限",
          type: 0
        },
        {
          name: "未知",
          type: -1
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
      input_list: [],
      post_obj: {},
      link_url: "",
      template_list: [],
      select_template: { example: "", content: "" }
    };
  },
  methods: {
    changeTemplate(e) {
      this.select_template = this.template_list[e];
      this.transformStr(this.select_template.content);
    },
    getTemplateData() {
      this.$http
        .get(
          "/mpos/sys/template/rUseTemplates/" +
            localStorage.getItem("curr_mpId"),
          { params: {} }
        )
        .then(res => {
          this.template_list = res.data.data;

          if (
            this.template_list[0] != undefined &&
            JSON.stringify(this.template_list[0]) != "{}"
          ) {
            this.select_template = this.template_list[0];
            this.transformStr(this.select_template.content);
            // this.select_template.example;
          }
        });
    },
    tidyPostData() {
      let self = this,
        post_arr = [],
        obj = null,
        post_data = "",
        post_url = "",
        provinces = this.select_sheng,
        citys = this.select_city.map(item => {
          if (item.indexOf("/") == -1) {
            return item;
          } else {
            return item.split("/")[1].slice(0, -1);
          }
        });
      this.input_list.forEach(item => {
        item.forEach(_item => {
          if (_item.indexOf("DATA") != -1) {
            obj = {};
            obj.key = _item.split(".")[0];
            obj.value = this.post_obj[_item.split(".")[0]];
            post_arr.push(obj);
          }
        });
      });
      post_data = JSON.stringify({
        templateId: self.select_template.templateId,
        mpId: localStorage.getItem("curr_mpId").toString,
        sexId: self.sex.toString(),
        url: self.link_url.toString(),
        provinces: provinces.toString(),
        citys: citys.toString(),
        data: post_arr
      });
      return post_data;
    },
    postData() {
      if (
		this.select_template == undefined ||
		this.select_template.templateId == undefined ||
        JSON.stringify(this.select_template) == "{}"
      ) {
        this.$alert(
          "模板必选,不能为空!!!!请先添加常用模板后进行选择!",
          "模板为空",
          {}
        );
        return;
      }
      let post_data = this.tidyPostData();
      this.$confirm("确定提交并发送模板消息?", "提示", {
        type: "warning"
      }).then(() => {
        this.$axios
          .post(
            "/mpos/sys/template/sendTemplate/" +
              localStorage.getItem("curr_mpId"),
            {
              data: post_data
            }
          )
          .then(res => {
            console.log(res);
            console.log(res.data);
          });
      });
    },
    rCount() {
      let post_data = this.tidyPostData();
      this.$axios
        .post("/mpos/sys/template/count/" + localStorage.getItem("curr_mpId"), {
          data: post_data
        })
        .then(res => {
          console.log(res);
          console.log(res.data);
          if (res.data.status == 1) {
            this.$alert(
              "当前匹配到的人数为:  " + res.data.data + " 位",
              "人数统计",
              {}
            );
          } else {
            this.$message.error("操作失败请联系管理员!");
          }
        });
    },
    getInputLength(len) {
      switch (len) {
        case 2:
          return 20;
          break;
        case 3:
          return 10;
          break;
        default:
          return 24;
      }
    },
    getCityList() {
      this.city = [];
      let fliterList = [];
      this.sheng.forEach((item, idx) => {
        if (this.select_sheng.indexOf(item.text) != -1) {
          fliterList = item.children.map(_item => {
            if (_item.text.includes(item.text)) {
              return _item;
            } else {
              _item.text = item.text + "/" + _item.text;
              return _item;
            }
          });
          this.city.push(...fliterList);
        }
      });
    },
    transformStr(str) {
      this.input_list = [];
      this.post_obj = {};
      let arr = str.replace(/(\n)/g, ",").split(",");
      let str_arr = arr.filter((item, idx) => {
        if (item) {
          return item;
        }
      });
      str_arr = str_arr.map(item => {
        item = item.split(/({{)|(}})/g).filter(_item => {
          if (_item != "" && _item != "{{" && _item != "}}" && _item) {
            return _item;
          }
        });
        return item;
      });
      str_arr.forEach((item, idx) => {
        if (idx == 0) {
          item.unshift("标题：");
        } else if (idx == str_arr.length - 1) {
          if (item.length < 2) {
            item.unshift("消息尾巴");
          }
        }
        item.forEach(_item => {
          if (_item.indexOf("DATA") != -1) {
            this.post_obj[_item.split(".")[0]] = "";
          }
        });
      });
      this.input_list = str_arr;
    }
  },
  created() {
    this.sheng = siteData;
    this.getTemplateData();
  }
};
</script>
<style scoped>
.center {
  margin: 0 auto;
}
.ht40 {
  height: 40px;
}
.line-ht40-center {
  text-align: center;
  line-height: 40px;
}
.mgb20 {
  margin-bottom: 20px;
}
</style>