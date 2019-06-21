<template>

    <section>
      
		<el-dialog title="系统提示" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
      <div style="margin-bottom:20px;">
        模板同步后，需要重新将需要的模板加入常用，确定继续？
      </div>
                            <div style="display: flex;justify-content: center;align-items: Center;">
                                <el-button @click="syncTemplate" type="primary">保存</el-button>
                                <el-button @click="handleClose" type="info">取消</el-button>
                            </div>
		</el-dialog>
        <el-row>
            <el-button type="primary" @click="showDia">模板同步</el-button>
        </el-row>
        只有加入常用的模板才能在发送模板消息中使用!!!!!
        <el-table :data="templates" v-loading="templatesLoading">
            <el-table-column prop="templateId" label="模板ID"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="example" label="示例"></el-table-column>
            <el-table-column prop="use" label="状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.use == '1'">常用</div>
                    <div v-else-if="scope.row.use == '0'">不常用</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="primary" size="mini" @click="optionTemplateUse(scope)">
                        <span v-if="scope.row.use == '0'">加入常用</span>
                        <span v-else-if="scope.row.use == '1'">取消常用</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
export default {
  data() {
    return {
      templates: [],
      templatesLoading:false,
      dialogVisible:false
    };
  },
  created() {
    this.rTemplates();
  },
  methods: {
    showDia(){
      this.dialogVisible = true;
    },
    handleClose(){
      this.dialogVisible = false;
    },
    syncTemplate() {
      this.$axios
        .get(
          "/mpos/sys/template/syncTemplate/" +
            localStorage.getItem("curr_mpId"),
          {}
        )
        .then(res => {
          this.dialogVisible = false;
          if (res.data.status == 1) {
            this.rTemplates();
            this.$this.$message({
              message: "同步成功",
              type: "success"
            });
          }else{
              this.$message.error("操作失败请联系管理员!");
          }
        });
    },
    rTemplates() {
      this.$axios
        .get(
          "/mpos/sys/template/rTemplates/" + localStorage.getItem("curr_mpId"),
          {}
        )
        .then(res => {
          if (res.data.status == 1) {
            this.templates = res.data.data;
          }
        });
    },
    optionTemplateUse(scope) {
      this.$axios
        .get(
          "/mpos/sys/template/optionTemplateUse/" + localStorage.getItem("curr_mpId"),
          {
            params: {
              templateId: scope.row.templateId,
              use: scope.row.use == 1 ? 0 : 1
            }
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            scope.row.use = scope.row.use == 1 ? 0 : 1;
          }
        });
    }
  }
};
</script>

