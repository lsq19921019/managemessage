<template>
    <section>
        <el-row>
            <el-button type="primary" @click="cTag" icon="el-icon-plus">新建标签</el-button>
        </el-row>
        <el-row :gutter="20">
            <el-table :data="tags" v-loading="tagsLoading">
                <el-table-column prop="id" label="编号" width="120"></el-table-column>
                <el-table-column prop="name" label="标签名称" width="200">
                  <template scope="scope">
                    <i class="el-icon-edit" @click="uTag(scope)"></i>
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    <!-- <el-button icon="el-icon-edit" @click="uTag(scope)"></el-button> -->
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="标签下粉丝数" width="200"></el-table-column>
                <el-table-column  label="操作" width="200">
                  <template scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="dTag(scope)"></el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-row>
    </section>
</template>

<script>
export default {
  data() {
    return {
      tags: [],
      tagsLoading: false
    };
  },
  created() {
    this.rTag();
  },
  methods: {
    cTag() {
      this.$prompt("请输入标签名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        console.log(value);
        if (value == "" || value == null) {
          this.$message.error("标签名称不能为空");
        } else {
          this.$axios
            .get(
              "/mpos/sys/usercenter/cTag/" + localStorage.getItem("curr_mpId"),
              {
                params: {
                  name: value
                }
              }
            )
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: "标签添加成功",
                  type: "success"
                });
                this.tags.push(res.data.data);
              } else {
                this.$message.error("操作失败,请联系管理员");
              }
            });
        }
      });
    },
    uTag(scope) {
      var uname = "";
      this.$prompt("请输入标签名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        if (value === "" || value == null) {
          this.$message.error("标签名称不能为空");
        } else {
          uname = value;
          this.$axios
            .get(
              "/mpos/sys/usercenter/uTag/" + localStorage.getItem("curr_mpId"),
              {
                params: {
                  id: scope.row.id,
                  name: value
                }
              }
            )
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: "标签修改成功",
                  type: "success"
                });
                scope.row.name = uname;
              } else {
                this.$message.error("操作失败,请联系管理员");
              }
            });
        }
      });
    },
    dTag(scope) {
      this.$confirm("确定删除该标签?", "提示", {
        type: "warning"
      }).then(() => {
        this.$axios
          .get(
            "/mpos/sys/usercenter/dTag/" + localStorage.getItem("curr_mpId"),
            {
              params: {
                id: scope.row.id
              }
            }
          )
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: "数据删除成功,请慎重操作!",
                type: "success"
              });
              this.tags.splice(scope.$index, 1);
            } else {
              this.$message.error("获取失败,请联系管理员");
            }
          });
      });
    },
    rTag() {
      this.$axios
        .get(
          "/mpos/sys/usercenter/rTags/" + localStorage.getItem("curr_mpId"),
          {}
        )
        .then(res => {
          if (res.data.status == 1) {
            this.tags = res.data.data;
          } else {
            this.$message.error("获取失败,请联系管理员");
          }
        });
    }
  }
};
</script>

