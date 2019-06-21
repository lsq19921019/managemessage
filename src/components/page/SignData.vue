<template>
    <section>
        <el-tabs type="border-card" @tab-click="handleTabClick" value="signList">
            <el-tab-pane label="今日签到列表" name="signList">
                <el-table :data="signListData" v-loading="signListDataLoading" height="480" @selection-change="handleSelectionChange" border>
                    <el-table-column  label="头像" width="80" prop="headImgUrl">
                        <template slot-scope="scope">
                        <img  :src="scope.row.headImgUrl" alt="" style="width: 30px;height: 30px">
                        </template>
                        <!-- <img  v-bind:src="headImgUrl" class="image"> -->
                    </el-table-column>
                    <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
                    <el-table-column prop="openId" label="openId" width="280" show-overflow-tooltip resizable></el-table-column>
                    <el-table-column prop="lastSignDate" label="签到时间" width="180"></el-table-column>
                    <el-table-column prop="score" label="当前积分" width="120"></el-table-column>
                    <el-table-column prop="totalScore" label="累计收入积分" width="120"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination background :page-size="pageSize"
                            @current-change ="changePageSignData"
                            layout="prev, pager, next"
                            :total="signListDataCount">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="今日签到排名" name="signRank">配置管理</el-tab-pane> -->
            <el-tab-pane label="累计总积分排行榜" name="scoreRank">
                <el-table :data="scoreRankData" v-loading="scoreRankDataLoading" height="480" @selection-change="handleSelectionChange" border>
                    <el-table-column  label="头像" width="80" prop="headImgUrl">
                        <template slot-scope="scope">
                            <img :src="scope.row.headImgUrl" alt="" style="width: 30px;height: 30px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
                    <el-table-column prop="openId" label="openId" width="280" show-overflow-tooltip resizable></el-table-column>
                    <el-table-column prop="lastSignDate" label="最后签到时间" width="180"></el-table-column>
                    <el-table-column prop="totalScore" label="累计收入积分" width="120"></el-table-column>
                    <el-table-column prop="score" label="当前积分" width="120"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination background :page-size="pageSize"
                            @current-change ="changePageScoreRankData"
                            layout="prev, pager, next"
                            :total="scoreRankDataCount">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="总签到天数排行榜" name="totalSignDayRank">
                <el-table :data="totalSignDayRankData" v-loading="totalSignDayRankLoading" height="480" @selection-change="handleSelectionChange" border>
                    <el-table-column  label="头像" width="80" prop="headImgUrl">
                        <template slot-scope="scope">
                            <img :src="scope.row.headImgUrl" alt="" style="width: 30px;height: 30px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
                    <el-table-column prop="openId" label="openId" width="280" show-overflow-tooltip resizable></el-table-column>
                    <el-table-column prop="totalSignDays" label="总签到天数" width="120"></el-table-column>
                    <el-table-column prop="lastSignDate" label="最后签到时间" width="180"></el-table-column>
                    <!-- <el-table-column prop="totalScore" label="累计收入积分" width="120"></el-table-column>
                    <el-table-column prop="score" label="当前积分" width="120"></el-table-column> -->
                    <el-table-column prop="continueDays" label="连续签到天数" width="120"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination background :page-size="pageSize"
                            @current-change ="changePageTotalSignDay"
                            layout="prev, pager, next"
                            :total="totalSignDayRankCount">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="连续签到天数排行榜" name="continueSignDayRank">
                <el-table :data="continueSignDayRankData" v-loading="continueSignDayRankLoading" height="480" @selection-change="handleSelectionChange" border>
                    <el-table-column  label="头像" width="80" prop="headImgUrl">
                        <template slot-scope="scope">
                            <img :src="scope.row.headImgUrl" alt="" style="width: 30px;height: 30px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
                    <el-table-column prop="openId" label="openId" width="280" show-overflow-tooltip resizable></el-table-column>
                    <el-table-column prop="totalContinueDays" label="总连续签到天数" width="120"></el-table-column>
                    <el-table-column prop="totalSignDays" label="总签到天数" width="120"></el-table-column>
                    <el-table-column prop="lastSignDate" label="最后签到时间" width="180"></el-table-column>
                    <!-- <el-table-column prop="totalScore" label="累计收入积分" width="120"></el-table-column>
                    <el-table-column prop="score" label="当前积分" width="120"></el-table-column> -->
                    
                </el-table>
                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination background :page-size="pageSize"
                            @current-change ="changePageTotalSignDay"
                            layout="prev, pager, next"
                            :total="continueSignDayRankCount">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="每日签到人数统计">每日签到人数统计功能暂未开放</el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
export default {
  data() {
    return {
      optionData: {},
      pageSize: 30,
      signListData: [],
      signListDataLoading: false,
      signListDataCurrentPage: 1,
      signListDataCount: 0,

      scoreRankData: [],
      scoreRankDataLoading: false,
      scoreRankDataCurrentPage: 1,
      scoreRankDataCount: 0,

      totalSignDayRankData: [],
      totalSignDayRankLoading: false,
      totalSignDayRankCurrentPage: 1,
      totalSignDayRankCount: 0,

      continueSignDayRankData: [],
      continueSignDayRankLoading: false,
      coutinueSignDayRankCurrentPage: 1,
      continueSignDayRankCount: 0
    };
  },
  created() {
    this.handleTabClick({ name: "signList" });
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleTabClick(tab) {
      if (tab.name == "signList") {
        if (JSON.stringify(this.signListData) == "[]") {
          this.changePageSignData(1);
        }
      } else if (tab.name == "scoreRank") {
        if (JSON.stringify(this.scoreRankData) == "[]") {
          this.changePageScoreRankData(1);
        }
      } else if (tab.name == "totalSignDayRank") {
        if (JSON.stringify(this.totalSignDayRankData) == "[]") {
          this.changePageTotalSignDay(1);
        }
      } else if (tab.name == "continueSignDayRank") {
        if (JSON.stringify(this.continueSignDayRankData) == "[]") {
          this.changePageContinueSignDay(1);
        }
      }
    },
    changePageSignData(val) {
      this.signListDataCurrentPage = val;
      this.rSignList();
    },
    changePageScoreRankData(val) {
      this.scoreRankDataCurrentPage = val;
      this.rSignDataByCondition("totalScore", "desc", val, 1);
    },
    changePageTotalSignDay(val) {
      this.totalSignDayRankCurrentPage = val;
      this.rSignDataByCondition("totalSignDays", "desc", val, 2);
    },
    changePageContinueSignDay(val) {
      this.coutinueSignDayRankCurrentPage = val;
      this.rSignDataByCondition("totalContinueDays", "desc", val, 3);
    },
    rSignList() {
      this.signListDataLoading = true;
      let self = this;
      this.$http
        .get(
          "/mpos/sys/sign/rSignDatasToday/" + localStorage.getItem("curr_mpId"),
          {
            params: {
              page: this.signListDataCurrentPage,
              pageSize: this.pageSize
            }
          }
        )
        .then(res => {
          this.signListDataLoading = false;
          if (res.data.status == 1) {
            self.signListData = res.data.data.signDatasToday;
            self.signListDataCount = res.data.data.count;
          } else {
            this.$message.error("获取失败, 请联系管理员!");
          }
        });
    },
    rSignDataByCondition(column, sortType, page, tabIndex) {
      this.$http
        .get(
          "/mpos/sys/sign/rSignDatasByCondition/" +
            localStorage.getItem("curr_mpId"),
          {
            params: {
              page: page,
              pageSize: this.pageSize,
              column: column,
              sortType: sortType
            }
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            if (tabIndex == 1) {
              this.scoreRankData = res.data.data.data;
              this.scoreRankDataCount = res.data.data.count;
            } else if (tabIndex == 2) {
              this.totalSignDayRankData = res.data.data.data;
              this.totalSignDayRankCount = res.data.data.count;
            } else {
              this.continueSignDayRankData = res.data.data.data;
              this.continuesSignDayRankCount = res.data.data.count;
            }
          } else {
            this.$message.error("获取失败, 请联系管理员!");
            return "";
          }
        });
    }
  }
};
</script>

