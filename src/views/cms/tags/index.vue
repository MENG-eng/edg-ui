<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标签名称" prop="tagName">
        <el-input
          v-model="queryParams.tagName"
          placeholder="请输入标签名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签类型" prop="tagType">
        <el-select v-model="queryParams.tagType" placeholder="请选择标签类型" clearable size="small">
          <el-option v-for="dict in tagTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cms:tags:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:tags:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:tags:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:tags:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tagsList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标签名称" align="center" prop="tagName" />
      <el-table-column label="标签类型" align="center" prop="tagType" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" width="240" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="tagsList[scope.$index].status"
            :active-value="0"
            :inactive-value="1"
            @change="handleTagsEnable(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:tags:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:tags:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改标签管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="form.tagType" placeholder="请选择标签类型">
            <el-option v-for="dict in tagTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" placeholder="请输入排序" controls-position="right" :min="1"/>
        </el-form-item>
        <el-form-item label="连接" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接" />
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
import { listTags, getTags, delTags, addTags, updateTags, exportTags, disableTags, enableTags } from "@/api/cms/tags";

export default {
  name: "Tags",
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
      // 状态
      statusOptions: [],
      // 总条数
      total: 0,
      // 标签管理表格数据
      tagsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tagType: null,
        tagName: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 标签类型字典
      tagTypeOptions: [],
      status: 0,
    };
  },
  created() {
    this.getList();
    // 获取内容标签类型
    this.getDicts("cms_tag_type").then((response) => {
      this.tagTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询标签管理列表 */
    getList() {
      this.loading = true;
      listTags(this.queryParams).then(response => {
        this.tagsList = response.rows;
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
        tagId: null,
        tagType: null,
        userId: null,
        tagName: null,
        sort: null,
        status: 0,
        url: null
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
    /** 启用、禁用标签 */
    handleTagsEnable(row) {
      const tagsId =row.tagId;
      const status = row.status;
      
      if (status === 1) {
        //禁用
        disableTags(tagsId)
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
        enableTags(tagsId)
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tagId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加标签";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tagId = row.tagId || this.ids
      getTags(tagId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改标签";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.tagId != null) {
            let loading = this.loadingView();
            updateTags(this.form).then(response => {
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
            addTags(this.form).then(response => {
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
      const tagIds = row.tagId || this.ids;
      this.$confirm('是否确认删除标签管理编号为"' + tagIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          let loading = that.loadingView();
          return delTags(tagIds);
        }).then(() => {
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
      this.$confirm('是否确认导出所有标签管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTags(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
