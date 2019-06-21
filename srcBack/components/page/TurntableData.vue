<template>
    <section>
        <el-row :gutter="20">
            <el-form v-model="condition"  >
                <el-col :span="4">
                    <el-form-item >
                        <el-select v-model="condition.awardType" clearable  placeholder="选择奖品类型">
                            <el-option label="谢谢参与" value="0"></el-option>
                            <el-option label="赠送积分" value="1"></el-option>
                            <el-option label="赠送实物" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item >
                        <el-input v-model="condition.openId" placeholder="openId" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item >
                        <el-input v-model="condition.nickname" placeholder="用户昵称" clearable>
                            <el-button type="primary" slot="append" icon="el-icon-search" @click="hanldSeach"></el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-col :span="6">
                    <el-input v-model="delOpenId" placeholder="删除指定openId的记录" clearable>
                        <el-button type="primary" slot="append" icon="el-icon-delete" @click="dTTRByOpenId"></el-button>
                    </el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-table :data="record" v-loading="recordLoad">
                <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
                <el-table-column prop="openId" label="openId" width="280" show-overflow-tooltip resizable></el-table-column>
                <el-table-column prop="joinTime" label="抽奖时间" width="160"></el-table-column>
                <el-table-column prop="awardType" label="奖品类型" width="160">
                    <template scope="scope">
                        <span v-if="scope.row.type == '0'">谢谢参与</span>
                        <span v-else-if="scope.row.awardType == '1'">积分奖品</span>
                        <span v-else-if="scope.row.awardType == '2'" >实物奖品</span>
                        <span v-else >谢谢参与</span>
                    </template>
                </el-table-column>
                <el-table-column prop="awardName" label="奖品名称" width="180"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background :page-size="pageSize"
                        @current-change ="rTTRcordByCondition"
                        layout="prev, pager, next"
                        :total="recordCount">
                </el-pagination>
            </div>
        </el-row>
    </section>
</template>

<script>
export default {
  data() {
    return {
      condition: {
        awardType: "",
        openId: "",
        nickname: ""
      },
      delOpenId: "",
      record: [],
      recordLoad: false,
      recordCount: 0,
      pageSize: 30,
      page: 1
    };
  },
  created() {
    this.rTTRcordByCondition(1);
  },
  methods: {
    hanldSeach() {
      this.rTTRcordByCondition(1);
    },
    rTTRcordByCondition(page) {
      this.$http
        .get(
          "/mpos/sys/turntable/rTTRcordByCondition/" +
            localStorage.getItem("curr_mpId"),
          {
            params: {
              awardType: this.condition.awardType,
              openId: this.condition.openId,
              nickname: this.condition.nickname,
              page: page,
              pageSize: this.pageSize
            }
          }
        )
        .then(res => {
          console.log(res.data);
          console.log(res.data.data);
          if (res.data.status == 1) {
            this.record = res.data.data.data;
            this.recordCount = res.data.data.count;
          }
        });
    },
    dTTRByOpenId() {
      if (this.delOpenId !== "") {
        this.$confirm("确定删除该用户记录?删除后将无法恢复!", "提示", {
          type: "warning"
        }).then(() => {
          this.$axios
            .get(
              "/mpos/sys/turntable/dTTRByOpenId/" +
                localStorage.getItem("curr_mpId"),
              {
                params: {
                  openId: this.delOpenId
                }
              }
            )
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: "数据删除成功,请慎重操作!",
                  type: "success"
                });
              } else {
                this.$message.error("操作失败!请联系管理员");
              }
            });
        });
      }
    }
  }
};
</script>

