<template>
  <div class="app-container">
    <div class="bar-container">
      <span class="table-tabInfo">数据中心</span>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleCreate"
        v-hasPermi="['edg:evidence:add']"
        >创建共享</el-button
      >
    </div>
    <el-divider :style="{ margin: '0 50px' }"></el-divider>
    <div class="table-container">
      <div class="table-container-l">
        <el-menu
          default-active="0"
          @select="handleSeletMenu"
          :style="{ border: 'none' }"
        >
          <el-menu-item index="0">
            <i class="el-icon-document"></i>
            <span slot="title">{{
              `我的数据（${myEdgData.total || 0}）`
            }}</span>
          </el-menu-item>
          <el-menu-item index="1">
            <i class="el-icon-document-copy"></i>
            <span slot="title">{{
              `复制数据（${copyEdgData.total || 0}）`
            }}</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="table-container-r">
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
          <el-form-item label="创建时间" prop="createTime">
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
        <el-table
          v-loading="loading"
          :data="edgData.dataList"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          tooltip-effect="light"
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
            v-if="currentMenu === '1'"
            prop="originVersion"
            label="起始版本"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="evidenceTypeName"
            label="电量"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="文件描述"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="heat"
            label="文件热度"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="createTime"
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
                @click="handleView(scope.row)"
                v-hasPermi="['edg:evidence:content']"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-thumb"
                @click="handleOpenPubilsh(scope.row)"
                >发布</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="edgData.total > 0"
          :total="edgData.total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>

    <!-- 添加创建数据对话框 -->
    <el-dialog title="创建数据" :visible.sync="createVisable" class="dialog">
      <el-form
        :model="createParams"
        ref="createForm"
        :rules="createFormRules"
        v-show="showSearch"
        label-width="80px"
      >
        <el-form-item label="数据名称" prop="fileName">
          <el-input
            v-model="createParams.fileName"
            placeholder="数据名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="数据类型" prop="evidenceType">
          <treeselect
            v-model="createParams.evidenceType"
            :options="evidenceTypeList"
            placeholder="请选择数据类型"
            @select="evidenceTypeChange"
          />
        </el-form-item>

        <el-form-item label="数据文件" prop="file">
          <el-upload
            ref="fileUpload"
            class
            action
            :limit="1"
            accept=".jpg,.png,.pdf,.doc,.docx"
            :file-list="fileList"
            :before-upload="handleBeforeUpload"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :http-request="uploadDataFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              可上传jpg/png/pdf/doc/docx格式文件
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="文件描述" prop="desc">
          <el-input
            type="textarea"
            v-model="createParams.desc"
            placeholder="文件描述"
            :autosize="{ minRows: 6, maxRows: 10 }"
          ></el-input>
        </el-form-item>

        <el-form-item label="附件">
          <el-upload
            ref="attachmentUpload"
            class
            action
            accept=".jpg,.png,.pdf,.doc,.docx"
            :file-list="attachmentFileList"
            :before-upload="handleBeforeUploadAttachment"
            :before-remove="beforeRemoveAttachment"
            :http-request="uploadAttachmentFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              可上传jpg/png/pdf/doc/docx格式文件
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetCreateForm">重 置</el-button>
        <el-button type="primary" @click="createEvidence">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加发布文章对话框 -->
    <el-dialog
      title="发布文章"
      :visible.sync="publishVisable"
      width="500px"
      append-to-body
    >
      <el-form
        ref="publishForm"
        :model="publishParams"
        :rules="publishFormRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="publishParams.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input
            v-model="publishParams.keywords"
            placeholder="请输入关键词"
          />
        </el-form-item>
        <el-form-item label="所属栏目" prop="categoryId">
          <treeselect
            v-model="publishParams.categoryId"
            :options="categoryList"
            placeholder="请选择栏目类型"
          />
        </el-form-item>
        <el-form-item label="所属标签" prop="tags">
          <el-select
            v-model="publishParams.tags"
            placeholder="请选择标签类型"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in tagsTitleList"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属数据" prop="model.fileName">
          <el-input
            v-model="publishParams.model.fileName"
            placeholder="请输入标题"
            disabled
          />
        </el-form-item>
        <el-form-item label="文章概述" prop="content">
          <el-input
            type="textarea"
            v-model="publishParams.content"
            placeholder="请输入文章概述"
            :autosize="{ minRows: 6, maxRows: 10 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPublish">取 消</el-button>
        <el-button type="primary" @click="handlePubilsh">发 布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  /** @api 数据类型列表 */
  listDataType,

  /** @api 新建数据 */
  createEvidence,

  /** @api 发布文章 */
  publishArticle,

  /** @api 验证数据名是否存在 */
  validEvidenceName,
} from "../../../api/edg/evidence";

import {
  /** @api 获取我的数据 */
  listMyEvidence,

  /** @api 获取复的数据 */
  listCopyEvidence,
} from "../../../api/edg/myEvidence";

import {
  /** @api 获取所有标签 */
  listTagsTitle,

  /** @api 获取所有栏目 */
  listCategoryTitle,
} from "@/api/cms/blog";

import {
  /** @api 上传文件 */
  uploadFile,
} from "@/api/file";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import md5 from "md5";
export default {
  components: { Treeselect },
  data() {
    /** 校验数据名称是否重复 */
    const validateNameRepet = (rule, value, callback) => {
      validEvidenceName(value).then((response) => {
        if (response.code === 200) {
          if (response.data === false) {
            callback();
          } else {
            callback(new Error("数据名称重复"));
          }
        }
      });
    };

    /** 校验是否上传文件 */
    const validateFileEmpty = (rule, value, callback) => {
      if (this.fileList.length > 0) {
        callback();
      } else {
        callback(new Error("数据文件不能为空"));
      }
    };

    return {
      /** 是否显示loading动画 */
      loading: false,

      /** 数据类型 */
      evidenceTypeList: [],

      /** 所有栏目 */
      categoryList: [],

      /** 所有标签 */
      tagsTitleList: [],

      showSearch: true,

      /** 当前类型 默认我的数据 */
      currentMenu: "0",

      /** 当前数据数据 */
      edgData: {
        dataList: [],
        total: 0,
      },

      /** 我的数据数据 */
      myEdgData: {
        dataList: [],
        total: 0,
      },

      /** 复制数据数据 */
      copyEdgData: {
        dataList: [],
        total: 0,
      },

      /**  */
      queryParams: {},
      // 创建时间--选择器
      pickerTime: [],

      /** 表单内容 -- 我的查询参数 */
      myParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        //文件名
        fileName: null,
        //数据类型
        evidenceType: null,
        //创建时间
        startTime: null,
        endTime: null,
      },

      /** 表单内容 -- 复制查询参数 */
      copyParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        //文件名
        fileName: null,
        //数据类型
        evidenceType: null,
        //创建时间
        startTime: null,
        endTime: null,
      },

      // 弹出层标题
      title: "",

      // 是否显示弹出层
      open: false,

      // 创建数据弹窗是否可见
      createVisable: false,
      /** 创建数据表单数据 */
      createParams: {
        //文件名
        fileName: "",
        //数据类型
        evidenceType: null,
        evidenceItem: null,
        //内容描述
        desc: "",
      },
      //原始文件
      fileList: [],
      //附件列表
      attachmentFileList: [],

      createFormRules: {
        fileName: [
          {
            required: true,
            message: "数据名称不能为空",
            trigger: "blur",
          },
          {
            validator: validateNameRepet,
            trigger: "blur",
          },
        ],
        evidenceType: [
          { required: true, message: "数据类型不能为空", trigger: "blur" },
        ],
        file: [{ required: true, validator: validateFileEmpty }],
        desc: [
          { required: true, message: "内容描述不能为空", trigger: "blur" },
        ],
      },
      publishVisable: false,
      // 发布弹窗参数
      publishParams: {
        // 发布弹窗是否可见
        title: "",
        keywords: "",
        categoryId: null,
        tags: null,
        evidence: "",
        content: "",
        model: {},
      },
      // 发布文章rules
      publishFormRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        keywords: [
          { required: true, message: "关键词不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "栏目不能为空", trigger: "blur" },
        ],
        tags: [{ required: true, message: "标签不能为空", trigger: "blur" }],
        fileName: [
          { required: true, message: "所属数据不能为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "概述不能为空", trigger: "blur" }],
      },
    };
  },

  computed: {},

  watch: {
    currentMenu: function (newValue, oldValue) {
      this.getDataList();
    },
    "myEdgData.dataList": function (newValue, oldValue) {
      this.getDataList();
    },
    "copyEdgData.dataList": function (newValue, oldValue) {
      this.getDataList();
    },
  },

  created() {
    this.getList();
    this.getListCopyEvidence();
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

    /** 获取栏目列表 */
    listCategoryTitle().then((response) => {
      const cloneData = JSON.parse(JSON.stringify(response.data));
      var list = cloneData.filter((item) => {
        item["label"] = item.categoryName;
        item["id"] = item.categoryId;
        if (item["children"].length <= 0) {
          item.children = "";
        }
        return item;
      });
      this.categoryList = this.handleTree(list, "categoryId", "parentId");
    });

    /** 获取标签列表 */
    listTagsTitle().then((response) => {
      this.tagsTitleList = response.rows || [];
    });
  },

  methods: {
    /** 切换menu */
    handleSeletMenu(idx) {
      this.currentMenu = idx;
      this.resetQuery();
    },

    /** 获取当前表单、列表数据 */
    getDataList() {
      let loading = this.loadingView({ background: "rgba(0,0,0,0)" });
      setTimeout(() => {
        this.edgData =
          this.currentMenu === "0" ? this.myEdgData : this.copyEdgData;
        this.queryParams =
          this.currentMenu === "0" ? this.myParams : this.copyParams;
        loading.close();
      }, 300);
    },

    // 选择日期
    change: function (res) {
      this.pickerTime = res;
      this.queryParams.startTime = res[0];
      this.queryParams.endTime = res[1];
    },

    /** 查询我的数据列表 */
    getList() {
      this.loading = true;
      listMyEvidence(this.myParams).then((response) => {
        this.myEdgData.dataList = response.rows || [];
        this.myEdgData.total = response.total;
        this.loading = false;
      });
    },

    /** 获取复制数据列表 */
    getListCopyEvidence() {
      this.loading = true;
      listCopyEvidence(this.copyParams).then((response) => {
        this.copyEdgData.dataList = response.rows || [];
        this.copyEdgData.total = response.total;
        this.loading = false;
      });
    },

    // 取消创建对话框
    cancelCreate() {
      this.createVisable = false;
    },

    // 重置创建数据弹窗
    resetCreateForm() {
      this.resetForm("createForm");
      this.createParams = {
        fileName: "",
        evidenceType: null,
        evidenceItem: null,
        desc: "",
        attachmentFileList: [],
      };
      this.fileList = [];
      this.attachmentFileList = [];
    },

    /** 当聚焦在 数据id、文件名 input时回车键事件 */
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.getListCopyEvidence();
    },

    /** 重置表单 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.startTime = [];
      this.queryParams.endTime = [];
      this.pickerTime = [];
      this.handleSearch();
    },

    /** 打开创建数据弹窗 */
    handleCreate() {
      this.resetCreateForm();
      this.createVisable = true;
    },

    /** 查看 */
    handleView(row) {
      const item = {
        originNodeId: row.originNodeId,
        evidenceTypeName: row.evidenceTypeName,
        fileName: row.fileName,
      };
      console.log(row)
      const page = this.$router.resolve({
        path: "/edg/content",
        query: {
          item: JSON.stringify(item),
        },
      });
      window.open(page.href, "_blank");
    },

    /** 数据类型改变 */
    evidenceTypeChange(item) {
      this.createParams.evidenceItem = item;
    },

    //上传原始文件之前
    handleBeforeUpload(file) {
      if (this.createParams.evidenceItem) {
        return true;
      }
      this.$message.error(`先选择数据类型`);
      this.$refs.fileUpload.clearFiles();
      return false;
    },

    //上传原始文件超出
    handleExceed(files, fileList) {
      this.$message.error(`只能上传 1 个文件`);
    },

    //删除原始文件
    beforeRemove(file, fileList) {
      this.fileList = [];
      return true;
    },

    /** 上传文件原始数据 */
    uploadDataFile(event) {
      const file = event.file;
      const type = this.createParams.evidenceItem.name || "未知类型";

      let formData = new window.FormData();
      formData.append("file", file);
      formData.append("scene", type);
      formData.append("output", "json");

      let loading = this.loadingView({ background: "rgba(0, 0, 0, 0)" });
      uploadFile(formData)
        .then((response) => {
          loading.close();
          if (response.path && response.path.length > 0) {
            const name = file.name || "未知文件";
            const path = response.path || "未知路径";
            const hash = response.md5 || "未知hash";
            const size = response.size || 0;
            const theFile = {
              name: name,
              path: path,
              hash: hash,
              size: size,
            };
            this.fileList.push(theFile);
          } else {
            this.$message.error("文件上传失败");
          }
        })
        .catch((error) => {
          loading.close();
        });
    },

    //上传附件之前
    handleBeforeUploadAttachment(file) {
      let can = true;
      if (!this.createParams.evidenceItem) {
        this.$message.error(`先选择数据类型`);
        this.$refs.fileUpload.clearFiles();
        can = false;
      } else {
        for (let idx = 0; idx < this.attachmentFileList.length; idx++) {
          const theFile = this.attachmentFileList[idx];
          if (file.name === theFile.name && file.size === theFile.size) {
            can = false;
            this.$message.error(`此文件已存在`);
            break;
          }
        }
      }
      return can;
    },

    //删除附件
    beforeRemoveAttachment(file, fileList) {
      this.attachmentFileList = fileList;
      return true;
    },

    /** 上传附件 */
    uploadAttachmentFile(event) {
      const file = event.file;
      const type = this.createParams.evidenceItem.name || "未知类型";

      let formData = new window.FormData();
      formData.append("file", file);
      formData.append("scene", type);
      formData.append("output", "json");

      let loading = this.loadingView({ background: "rgba(0, 0, 0, 0)" });
      uploadFile(formData)
        .then((response) => {
          loading.close();
          if (response.path && response.path.length > 0) {
            const name = file.name || "未知文件";
            const path = response.path || "未知路径";
            const hash = response.md5 || "未知hash";
            const size = response.size || 0;
            const theFile = {
              name: name,
              path: path,
              hash: hash,
              size: size,
            };
            this.attachmentFileList.push(theFile);
          } else {
            this.$message.error("文件上传失败");
          }
        })
        .catch((error) => {
          loading.close();
        });
    },

    /** 创建数据 */
    createEvidence() {
      this.$refs.createForm.validate((vaild) => {
        if (vaild) {
          this.requestCreatEvidence();
        }
      });
    },

    //请求创建
    requestCreatEvidence() {
      const description = this.createParams.desc;
      const evidenceType = this.createParams.evidenceType;
      const evidenceTypeName = this.createParams.evidenceItem.name;
      const fileName = this.createParams.fileName;

      const file = this.fileList[0];
      let dataFile = {
        fileName: file.name,
        hash: file.hash,
        size: file.size,
        uri: file.path,
      };

      let attachments = [];

      this.attachmentFileList.map((file) => {
        attachments.push({
          fileName: file.name,
          hash: file.hash,
          size: file.size,
          uri: file.path,
        });
      });

      // 计算附件hash
      let hash_list = [];
      for (let idx = 0; idx < attachments.length; idx++) {
        const file = attachments[idx];
        if (file.hash) {
          hash_list.push(file.hash);
        }
      }

      const attachmentTotalHash = this.md5Hashlist(hash_list);

      const data = {
        attachmentTotalHash: attachmentTotalHash,
        attachments: attachments,
        dataFile: dataFile,
        description: description,
        evidenceType: evidenceType,
        evidenceTypeName: evidenceTypeName,
        fileName: fileName,
      };

      this.createVisable = false;
      const loading = this.loadingView({ text: "上链中..." });
      createEvidence(data)
        .then((response) => {
          this.$message({
            message: "数据创建成功",
            type: "success",
          });
          this.getList();
          loading.close();
        })
        .catch((error) => {
          loading.close();
        });
    },

    /** 打开发布弹窗 */
    handleOpenPubilsh(row) {
      this.resetPubilsh();
      let model = row;
      model.fileName = model.fileName || "--";
      this.publishParams.model = model;
      this.publishVisable = true;
    },

    /** 取消发布文章 */
    cancelPublish() {
      this.publishVisable = false;
    },

    /** 重置发布表单 */
    resetPubilsh() {
      this.resetForm("publishForm");
      this.publishParams = {
        title: "",
        keywords: "",
        categoryId: null,
        tags: "",
        evidence: "",
        content: "",
        model: {},
      };
    },

    /** 发布 */
    handlePubilsh() {
      const publishParams = this.publishParams;
      // 所属数据id
      const evidenceId = publishParams.model.id;
      // 文章标题
      const title = publishParams.title;
      // 文章栏目
      const categoryId = publishParams.categoryId;
      // 文章标签
      const tagIds = publishParams.tags;
      // 关键字
      const keywords = publishParams.keywords;
      // 概述
      const content = publishParams.content;
      if (!publishParams.categoryId) {
        this.$message.error("所属栏目不能为空");
        return;
      }
      if (!publishParams.tags) {
        this.$message.error("标签不能为空");
        return;
      }
      this.$refs.publishForm.validate((val) => {
        if (val) {
          let loading = this.loadingView();
          publishArticle(
            evidenceId,
            title,
            categoryId,
            tagIds,
            keywords,
            content
          )
            .then((response) => {
              this.publishVisable = false;
              loading.close();
              this.$message({
                message: "发布文章成功",
                type: "success",
              });
            })
            .catch(() => {
              loading.close();
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  width: 1200px;
  margin: auto;
}

.bar-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
}

.table-container {
  display: flex;
  flex-direction: row;
  width: 100%;

  .table-container-l {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .table-container-r {
    display: flex;
    flex-direction: column;
    padding: 20px;
    flex: 1;
    background-color: #07224a;
    // border-left: solid 1px #e6e6e6;
    //border-top: solid 1px #e6e6e6;
  }
}
</style>
