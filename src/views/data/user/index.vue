<template>
  <div class="app-container">
    <div class="panel-wrapper">
      <panel-group :data="satisticsData"></panel-group>
    </div>
    <div class="row between">
      <div class="table-tabTitle">
        <span class="table-tabInfo">最近数据</span>
      </div>
      <el-button size="mini" type="text" @click="myhandleQuery"
        >更多>>></el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="userData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      tooltip-effect="light"
      stripe
    >
      <el-table-column
        prop="fileName"
        label="文件名"
        :show-overflow-tooltip="true"
        width="220"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="evidenceTypeName"
        label="数据类型"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="originVersion"
        label="起始版本"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="描述信息"
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="260"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-opened"
            @click="handleView(scope.row)"
            v-hasPermi="['edg:evidence:content']"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="row between" style="margin-top: 15px">
      <div class="table-tabTitle">
        <span class="table-tabInfo">最近操作记录</span>
      </div>
      <el-button size="mini" type="text" @click="recordhandleQuery"
        >更多>>></el-button
      >
    </div>
    <el-table v-loading="loading" :data="handleData" row-key="nodeId" stripe>
      <el-table-column
        prop="fileName"
        label="文件名"
        :show-overflow-tooltip="true"
        width="220"
      ></el-table-column>
      <el-table-column
        prop="evidenceTypeName"
        label="数据类型"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="描述信息"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="optTypeName"
        label="操作类型"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="operator"
        label="操作执行人"
        align="center"
        width="160"
      ></el-table-column>
    </el-table>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <div class="table-topTitle">
          <span class="table-tabInfo">能源数据被引用占比</span>
        </div>
        <pie-chart id="bing-container" :data="pieData" style="height: 300px" />
      </el-col>
      <el-col :span="16">
        <div class="table-topTitle">
          <span class="table-tabInfo">能源数据被引用次数(TOP10)</span>
        </div>
        <x-bar-chart
          id="strip-container"
          :data="xBarData"
          style="height: 300px"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  /** 最新数据列表 */
  userEvidenceList,

  /** 最近操作列表 */
  userHandleList,

  /** 操作统计 */
  handleType,

  /** 被引用次数 */
  quoteTotal,

  /** 被引用top10 */
  quoteTop,

  /** 获取数据列表详情 */
  evidenceNodeList,
} from "@/api/edg/evidence";
//import { Chart, Util } from "@antv/g2";
import PanelGroup from "../statistics/index/chart/PanelGroup";

import PieChart from "./chart/pieChart";
import XBarChart from "./chart/xBarChart";
import { getpieData, getxBarData } from "./manager";

export default {
  inject: ["reload"],
  components: {
    PanelGroup,
    PieChart,
    XBarChart,
  },
  data() {
    return {
      loading: false,
      satisticsData: [
        {
          name: "创建笔数",
          value: "0笔 +0%",
          icon: "create",
        },
        {
          name: "新增笔数",
          value: "0笔 +0%",
          icon: "add",
        },
        {
          name: "复制笔数",
          value: "0笔 +0%",
          icon: "copy",
        },
        {
          name: "修改笔数",
          value: "0笔 +0%",
          icon: "modify",
        },
      ],

      // 最新数据列表
      userData: [],

      // 文件操作记录列表
      handleData: [],

      // 各能源数据占比
      pieData: [],
      // 热度共享数据排名
      xBarData: {},
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);

    // 获取图像数据
    this.getData();
    window.onresize = () => {
      this.pageResize(this.reload, 300);
    };

    // 获取个人中心最新数据列表
    userEvidenceList().then((response) => {
      this.userData = response.data || [];
    });

    // 获取个人中心操作列表
    userHandleList().then((response) => {
      const dataInfo = response.data;
      this.handleData = dataInfo || [];
      for (var i = 0; i < dataInfo.length; i++) {
        this.handleData[i].optTypeName = this.handleOptType(
          dataInfo[i].optType
        );
      }
    });

    // 获取个人中心操作类型
    handleType().then((response) => {
      const originData = response.data;
      const createCount = originData.createCount || 0;
      const addCount = originData.addCount || 0;
      const copyCount = originData.copyCount || 0;
      const modifyCount = originData.modifyCount || 0;
      const totalData = createCount + addCount + copyCount + modifyCount;
      this.satisticsData[0].value = `${createCount}笔 +${this.decimal(
        (createCount / (totalData || 1)) * 100,
        2
      )}%`;
      this.satisticsData[1].value = `${addCount}笔 +${this.decimal(
        (addCount / (totalData || 1)) * 100,
        2
      )}%`;
      this.satisticsData[2].value = `${copyCount}笔 +${this.decimal(
        (copyCount / (totalData || 1)) * 100,
        2
      )}%`;
      this.satisticsData[3].value = `${modifyCount}笔 +${this.decimal(
        (modifyCount / (totalData || 1)) * 100,
        2
      )}%`;
    });
  },
  methods: {
    /** 页面重绘 */
    pageResize(func, delay) {
      return (function (args) {
        let that = this;
        let _args = args;
        clearTimeout(func.timer);
        func.timer = setTimeout(function () {
          func.call(that, _args);
        }, delay);
      })();
    },

    async getData() {
      // 各能源存证占比数据
      const pieData = getpieData();
      // 热度共享数据排名
      const xBarData = getxBarData();

      this.pieData = await pieData;
      this.xBarData = await xBarData;
    },

    /** 前往数据中心 */
    myhandleQuery() {
      this.$router.push("/edg/my-evidence");
    },

    /** 前往文件操作记录中心 */
    recordhandleQuery() {
      this.$router.push("/edg/opt-record");
    },

    /** 查看 */
    handleView(row) {
      const item = {
        originNodeId: row.originNodeId,
        evidenceTypeName: row.evidenceTypeName,
        fileName: row.fileName,
      };
      const page = this.$router.resolve({
        path: "/edg/content",
        query: {
          item: JSON.stringify(item),
        },
      });
      window.open(page.href, "_blank");
    },
  },
};
</script>

<style lang="scss">
.app-container {
  padding: 25px;
}

.el-button--text {
  color: #07DBFF;
}
</style>
<style lang="scss" scoped>
.panel-wrapper {
  height: 13vh;
  width: 100%;
  margin-bottom: 12px;
}

.center {
  margin: 10px 0px 0px 0px;
  text-align: center;
}

#bing-container {
  background-color: #07224a;
}

#strip-container {
  background-color: #07224a;
}
</style>
