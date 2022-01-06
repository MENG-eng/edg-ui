<template>
  <div class="app-container">
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
      <el-form-item label="操作类型" prop="optType">
        <el-select
          v-model="queryParams.optType"
          placeholder="请选择操作类型"
          clearable
          size="small"
        >
          <el-option label="创建" value="CREATE" />
          <el-option label="增加" value="ADD" />
          <el-option label="修改" value="MODIFY" />
          <el-option label="复制" value="COPY" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间" prop="createTime">
        <el-date-picker
          v-model="pickerTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="change"
        ></el-date-picker>
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
      :data="handleData"
      row-key="nodeId"
      stripe
      tooltip-effect="light"
    >
      <el-table-column
        prop="fileName"
        label="文件名"
        :show-overflow-tooltip="true"
        width="220"
      ></el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
        align="center"
        width="120"
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
        :show-overflow-tooltip="true"
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
      <el-table-column
        prop="evidenceNodeCreateTime"
        label="操作时间"
        align="center"
        width="180"
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
            @click="handlePreview(scope.row)"
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
import { listDataType } from "@/api/edg/evidence";
import { listoptRecord } from "@/api/edg/optRecord";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    return {
      loading: false,
      // 文件操作记录列表
      handleData: [],
      // 总条数
      total: 0,
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        //文件名
        fileName: null,
        //数据类型
        evidenceType: null,
        //操作类型
        optType: null,
        //创建时间
        startTime: "",
        endTime: "",
      },
      // 创建时间--选择器
      pickerTime: [],

      /** 数据类型 */
      evidenceTypeList: [],
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.getList();
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

    /** 搜索 */
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

    getList() {
      this.loading = true;
      // 获取个人中心操作列表
      listoptRecord(this.queryParams).then((response) => {
        const dataInfo = response.rows;
        this.total = response.total;
        this.handleData = dataInfo || [];
        for (var i = 0; i < dataInfo.length; i++) {
          // 操作类型转化
          this.handleData[i].optTypeName = this.handleOptType(
            dataInfo[i].optType
          );
        }
        this.loading = false;
      });
    },

    /** 预览 */
    handlePreview(row) {
      const page = this.$router.resolve({
        path: "/edg/view",
        query: {
          evidenceId: JSON.stringify(row.evidenceId),
        },
      });
      window.open(page.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.center {
  margin: 30px 0px 0px 0px;
  text-align: center;
}
</style>