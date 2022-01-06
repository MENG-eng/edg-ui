<template>
  <div class="app-container">
    <div class="bar-container">
      <span class="table-tabInfo">文件验证</span>
      <div class="row">
        <div v-if="file">
          <div :style="{ marginRight: '16px', color: '#fff' }">
            当前文件：{{ file.name || "" }}
          </div>
        </div>
        <el-upload
          action=""
          accept=".jpg,.png,.pdf,.doc"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :http-request="uploadFile"
        >
          <el-button size="small" type="primary">{{
            file ? "重新选择" : "选择文件"
          }}</el-button>
        </el-upload>
      </div>
    </div>
    <el-divider :style="{ margin: '0 50px' }"></el-divider>
    <el-table :data="queryData" row-key="id" tooltip-effect="dark" stripe>
      <el-table-column
        prop="fileName"
        label="数据名称"
        align="center"
        width="220"
      ></el-table-column>
      <el-table-column
        prop="evidenceTypeName"
        label="数据类型"
        align="center"
        width="140"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
        align="center"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="evidenceNodeCreateTime"
        label="创建时间"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="optType"
        label="操作类型"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="内容描述"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-opened"
            @click="handlePreview(scope.row)"
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
import SparkMD5 from "spark-md5";

import {
  /** 获取节点列表 */
  evidenceNodeList,
} from "../../../api/edg/evidence";

export default {
  data() {
    return {
      fileList: [],
      pageNum: 0,
      pageSize: 10,
      file: null,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileHash: null,
      },
      queryData: [],
      /** 进度条可见 */
      progressVisable: false,

      /** 进度条进度 */
      progressValue: 0,
    };
  },
  mounted() {},
  methods: {
    resize() {},

    getList() {
      evidenceNodeList(this.queryParams).then((response) => {
        if (response.code === 200) {
          this.queryData = response.rows || [];
          this.queryData.map((item) => {
            item.optType = this.handleOptType(item.optType);
          });
          this.total = response.total || 0;
        }
      });
    },

    handlePreview(row) {
      const page = this.$router.resolve({
        path: "/edg/view",
        query: {
          evidenceId: JSON.stringify(row.evidenceId),
          fileHash: JSON.stringify(this.queryParams.fileHash),
        },
      });

      window.open(page.href, "_blank");
    },

    /** 上传之前 */
    beforeUpload(file) {
      return true;
    },

    /** 删除文件 */
    beforeRemove(file, fileList) {
      return true;
    },

    /** 上传文件 */
    async uploadFile(event) {
      // 文件列表置空
      this.fileList = [];
      // 操作文件
      const file = event.file;
      this.file = file;

      // 获取字节流
      let binary = await this.getBinaryFromFile(file);

      // 字节流取md5
      let spark = new SparkMD5();
      spark.appendBinary(binary);
      let md5 = spark.end();
      this.queryParams.fileHash = md5;
      this.getList();
    },

    getBinaryFromFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", (err) => reject(err));
        reader.readAsBinaryString(file);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bar-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
}

.upload-container {
  margin-top: 80px;
  margin-left: 100px;
  height: 200px;
  width: 300px;
}

.progress {
  height: 16px;
  width: 220px;
  margin-bottom: 8px;
  border-radius: 5px;
}
</style>
