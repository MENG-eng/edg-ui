<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cms:rotation:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:rotation:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:rotation:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:rotation:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="rotationList"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
      stripes
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="轮播图名称" align="center" prop="rotationName" />
      <el-table-column label="轮播图" align="center" width="78">
        <template slot-scope="scope">
          <img class="table-img" :src="scope.row.rotationUrl" alt />
        </template>
      </el-table-column>
      <el-table-column
        label="关联文章"
        align="center"
        prop="relateObjName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="机构名称" align="center" prop="deptName" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="rotationList[scope.$index].status"
            active-value="0"
            inactive-value="1"
            @change="handleRotationEnable(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:rotation:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:rotation:remove']"
            >删除</el-button
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

    <!-- 添加或修改轮播图管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="轮播图名称" prop="rotationName">
          <el-input
            v-model="form.rotationName"
            placeholder="请输入轮播图名称"
          />
        </el-form-item>
        <el-form-item label="轮播图" prop="rotationUrl">
          <div v-if="form.rotationUrl" class="img-container">
            <img :src="form.rotationUrl" class="rotation-img" alt />
            <el-button
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteImg"
              class="delete-button"
            ></el-button>
          </div>

          <div v-else class="file-control-conatiner">
            <input
              class="input"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              ref="fileInt"
              @change="handlePicUpload"
              placeholder="上传"
            />
            <div class="upload-btn">+ 点击上传</div>
          </div>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="关联文章" prop>
          <el-input
            :style="{ width: '260px' }"
            v-model="form.relateObjName"
            placeholder="请选择关联文章"
            disabled
          />
          <el-input
            :style="{ display: 'none' }"
            v-model="form.relateObjId"
            placeholder="请选择关联文章"
            disabled
          />
          <el-popover placement="right" width="500" trigger="click" ref="popover">
            <el-table :data="articleData" @row-click="handleClickCell">
              <el-table-column
                width="150"
                property="title"
                label="标题"
              ></el-table-column>
              <el-table-column
                width="120"
                property="categoryName"
                label="所属栏目"
              ></el-table-column>
              <el-table-column
                width="160"
                property="tagNames"
                label="所属标签"
              ></el-table-column>
              <el-table-column
                width="160"
                property="deptName"
                label="机构名称"
              ></el-table-column>
              <el-table-column
                width="160"
                property="evidenceName"
                label="数据名称"
              ></el-table-column>
            </el-table>
            <el-button slot="reference">选择</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            placeholder="请输入排序"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  /** 轮播图列表 */
  listRotation,

  /** 轮播图详情 */
  getRotation,

  /** 轮播图删除 */
  delRotation,

  /** 添加轮播图 */
  addRotation,

  /** 修改轮播图 */
  updateRotation,

  /** 导出轮播图 */
  exportRotation,

  /** 上传轮播图 */
  uploadRotation,

  /** 启用轮播图 */
  enableRotation,

  /** 禁用轮播图 */
  disableRotation,
} from "@/api/cms/rotation";
import {
  /** 获取所有文章 */
  listArticle,
} from "@/api/cms/article";

export default {
  name: "Rotation",
  data() {
    return {
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
      // 轮播图管理表格数据
      rotationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      articleData: [],
      // 表单参数
      form: {
        rotationName: "",
        rotationUrl: null,
        relateObjId: "",
        status: 0,
        relateObjName: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      // 表单校验
      rules: {
        rotationName: [
          { required: true, message: "轮播图名称不能为空", trigger: "blur" },
        ],
        rotationUrl: [
          { required: true, message: "轮播图不能为空", trigger: "blur" },
        ],
        relateObjName: [
          { required: true, message: "关联对象不能为空", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message: "状态（0：正常，1：停用）不能为空",
            trigger: "blur",
          },
        ],
        delFlag: [
          {
            required: true,
            message: "删除标志（0：未删除，2：已删除）不能为空",
            trigger: "blur",
          },
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
        updateBy: [
          { required: true, message: "更新人不能为空", trigger: "blur" },
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 获取所有轮播图
    this.getList();
    // 获取所有文章
    this.getArticleList();
  },
  methods: {
    /** 查询轮播图管理列表 */
    getList() {
      this.loading = true;

      listRotation(this.queryParams)
        .then((response) => {
          this.rotationList = response.rows;
          this.total = response.total;
          this.loading = false;
          return listArticle();
        })
        .then((response) => {
          let articleData = response.rows || [];

          this.rotationList.map((item) => {
            articleData.map((article) => {
              if (item.relateObjId == article.evidenceId) {
                item.relateObjName = article.title;
              }
            });
          });
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        rotationId: null,
        rotationName: null,
        rotationUrl: null,
        relateObjId: null,
        relateObjName: "",
        deptId: null,
        sort: null,
        status: "0",
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.rotationId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rotationId = row.rotationId || this.ids;

      let title = "未知";
      this.articleData.map((item) => {
        if (parseInt(item.evidenceId) === parseInt(row.relateObjId)) {
          title = item.title || "";
        }
      });

      getRotation(rotationId).then((response) => {
        this.form = response.data;
        this.form.relateObjName = title;
        this.open = true;
        this.title = "修改轮播图";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.form.relateObjName.length <= 0) {
        this.$message.error("请选择关联文章");
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.rotationId != null) {
            let loading = this.loadingView();
            updateRotation(this.form)
              .then((response) => {
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
            addRotation(this.form)
              .then((response) => {
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

    /** 删除按钮操作 */
    handleDelete(row) {
      let that = this;
      const rotationIds = row.rotationId || this.ids;
      this.$confirm(
        '是否确认删除轮播图管理编号为"' + rotationIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          let loading = that.loadingView();
          return delRotation(rotationIds);
        })
        .then(() => {
          let loading = that.loadingView();
          loading.close();
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {
          let loading = that.loadingView();
          loading.close();
        });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有轮播图管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRotation(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },

    /** 图片上传 */
    handlePicUpload(event) {
      let formData = new window.FormData();
      // image 文件名
      formData.append("file", event.target.files[0]);
      let loading = this.loadingView();
      uploadRotation(formData)
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.$message({
              message: "上传成功",
              type: "success",
            });
            this.form.rotationUrl = response.url;
          }
        })
        .catch((error) => {
          loading.close();
        });
    },

    /** 启用、禁用轮播图 */
    handleRotationEnable(row) {
      const rotationId = row.rotationId;
      const status = row.status;

      if (status === "1") {
        //禁用
        disableRotation(rotationId)
          .then((response) => {
            if (response.code === 200) {
              row.status = "1";
            }
          })
          .catch(() => {
            row.status = "0";
          });
      } else {
        //启用
        enableRotation(rotationId)
          .then((response) => {
            if (response.code === 200) {
              row.status = "0";
            }
          })
          .catch(() => {
            row.status = "1";
          });
      }
    },

    /** 点击文章 */
    handleClickCell(row, column, event) {
      this.form.relateObjId = row.articleId;
      this.form.relateObjName = row.title;
      this.$refs['popover'].doClose();
    },

    /** 删除轮播图 */
    handleDeleteImg() {
      this.form.rotationUrl = null;
    },

    /** 获取文章列表 */
    getArticleList() {
      listArticle().then((response) => {
        this.articleData = response.rows || [];
      });
    },
  },
};
</script>

<style lang="scss">
.el-popover {
  position: fixed;
  top: 50px !important;
  z-index: 2003;
  background-color: transparent !important;
  border: 1px #5b5b5b solid !important;
  padding: 0 !important;
  height: 90% !important;
  overflow: auto !important;
}
</style>
<style lang="scss" scoped>
.table-img {
  width: 68px;
  height: 40px;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}

.file-control-conatiner {
  display: flex;
  flex-direction: column;

  .input {
    border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0); // 透明背景
    position: absolute;
    width: 160px;
    height: 32px;
    opacity: 0;
    cursor: pointer;
  }
}

.input-type-file-container {
  border: #1791ff solid 1px;
  width: 160px;
  height: 32px;
  border-radius: 4px;
  margin: auto;
}

.input-type-file-container input {
  position: absolute;
  width: 160px;
  height: 32px;
  opacity: 0;
}

.img-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.upload-btn {
  color: #1890ff;
  border: 1px solid #1890ff;
  width: 80px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;
}

.rotation-img-container {
  text-align: center;
  margin: auto;
}

.rotation-img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  display: block;
  overflow: hidden;
  border-radius: 4px;
}

.delete-button {
  position: absolute;
  width: 100px;
  height: 60px;
  background-color: rgba(1, 1, 1, 0.3);
  border: none;
  color: white;
}
</style>
