<template>
  <div class="app-container">
<!--    搜索栏-->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="数据名称" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入数据名称"
          clearable
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="数据类型" prop="evidenceType">
        <treeselect
          v-model="queryParams.evidenceType"
          :options="evidenceTypeList"
          placeholder="请选择数据类型"
          @select="evidenceTypeChange"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="pickerTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="change"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="queryData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      stripe
    >
      <el-table-column
        prop="fileName"
        label="数据名称"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.fileName || "--" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="evidenceTypeName"
        label="数据类型"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="文件描述"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="heat"
        label="文件热度"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-opened"
            @click="handleView(scope.row)"
            v-hasPermi="['edg:evidence:view']"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  /** 获取数据列表详情 */
  evidenceNodeList,
  listDataType,
  createEvidence,
  listEvidence,
  publishArticle,
} from "../../../api/edg/evidence";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    return {
      nodeId: null,
      /** 数据类型 */
      evidenceTypeList: [],

      showSearch: true,

      /** 表单内容 -- 查询参数 */
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        //文件名
        fileName: "",
        //数据类型
        evidenceType: null,
        //创建时间
        startTime: "",
        endTime: "",
      },
      // 创建时间--选择器
      pickerTime: [],

      /** 是否显示loading动画 */
      loading: false,

      /** 表格内容 */
      queryData: [],

      // 总条数
      total: 0,

      // 表单参数
      form: {},
    };
  },

  created() {
    this.getList();
  },

  mounted() {
    /** 获取数据类型列表 */
    listDataType().then((response) => {
      const cloneData = JSON.parse(JSON.stringify(response.data));
      var list = cloneData.filter((item) => {
        item["label"] = item.name;
        return item;
      });
      this.evidenceTypeList = this.handleTree(list, "id", "parentId");
    });
  },

  methods: {
    // 选择日期
    change: function (res) {
      this.pickerTime = res;
      this.queryParams.startTime = res[0];
      this.queryParams.endTime = res[1];
    },

    /** 查询文件信息列表 */
    getList() {
      this.loading = true;
      listEvidence(this.queryParams).then((response) => {
        this.queryData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 数据类型改变 */
    evidenceTypeChange(item) {
    },

    /** 当聚焦在 数据id、文件名 input时回车键事件 */
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置表单 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.startTime = [];
      this.queryParams.endTime = [];
      this.pickerTime = [];
      this.handleSearch();
    },

    /** 查看 */
    handleView(row) {
      const page = this.$router.resolve({
        path: "/edg/view",
        query: {
          evidenceId: JSON.stringify(row.id),
        },
      });

      window.open(page.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped></style>
