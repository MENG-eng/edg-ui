<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="类型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入数据类型名称"
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
          v-hasPermi="['edg:type:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['edg:type:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-unfold"
          size="mini"
          @click="handleFold"
          v-hasPermi="['edg:type:add']"
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
      :data="typeList"
      row-key="id"
      default-expand-all
      :indent="16"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      stripe
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="数据类型名称" align="center" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="enable">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :active-value="true"
            :inactive-value="false"
            @change="handleTypeEnable(scope.row)"
          ></el-switch>
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
            @click="handleSubUpdate(scope.row)"
            v-hasPermi="['edg:type:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleSubAdd(scope.row)"
            v-hasPermi="['edg:type:add']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleSubDelete(scope.row)"
            v-hasPermi="['edg:type:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改数据类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级类型" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="typeOptions"
            :normalizer="normalizer"
            placeholder="请选择上级栏目"
          />
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入数据类型名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              placeholder="点击选择图标"
              readonly
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="类型描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入类型描述"
            :autosize="{ minRows: 1, maxRows: 5 }"
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
  listType,
  listTypeSelect,
  getType,
  delType,
  addType,
  updateType,
  exportType,
  enableType,
} from "@/api/edg/type";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Type",
  components: { Treeselect, IconSelect },
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
      // 表格全部展开默认true
      isExpandTable: true,
      // 数据类型表格数据
      typeList: [],
      // 数据类型管理树选项
      typeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级数据类型不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "数据类型名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询数据类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then((response) => {
        this.typeList = this.handleTree(response.data, "id", "parentId");
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
        id: null,
        parentId: null,
        code: null,
        name: null,
        icon: null,
        enable: false,
        sort: null,
        describe: null,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 展开折叠按钮操作 */
    handleFold() {
      this.isExpandTable = !this.isExpandTable;
      this.fold(this.typeList, this.isExpandTable);
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

    /** 转换数据类型管理数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询数据类型下拉树结构 */
    getTreeselect() {
      listTypeSelect().then((response) => {
        this.typeOptions = [];
        const data = { id: 0, name: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.typeOptions.push(data);
      });
    },

    /** 启用、禁用数据类型 */
    handleTypeEnable(row) {
      const id = row.id;
      const enable = row.enable;
      enableType(id)
        .then((response) => {
          row.enable = enable;
        })
        .catch(() => {
          row.enable = !enable;
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      //获取当前下拉树结构
      this.getTreeselect();
      this.open = true;
      //默认设置为顶级节点
      this.form.parentId = 0;
      this.title = "添加数据类型";
    },
    /** 子目录新增按钮操作 */
    handleSubAdd(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id || this.ids;
      getType(id).then((response) => {
        this.form = response.data;
        if (row != null) {
          //设置父节点没有设为0（顶级节点）
          this.form.parentId = row.id || 0;
          //栏目置空
          this.form.id = null;
          this.form.name = "";
        }
        this.open = true;
        this.title = "新增数据类型";
      });
    },
    /** 子目录修改按钮操作 */
    handleSubUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id || this.ids;
      getType(id).then((response) => {
        this.form = response.data;
        //如果是顶级节点则parentId为0
        if (row != null) {
          this.form.parentId = row.parentId || 0;
        }
        this.open = true;
        this.title = "修改数据类型";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            let loading = this.loadingView();
            updateType(this.form)
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
            addType(this.form)
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
    /** 子目录删除按钮操作 */
    handleSubDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除数据类型编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delType(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有数据类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportType(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
