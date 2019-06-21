<template>
    <section>
        <el-row :gutter="20">
            <el-form v-model="condition"  >
                <el-col :span="4">
                    <el-form-item >
                        <el-select v-model="condition.subType"  placeholder="选择奖品类型">
                            <el-option label="全部用户" value="-1"></el-option>
                            <el-option label="已关注" value="1"></el-option>
                            <el-option label="未关注" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item >
                        <el-select v-model="condition.sex"   placeholder="性别">
                            <el-option label="全部性别" value="-1"></el-option>
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                            <el-option label="未知" value="0"></el-option>
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

                <el-col :span="4" :offset="3">
                    <el-button type="primary" @click="syncUser">同步用户</el-button>
                </el-col>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="users" v-loading="usersLoading">
                <el-table-column  label="头像" width="60" prop="headImgUrl">
                    <template slot-scope="scope">
                        <img :src="scope.row.headImgUrl" alt="" style="width: 30px;height: 30px">
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" width="120" show-overflow-tooltip resizable></el-table-column>
                <el-table-column prop="openId" label="openId" width="260" show-overflow-tooltip resizable></el-table-column>
                <el-table-column prop="subscribe" label="关注状态" width="80">
                    <template scope="scope">
                        <span v-if="scope.row.subscribe == '0'">未关注</span>
                        <span v-else-if="scope.row.subscribe == '1'">已关注</span>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="当前积分" width="80">
                    <template scope="scope">
                        <span v-if="scope.row.score == null">0</span>
                        <span v-else>{{scope.row.score}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="subscribeTime" label="授权时间" width="160" :formatter="formatDate"></el-table-column>
                <el-table-column label="操作" width="340">
                <template scope="scope">
                    <el-button-group>
                    <el-button type="primary" size="mini" @click="handleEdit(scope)" circle>打标签</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(scope)" circle>加黑名单</el-button>
                    <el-button type="info" size="mini" @click="handleDelete(scope)" circle>积分记录</el-button>
                    <el-button type="success" size="mini" @click="handleDelete(scope)" circle>他的推广</el-button>
                    </el-button-group>
                </template>
                <!-- <template scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope)"></el-button>
                </template> -->
            </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background :page-size="condition.pageSize"
                        @current-change ="rUserByCondition"
                        layout="prev, pager, next"
                        :total="usersCount">
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
        subType: "-1",
        sex: "-1",
        tagId: "",
        nickname: "",
        openId: "",
        page: 1,
        pageSize: 30
      },
      users: [],
      usersLoading: false,
      usersCount: 0
    };
  },
  created() {
    this.rUserByCondition(1);
  },
  methods: {
    formatDate(row, column) {
      var time = new Date(row.subscribeTime * 1000);
      return time.Format("yyyy-MM-dd hh:mm:ss");
    },
    syncUser() {
      this.$confirm("开始同步粉丝数据", "提示", {}).then(() => {
        this.$axios
          .get(
            "/mpos/sys/usercenter/sync/" + localStorage.getItem("curr_mpId"),
            {}
          )
          .then(res => {
            this.$message({
              message: res.data
            });
          });
      });
    },
    hanldSeach() {
      this.rUserByCondition(1);
    },
    rUserByCondition(page) {
        this.condition.page = page;
      this.$axios
        .get(
          "/mpos/sys/usercenter/rUserByCondition/" +
            localStorage.getItem("curr_mpId"),
          {
            params: this.condition
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            this.users = res.data.data.data;
            this.usersCount = res.data.data.count;
          }
        });
    }
  }
};
</script>

