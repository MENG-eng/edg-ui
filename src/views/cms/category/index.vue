<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="栏目名称">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入栏目名称"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cms:category:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-unfold"
          size="mini"
          @click="handleFold"
          v-hasPermi="['cms:category:add']"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      ref="queryTable"
      :data="categoryList"
      row-key="categoryId"
      default-expand-all
      :indent="16"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      stripe
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="栏目名称" align="center" prop="categoryName" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="栏目描述" align="center" prop="description" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleCategoryEnable(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSubUpdate(scope.row)"
            v-hasPermi="['cms:category:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleSubAdd(scope.row)"
            v-hasPermi="['cms:category:edit']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleSubDelete(scope.row)"
            v-hasPermi="['cms:category:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改栏目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级栏目" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="categoryOptions"
            :normalizer="normalizer"
            placeholder="请选择上级栏目"
          />
        </el-form-item>
        <el-form-item label="栏目名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入栏目名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            placeholder="请输入排序"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
        <el-form-item label="栏目描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入栏目描述"
            :autosize="{ minRows: 3, maxRows: 10 }"
          ></el-input>
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
  listCategory,
  getCategory,
  delCategory,
  addCategory,
  updateCategory,
  exportCategory,
  enablecategory,
  disablecategory,
  getOtherCategory,
} from "@/api/cms/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Category",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 栏目管理表格数据
      categoryList: [],
      // 搜索下拉
      searchOptions: [],
      // 表格全部展开默认true
      isExpandTable: true,
      // 栏目管理树选项
      categoryOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        categoryName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级栏目不能为空", trigger: "blur" },
        ],
        categoryName: [
          { required: true, message: "栏目名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询栏目管理列表 */
    getList() {
      this.loading = true;
      listCategory(this.queryParams).then((response) => {
        this.categoryList = this.handleTree(
          response.data,
          "categoryId",
          "parentId"
        );
        this.loading = false;
      });
    },
    /** 转换栏目管理数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.categoryId,
        label: node.categoryName,
        children: node.children,
      };
    },
    /** 查询机构下拉树结构 */
    getTreeselect() {
      listCategory().then((response) => {
        this.categoryOptions = [];
        const data = { categoryId: 0, categoryName: "顶级节点", children: [] };
        data.children = this.handleTree(
          response.data,
          "categoryId",
          "parentId"
        );
        this.categoryOptions.push(data);
      });
    },
    /** 查询机构下拉树--除自己 */
    getotherTreeselect(id) {
      getOtherCategory(id).then((response) => {
        this.categoryOptions = [];
        const data = { categoryId: 0, categoryName: "顶级节点", children: [] };
        data.children = this.handleTree(
          response.data,
          "categoryId",
          "parentId"
        );
        this.categoryOptions.push(data);
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
        categoryId: null,
        categoryName: null,
        parentId: null,
        ancestors: null,
        sort: null,
        description: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        status: 0,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 启用、禁用栏目 */
    handleCategoryEnable(row) {
      const categoryId = row.categoryId;
      const status = row.status;

      if (status === 1) {
        //禁用
        disablecategory(categoryId)
          .then((response) => {
            if (response.code === 200) {
              row.status = 1;
            }
          })
          .catch(() => {
            row.status = 0;
          });
      } else {
        //启用
        enablecategory(categoryId)
          .then((response) => {
            if (response.code === 200) {
              row.status = 0;
            }
          })
          .catch(() => {
            row.status = 1;
          });
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      //重置form
      this.reset();
      //获取当前下拉树结构
      this.getTreeselect();
      //form title
      this.title = "添加栏目管理";
      //默认设置为顶级节点
      this.form.parentId = 0;
      //打开form
      this.open = true;
    },
    // /** 修改按钮操作 */
    // handleUpdate() {
    //   this.reset();
    //   this.getTreeselect();
    //   this.open = true;
    //   this.title = "修改栏目管理";
    // },
    // ⬆  可以删除
    /** 展开折叠按钮操作 */
    handleFold() {
      this.isExpandTable = !this.isExpandTable;
      this.fold(this.categoryList, this.isExpandTable);
    },
    /** 展开或者折叠 */
    fold(table, isExpand) {
      table.forEach((i) => {
        this.$refs.queryTable.toggleRowExpansion(i, isExpand);
        if (i.children) {
          this.fold(i.children, isExpand);
        }
      });
    },
    /** 子目录修改按钮操作 */
    handleSubUpdate(row) {
      this.reset();
      this.getotherTreeselect(row.categoryId);
      getCategory(row.categoryId).then((response) => {
        this.form = response.data;
        //如果是顶级节点则parentId为0
        if (row != null) {
          this.form.parentId = row.parentId || 0;
        }
        this.open = true;
        this.title = "修改栏目管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.categoryId != null) {
            let loading = this.loadingView();
            updateCategory(this.form)
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
            addCategory(this.form)
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
    /** 子目录新增按钮操作 */
    handleSubAdd(row) {
      this.reset();
      this.getTreeselect();
      getCategory(row.categoryId).then((response) => {
        this.form = response.data;
        if (row != null) {
          //设置父节点没有设为0（顶级节点）
          this.form.parentId = row.categoryId || 0;
          //栏目置空
          this.form.categoryId = null;
          this.form.categoryName = "";
        }
        this.open = true;
        this.title = "新增栏目管理";
      });
    },
    /** 子目录删除按钮操作 */
    handleSubDelete(row) {
      this.$confirm(
        '是否确认删除栏目管理编号为"' + row.categoryId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          let loading = that.loadingView();
          return delCategory(row.categoryId);
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
  },
};
</script>

