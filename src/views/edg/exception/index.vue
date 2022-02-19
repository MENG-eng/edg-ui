<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="文件名" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入文件名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型名称" prop="evidenceType">
        <treeselect
          v-model="queryParams.evidenceType"
          :options="evidenceTypeList"
          placeholder="请选择数据类型"
          @select="evidenceTypeChange"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="optType">
        <el-select v-model="queryParams.optType" placeholder="请选择操作类型" clearable size="small">
          <el-option label="创建" value="CREATE" />
          <el-option label="增加" value="ADD" />
          <el-option label="修改" value="MODIFY" />
          <el-option label="复制" value="COPY" />
        </el-select>
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
        >
        </el-date-picker>
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
          v-hasPermi="['edg:exception:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['edg:exception:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="exceptionList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件名" align="center" prop="fileName" />
      <el-table-column label="数据类型名称" align="center" prop="evidenceTypeName" />
      <el-table-column label="操作类型" align="center" prop="optType" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="异常描述" align="center" prop="description" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改数据异常对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="数据id" prop="evidenceId">
          <el-input v-model="form.evidenceId" placeholder="请输入数据id" />
        </el-form-item> -->
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入文件名" />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="form.evidenceType" placeholder="请选择数据类型" style="width:100%">
            <el-option label="请选择字典生成" value />
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" prop="evidenceTypeName">
          <el-input v-model="form.evidenceTypeName" placeholder="请输入数据类型名称" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="form.optType" placeholder="请选择操作类型" style="width:100%">
            <el-option label="请选择字典生成" value />
          </el-select>
        </el-form-item>
        <el-form-item label="异常描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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
  listException,
  getException,
  delException,
  addException,
  updateException,
  exportException,
} from "@/api/edg/exception";
import {  listDataType } from "@/api/edg/evidence";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Exception",
  components: { Treeselect },
  data() {
    return {
      /** 数据类型 */
      evidenceTypeList: [],

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

      // 数据异常表格数据
      exceptionList: [],

      // 弹出层标题
      title: "",

      // 是否显示弹出层
      open: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        evidenceId: null,
        fileName: null,
        evidenceType: null,
        optType: null,
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

    /** 查询数据异常列表 */
    getList() {
      this.loading = true;
      listException(this.queryParams).then((response) => {
        this.exceptionList = response.rows || [];
        for (var i = 0; i < this.exceptionList.length; i++) {
          this.exceptionList[i].optType = this.handleOptType(
            this.exceptionList[i].optType
          );
        };
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 数据类型改变 */
    evidenceTypeChange(item) {
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

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加数据异常";
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
      this.$confirm("是否确认导出所有数据异常数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportException(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
