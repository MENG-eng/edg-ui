<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >

      <el-form-item label="选择数据" prop="createTime">
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
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >创建共享</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['share:electric:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electricList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="数据名称" align="center" prop="dateName" />
      <el-table-column label="电量" align="center" prop="electricQuantity" />
      <el-table-column label="电压" align="center" prop="electricVoltage" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!--    &lt;!&ndash; 添加创建数据对话框 &ndash;&gt;-->
    <!--    <el-dialog title="创建数据" :visible.sync="createVisable" class="dialog">-->
    <!--      <el-form-->
    <!--        :model="createParams"-->
    <!--        ref="createForm"-->
    <!--        :rules="createFormRules"-->
    <!--        v-show="showSearch"-->
    <!--        label-width="80px"-->
    <!--      >-->
    <!--        <el-form-item label="数据名称" prop="fileName">-->
    <!--          <el-input-->
    <!--            v-model="createParams.fileName"-->
    <!--            placeholder="数据名称"-->
    <!--            clearable-->
    <!--            size="small"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="共享方" prop="shareName">-->
    <!--          <el-input-->
    <!--            v-model="createParams.shareName"-->
    <!--            placeholder="数据名称"-->
    <!--            clearable-->
    <!--            size="small"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="数据类型" prop="evidenceType">-->
    <!--          <treeselect-->
    <!--            v-model="createParams.evidenceType"-->
    <!--            :options="evidenceTypeList"-->
    <!--            placeholder="请选择数据类型"-->
    <!--            @select="evidenceTypeChange"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="数据文件" prop="file">-->
    <!--          <el-upload-->
    <!--            ref="fileUpload"-->
    <!--            class-->
    <!--            action-->
    <!--            :limit="1"-->
    <!--            accept=".jpg,.png,.pdf,.doc,.docx"-->
    <!--            :file-list="fileList"-->
    <!--            :before-upload="handleBeforeUpload"-->
    <!--            :before-remove="beforeRemove"-->
    <!--            :on-exceed="handleExceed"-->
    <!--            :http-request="uploadDataFile"-->
    <!--          >-->
    <!--            <el-button size="small" type="primary">点击上传</el-button>-->
    <!--            <div slot="tip" class="el-upload__tip">-->
    <!--              可上传jpg/png/pdf/doc/docx格式文件-->
    <!--            </div>-->
    <!--          </el-upload>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="文件描述" prop="desc">-->
    <!--          <el-input-->
    <!--            type="textarea"-->
    <!--            v-model="createParams.desc"-->
    <!--            placeholder="文件描述"-->
    <!--            :autosize="{ minRows: 6, maxRows: 10 }"-->
    <!--          ></el-input>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="附件">-->
    <!--          <el-upload-->
    <!--            ref="attachmentUpload"-->
    <!--            class-->
    <!--            action-->
    <!--            accept=".jpg,.png,.pdf,.doc,.docx"-->
    <!--            :file-list="attachmentFileList"-->
    <!--            :before-upload="handleBeforeUploadAttachment"-->
    <!--            :before-remove="beforeRemoveAttachment"-->
    <!--            :http-request="uploadAttachmentFile"-->
    <!--          >-->
    <!--            <el-button size="small" type="primary">点击上传</el-button>-->
    <!--            <div slot="tip" class="el-upload__tip">-->
    <!--              可上传jpg/png/pdf/doc/docx格式文件-->
    <!--            </div>-->
    <!--          </el-upload>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="resetCreateForm">重 置</el-button>-->
    <!--        <el-button type="primary" @click="createEvidence">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
  import {
    listException,
    getException,
    delException,
    addException,
    updateException,
    exportException,
  } from "@/api/edg/exception";
  import {
    listElectric,
    exportElectric
  } from "@/api/share/electric";
  import {  listDataType } from "@/api/edg/evidence";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { createEvidence, listEvidence } from '../../../api/edg/evidence'
  export default {
    name: "Electric",
    components: { Treeselect },
    data() {
      return {
        /** 数据类型 */
        evidenceTypeList: [],
        // //原始文件
        // fileList: [],
        // //附件列表
        // attachmentFileList: [],
        //
        // createFormRules: {
        //   fileName: [
        //     {
        //       required: true,
        //       message: "数据名称不能为空",
        //       trigger: "blur",
        //     },
        //     {
        //       validator: validateNameRepet,
        //       trigger: "blur",
        //     },
        //   ],
        //   evidenceType: [
        //     { required: true, message: "数据类型不能为空", trigger: "blur" },
        //   ],
        //   file: [{ required: true, validator: validateFileEmpty }],
        //   desc: [
        //     { required: true, message: "内容描述不能为空", trigger: "blur" },
        //   ],
        // },
        // /** 创建数据表单数据 */
        // createParams: {
        //   //文件名
        //   fileName: "",
        //   //共享方
        //   shareName: "",
        //   //数据类型
        //   evidenceType: null,
        //   evidenceItem: null,
        //   //内容描述
        //   desc: "",
        // },
        // // 创建数据弹窗是否可见
        // createVisable: false,

        // 遮罩层
        loading: true,

        // 选中数组
        ids: [],

        // 非单个禁用
        single: true,

        // 非多个禁用
        multiple: true,

        // 显示搜索条件
        showSearch: true,

        // 总条数
        total: 0,

        // 电量数据
        electricList: [],

        // 弹出层标题
        title: "",

        // 是否显示弹出层
        open: false,

        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          electricId: null,
          //创建时间
          startTime: "",
          endTime: "",
        },
        // 创建时间--选择器
        pickerTime:[],

        // 表单参数
        form: {},

        // 表单校验
        rules: {},
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
      change: function(res){
        this.pickerTime = res;
        this.queryParams.startTime = res[0];
        this.queryParams.endTime = res[1];
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

      /** 打开创建数据弹窗 */
      handleCreate() {
        this.resetCreateForm();
        this.createVisable = true;
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

      /** 查询文件信息列表 */
      getList() {
        this.loading = true;
        listElectric(this.queryParams).then((response) => {
          this.electricList = response.rows || [];
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 数据类型改变 */
      evidenceTypeChange(item) {
        this.createParams.evidenceItem = item;
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },

      // 表单重置
      reset() {
        this.form = {
          id: null,
          evidenceId: null,
          fileName: null,
          evidenceType: null,
          evidenceTypeName: null,
          optType: null,
          description: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
        };
        this.resetForm("form");
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.startTime = [];
        this.queryParams.endTime = [];
        this.pickerTime = [];
        this.handleQuery();
      },

      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.id);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },



      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              let loading = this.loadingView();
              updateException(this.form).then((response) => {
                loading.close();
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              })
                .catch((error) => {
                  loading.close();
                });
            } else {
              let loading = this.loadingView();
              addException(this.form).then((response) => {
                loading.close();
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              })
                .catch((error) => {
                  loading.close();
                });
            }
          }
        });
      },

      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出所有电量数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return exportElectric(queryParams);
          })
          .then((response) => {
            this.download(response.msg);
          })
          .catch(function () {});
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
