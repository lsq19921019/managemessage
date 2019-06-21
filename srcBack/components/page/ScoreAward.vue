<template>
    <section>
        <el-row>
            <el-button type="primary" icon="el-icon-plus" @click="handlePlus">添加商品</el-button>
        </el-row>
        <el-row :gutter="20">
            <el-table :data="scoreStores" v-loading="scoreStoresLoading">
                <el-table-column prop="id" label="编号" width="60"></el-table-column>
                <el-table-column prop="picUrl" label="图片" width="80">
                    <template slot-scope="scope">
                        <img :src="baseUrl+scope.row.picUrl" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                    <template scope="scope">
                        <span v-if="scope.row.status == '1'">上架中</span>
                        <span v-else-if="scope.row.status == '0'">已下架</span>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsType" label="类型" width="80">
                    <template scope="scope">
                        <span v-if="scope.row.goodsType == '1'">实物</span>
                        <span v-else-if="scope.row.goodsType == '2'">虚拟</span>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="市场价" width="120"></el-table-column>
                <el-table-column prop="payScore" label="所需积分" width="120"></el-table-column>
                <el-table-column prop="stock" label="剩余库存" width="120"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button-group>
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)"></el-button>
                            <el-button type="info" size="mini"  @click="oScoreStoreStatus(scope)">{{scope.row.status == 1 ? '下架' : '上架'}}</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="dScoreStore(scope)"></el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
         <!-- 保存客户信息(新增/修改) -->
        <el-dialog :title="optionCMD" :visible.sync="saveFormVisible" :close-on-click-modal="false">
          <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
            <el-form-item label="标题" prop="title">
              <el-input v-model="saveForm.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="goodsType">
              <template>
                <el-radio-group v-model="saveForm.goodsType">
                  <el-radio :label="1">实物奖品</el-radio>
                  <el-radio :label="2">虚拟奖品</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="市场价" prop="price">
                <el-input v-model="saveForm.price" placeholder="只能填写数字"></el-input>
            </el-form-item>
            <el-form-item label="所需积分" prop="payScore">
              <el-input  v-model="saveForm.payScore" placeholder="只能填写数字"></el-input>
            </el-form-item>
            <el-form-item label="剩余库存" prop="stock">
                <el-input  v-model="saveForm.stock" placeholder="只能填写数字"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <template>
                  <el-radio-group v-model="saveForm.status">
                    <el-radio :label="1">上架</el-radio>
                    <el-radio :label="0">下架</el-radio>
                  </el-radio-group>
                </template>
            </el-form-item>
            <el-form-item label="奖品图片" prop="picUrl">
	             <el-upload
					  class="avatar-uploader"
					  action="/mpos/sys/scoreStore/uploadAwardImg"
					  :data = "upImgQuery"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
			      	  :before-upload="beforeAvatarUpload"
			      	  :key = "saveForm.picUrl"
					  >
					  <img v-if = "saveForm.picUrl" :src="baseUrl+saveForm.picUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
				</el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="saveFormVisible = false">取消</el-button>
            <!--<el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>-->
            <el-button type="primary" @click.native="CandUScoreStore" :loading="saveLoading">提交</el-button>
          </div>
      </el-dialog>
    </section>
</template>

<script>
export default {
  data() {
    return {
      awardStatus: [
        { label: "上架", value: "1" },
        { label: "下架", value: "0" }
      ],
      scoreStores: [],
      scoreStoresLoading: false,
      optionCMD: "新增",
      saveFormVisible: false,
      saveForm: {
      	title : "",
      	goodsType : "",
      	price : "",
      	payScore :"",
      	stock : "",
      	status : "",
      	picUrl : ""
      },
      verify_list : [],//验证数组
      saveLoading: false,
      saveFormRules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goodsType: [
          { required: true, message: "请选择奖品类型", trigger: "blur" }
        ],
        price: [
          { required: true, message: "市场价不能为空" },
		  {
			validator(rule,value,callback,source,options){
				let val = Number(value),
					type = typeof val,
					_isNaN = isNaN(val);
				if(type == "number" && !_isNaN){
					console.log("通过验证");
				}else{
					callback("市场价必须为数字");
				}
			}
		  }
        ],
        payScore: [
          { required: true, message: "所需积分不能为空" },
          {
			validator(rule,value,callback,source,options){
				let val = Number(value),
					type = typeof val,
					_isNaN = isNaN(val);
				if(type == "number" && !_isNaN){
					console.log("通过验证");
				}else{
					callback("所需积分必须为数字");
				}
			}
		  }
        ],
        stock: [
          { required: true, message: "剩余库存不能为空" },
          {
			validator(rule,value,callback,source,options){
				let val = Number(value),
					type = typeof val,
					_isNaN = isNaN(val);
				if(type == "number" && !_isNaN){
					console.log("通过验证");
				}else{
					callback("剩余库存必须为数字");
				}
			}
		  }
        ],
        status: [
          { required: true, message: "请选择上下架状态", trigger: "blur" }
        ],
        picUrl: [{ required: true, message: "请上传商品图片", trigger: "blur" }]
      },
      upImgQuery: {
        mpId: localStorage.getItem("curr_mpId")
      },
      baseUrl :''
    };
  },
  created() {
    this.baseUrl = this.$store.state.baseUrl;
    this.rScoreStore();
  },
  methods: {
  	verfiyNum(str){//验证数字
  		let val = Number(str),
			type = typeof val,
			_isNaN = isNaN(val);
		if(type == "number" && !_isNaN){
			return false;
		}else{
			return true;
		}
  	},
    handlePlus() {
      this.saveFormVisible = true;
      this.saveForm = {
      	title : "",
      	goodsType : "",
      	price : "",
      	payScore :"",
      	stock : "",
      	status : "",
      	picUrl : ""
      };
      this.optionCMD = "新增";
    },
    handleEdit(scope) {
      this.saveFormVisible = true;
      this.saveForm = scope.row;
      this.optionCMD = "修改";
    },
    beforeAvatarUpload(file) {
      const isLt100KB = file.size / 1024 < 101;
      if (!isLt100KB) {
        this.$message.error("上传头像图片大小不能超过 100KB!");
      }
      return isLt100KB;
    },
    handleAvatarSuccess(res, file, fileList) {
      console.log(res);
      	this.saveForm.picUrl = res;
      //------------
//    if(res){
//    	this.saveForm.picUrl = res;
//    }else{
//    	this.saveForm.picUrl = 123;
//    }
      //------------
		
    },
    rScoreStore() {
      this.$axios
        .get(
          "/mpos/sys/scoreStore/rScoreStore/" +
            localStorage.getItem("curr_mpId"),
          {}
        )
        .then(res => {
          if (res.data.status == 1) {
            this.scoreStores = res.data.data;
          } else {
            this.$message.error("操作失败!请联系管理员");
          }
        });
    },
    oScoreStoreStatus(scope) {
      this.$axios
        .get(
          "/mpos/sys/scoreStore/oScoreStoreStatus/" +
            localStorage.getItem("curr_mpId"),
          {
            params: {
              id: scope.row.id,
              status: scope.row.status == 1 ? 0 : 1
            }
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            scope.row.status = scope.row.status == 1 ? 0 : 1;
            this.$message({
              message: "操作成功,请谨慎操作",
              type: "success"
            });
          } else {
            this.$message.error("操作失败!请联系管理员");
          }
        });
    },
    dScoreStore(scope) {
      this.$confirm("确定删除该奖品?", "提示", {
        type: "warning"
      }).then(() => {
        this.$axios
          .get(
            "/mpos/sys/scoreStore/dScoreStore/" +
              localStorage.getItem("curr_mpId"),
            {
              params: {
                id: scope.row.id
              }
            }
          )
          .then(res => {
            if (res.data.status) {
              this.scoreStores.splice(scope.$index, 1);
              this.$message({
                message: "删除成功,请谨慎操作",
                type: "success"
              });
            }
          });
      });
    },
    verify(){
    	let saveForm = this.saveForm;
    	if(saveForm.title == ""){
    		console.log("标题不能为空");	
    	}else{
    		if(saveForm.goodsType == ""){
	    		console.log("类型不能为空");
	    	}else{
	    		if(saveForm.price == ""){
	    			console.log("市场价不能为空");
	    		}else{
	    			if(this.verfiyNum(saveForm.price)){
	    				console.log("市场价必须为数字");
	    			}else{
	    				if(saveForm.payScore ==""){
			    			console.log("所需积分不能为空");
			    		}else{
			    			if(this.verfiyNum(saveForm.payScore)){
			    				console.log("所需积分必须为数字");
			    			}else{
			    				if(saveForm.stock == ""){
	    							console.log("仓库库存不能为空");
	    						}else{
	    							if(this.verfiyNum(saveForm.stock)){
	    								console.log("仓库库存必须为数字");
	    							}else{
	    								if(saveForm.status == "" && saveForm.status != 0){
	    									console.log("状态不能为空");
	    								}else{
	    									if(saveForm.picUrl == ""){
	    										console.log("图片不能为空");
	    									}else{
	    										return true;
	    									}
	    								}
	    							}
	    						}
			    			}
			    		}
	    			}
	    		}
	    	}
    	}
    	return false;
    },
    CandUScoreStore(){//新增和修改
    	console.log(this.saveForm);
    	if(this.verify()){
    		if(this.optionCMD == "新增"){
		    	this.$axios.post(
			      "/mpos/sys/scoreStore/cScoreStore/" + 
			      	localStorage.getItem("curr_mpId"),
			      { 
			      	data:JSON.stringify(this.saveForm)
			      }).then(res=>{
			      	this.saveFormVisible = false;
			      	console.log(res);
			      })
			      console.log("新增");
	    	}else{//修改
	    		this.$axios.post(
			      "mpos/sys/scoreStore/uScoreStore/" + 
			      	localStorage.getItem("curr_mpId"),
			      { 
			      	data:JSON.stringify(this.saveForm)
			      }).then(res=>{
			      	console.log(res);
			      	this.saveFormVisible = false;
			      })
	    		console.log("修改");
	    	}
    	}
    },
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
</style>