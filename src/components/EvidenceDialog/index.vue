<template>
  <el-dialog :visible.sync="open" width="400px" append-to-body>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-row :gutter="30">
        <el-col :span="4.8">
          <el-form-item label="分类名称" prop="categoryName">
            <el-input
              v-model="queryParams.categoryName"
              placeholder="文件名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4.8">
          <el-form-item label="数据类型" prop="categoryName">
            <el-input
              v-model="queryParams.categoryName"
              placeholder="数据类型"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4.8">
          <el-form-item label="业务类型" prop="categoryName">
            <el-input
              v-model="queryParams.categoryName"
              placeholder="业务类型"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="4.8">
          <el-form-item label="数据文件" prop="categoryName">
            <el-input
              v-model="queryParams.categoryName"
              placeholder="原始文件"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4.8">
          <el-form-item label="文件描述">
            <el-input type="textarea" v-model="queryParams.desc"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4.8"></el-col>
      </el-row>
      <el-form-item label="附件1" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="附件"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">文件上传提示</div>
        </el-upload>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="4" class="btnContainer">
          <el-button class="btn" type="primary">重置</el-button>
        </el-col>
        <el-col :span="4" class="btnContainer">
          <el-button class="btn" type="primary">保存</el-button>
        </el-col>
        <el-col :span="4" class="btnContainer">
          <el-button class="btn" type="primary">数据</el-button>
        </el-col>
      </el-row>

      <!-- <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>-->
    </el-form>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="upload.open = false">取 消</el-button>
    </div>-->
  </el-dialog>
</template>

<script>
export default {
  name: "EvidenceDialog",
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      // 显示搜索条件
      open: true,
      showSearch: true,
      queryParams: {
        categoryName: null,
        desc: "",
      },
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },
  methods: {
    /** 删除文件 */
    handleRemove(file, fileList) {},
    /** 点击文件 */
    handlePreview(file) {},
    /** 文件超出 */
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    /** 删除确认 */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
