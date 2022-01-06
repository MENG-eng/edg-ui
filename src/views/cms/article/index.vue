<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="标题">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属栏目">
        <treeselect
          v-model="queryParams.categoryId"
          :options="categoryTree"
          placeholder="请选择栏目类型"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="所属标签">
        <el-select
          v-model="queryParams.tagIds"
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
      <el-form-item label="机构名称">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入所属机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据名称">
        <el-input
          v-model="queryParams.evidenceName"
          placeholder="请输入所属数据名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cms:article:add']"
        >新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:article:edit']"
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
          v-hasPermi="['cms:article:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:article:export']"
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
      :data="articleList"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
      stripe
    >
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属栏目"
        width="150"
        align="center"
        prop="categoryName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属标签"
        align="center"
        prop="tagNames"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="机构名称"
        align="center"
        prop="deptName"
      />
      <el-table-column
        label="数据名称"
        align="center"
        prop="evidenceName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="文章概述"
        align="center"
        prop="content"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="文章概述" align="left" :min-width="400">
        <template slot-scope="scope">
          <div style="max-height: 200px; text-align: justify; overflow: auto">
            {{ scope.row.content }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        label="发布时间"
        width="180"
        align="center"
        prop="createTime"
      />
      <el-table-column
        label="操作"
        width="200"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['cms:article:edit']"
            >预览</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:article:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:article:remove']"
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

    <!-- 修改文章管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="所属栏目" prop="categoryName">
          <treeselect
            v-model="form.categoryId"
            :options="categoryTree"
            placeholder="请选择栏目类型"
          />
        </el-form-item>
        <el-form-item label="所属标签" prop="tagIds">
          <el-select
            v-model="form.tagIds"
            placeholder="请选择标签类型"
            size="small"
            style="width: 100%"
            multiple
          >
            <el-option
              v-for="item in tagsTitleList"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属数据" prop="evidenceId">
          <el-input v-model="form.evidenceName" disabled />
        </el-form-item>
        <el-form-item label="文章概述" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="请输入文章概述"
            :autosize="{ minRows: 6, maxRows: 10 }"
            style="text-align: justify"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listArticle,
  getArticle,
  delArticle,
  addArticle,
  updateArticle,
  exportArticle,
} from "@/api/cms/article";
import { listCategory } from "@/api/cms/category";
import { listTagsTitle } from "@/api/cms/blog";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  name: "Article",
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
      // 文章管理表格数据
      articleList: [],
      // 所有栏目列表
      categoryList: [],
      // 所有栏目树
      categoryTree: [],
      // 所有标签
      tagsTitleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        keywords: null,
        categoryId: null,
        tagIds: null,
        deptName: null,
        evidenceName: null,
      },
      // 表单参数
      form: {
        categoryName: null,
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        categoryId: [
          { required: true, message: "所属栏目不能为空", trigger: "blur" },
        ],
        tagIds: [
          { required: true, message: "所属标签不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    /** 获取栏目列表 */
    listCategory().then((response) => {
      const cloneData = JSON.parse(JSON.stringify(response.data));
      var list = cloneData.filter((item) => {
        item["label"] = item.categoryName;
        item["id"] = item.categoryId;
        if (item["children"].length <= 0) {
          delete item.children;
        }
        return item;
      });
      this.categoryList = list;
      this.categoryTree = this.handleTree(list, "categoryId", "parentId");
    });
    /** 获取标签列表 */
    listTagsTitle().then((response) => {
      this.tagsTitleList = response.rows || [];
    });
  },
  methods: {
    /** 查询文章管理列表 */
    getList() {
      this.loading = true;
      listArticle(this.queryParams).then((response) => {
        this.articleList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        articleId: null,
        title: null,
        keywords: null,
        categoryId: null,
        tagIds: null,
        deptId: null,
        evidenceId: null,
        content: null,
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        title: null,
        categoryId: null,
        tagIds: null,
        deptName: null,
        evidenceName: null,
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.articleId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.title = "添加文章";
    // },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getCategoryIdByCategoryName();
      this.reset();
      const articleId = row.articleId || this.ids;
      getArticle(articleId).then((response) => {
        this.form = response.data;
        // var tags = response.data.tagNames.split(",");
        // this.form.tagNames = tags;
        this.form.categoryId = this.getCategoryIdByCategoryName(
          (response.data && response.data.categoryName) || ""
        );
        this.open = true;
        this.title = "修改文章";
      });
    },

    /** 根据categoryName获取categoryId */
    getCategoryIdByCategoryName(name) {
      let c_id = null;
      for (let idx = 0; idx < this.categoryList.length; idx++) {
        const category = this.categoryList[idx];
        if (category.categoryName === name) {
          c_id = category.categoryId;
          break;
        }
      }
      return c_id;
    },

    /** 预览 */
    handleView(row) {
      // const page = this.$router.resolve("/blog/" + row.articleId);
      // window.open(page.href, "_blank");
      this.getConfigKey("blog.url").then((response) => {
        if (response.code === 200) {
          let href = response.msg + "/blog/" + row.articleId;
          window.open(href, "_blank");
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      var data = JSON.stringify(this.form.tagIds);
      data = data.replace("[", "");
      data = data.replace("]", "");
      this.form.tagIds = data;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.articleId != null) {
            let loading = this.loadingView();
            updateArticle(this.form)
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
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const articleIds = row.articleId || this.ids;
      this.$confirm(
        '是否确认删除文章编号为"' + articleIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          let loading = that.loadingView();
          return delArticle(articleIds);
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
      this.$confirm("是否确认导出所有文章数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportArticle(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
