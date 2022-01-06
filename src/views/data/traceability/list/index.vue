<template>
  <div class="app-container">
    <div class="table-topTitle">
      <span class="table-tabInfo">语料数据溯源</span>
    </div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="文件名" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入文件名"
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
          style="width: 250px"
        />
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

    <div class="table-tabTitle">
      <span class="table-tabInfo">{{ title }}</span>
    </div>

    <el-table
      v-loading="loading"
      :data="listData"
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
        prop="evidenceTypeName"
        label="数据类型"
        width="160"
      ></el-table-column>
      <el-table-column prop="description" label="文件简述"></el-table-column>
      <el-table-column prop="heat" label="热度" width="120"></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
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
            v-hasPermi="['edg:evidence:query']"
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
      @pagination="getTraceaList"
    />
  </div>
</template>

<script>
import {
  /** 搜索数据 */
  evidenceListTrace,
} from "../../../../api/data/traceability";

import {
  /** 数据数据类型 */
  listDataType,
} from "../../../../api/edg/evidence";

import /** 树形选择组件 */
Treeselect from "@riophae/vue-treeselect";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    return {
      // table加载组件
      loading: false,

      // table 标题
      title: "",

      // 总条数
      total: 0,

      // 查询条件
      queryParams: {
        // 页码
        pageNum: 1,

        // 每页条数
        pageSize: 10,

        // 文件名
        fileName: null,

        // 文件类型
        evidenceType: null,
      },

      // 列表数据
      listData: [],

      /** 数据类型 */
      evidenceTypeList: [],
    };
  },
  mounted() {
    /** 处理传递过来的数据 */
    this.handleDefaultData();

    /** 获取数据类型列表 */
    this.getListDataType();

    /** 获取搜索列表 */
    this.getTraceaList();
  },

  methods: {
    /** 处理传递过来的数据 */
    handleDefaultData() {
      const item = JSON.parse(this.$route.query.item || "{}");
      const name = item.name;
      const id = item.id;
      const fileName = item.fileName;
      // 搜索框初始值
      this.queryParams.evidenceType = id;
      this.queryParams.fileName = fileName;
      // 默认title
      this.title = fileName ? "搜索结果" : "语料数据热度TOP10";
    },

    /** 获取所有数据类型 */
    getListDataType() {
      listDataType().then((response) => {
        const cloneData = JSON.parse(JSON.stringify(response.data));
        var list = cloneData.filter((item) => {
          item["label"] = item.name;
          return item;
        });
        this.evidenceTypeList = this.handleTree(list, "id", "parentId");
      });
    },

    /** 获取数据搜索列表 */
    getTraceaList() {
      this.loading = true;
      evidenceListTrace(this.queryParams).then((response) => {
        if (response.code === 200) {
          this.listData = response.rows || [];
          this.total = response.total;
          this.loading = false;
        }
      });
    },

    /** 搜索 */
    handleSearch() {
      this.title = "搜索结果";
      this.getTraceaList();
      this.loading = true;
    },

    /** 重置表单 */
    resetQuery() {
      this.resetForm("queryForm");
      this.reset();
      this.handleSearch();
    },

    /** 重置搜索条件 */
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        fileName: null,
        evidenceType: null,
      };
    },

    /** 点击查看 */
    handleView(row) {
      const page = this.$router.resolve({
        path: "/edg/view",
        query: {
          evidenceId: JSON.stringify(row.id),
          admin: true,
        },
      });
      window.open(page.href, "_blank");
      // const page = this.$router.resolve({
      //   path: "/data/tracea/detail",
      //   query: {
      //     evidenceId: JSON.stringify(row.id),
      //   },
      // });
      // window.open(page.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
