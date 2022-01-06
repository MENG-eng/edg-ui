<template>
    <el-dialog :title="title" :visible.sync="visible" width="500px" append-to-body>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="文件名" prop="fileName">
                <el-input v-model="form.fileName" placeholder="请输入文件名" disabled />
            </el-form-item>
            <el-form-item label="数据类型" prop="dataType">
                <el-input v-model="form.dataType" placeholder="请输入数据类型" disabled />
            </el-form-item>
            <el-form-item label="业务类型" prop="businessType">
                <el-input v-model="form.businessType" placeholder="请输入业务类型" disabled />
            </el-form-item>
            <el-form-item label="文件描述" prop="describe">
                <el-input v-model="form.describe" placeholder="请输入文件描述" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
  name: "PublishDialog",
  data() {
    return {
        visible: this.open,
        title: "",
        // 表单参数
        form: {},
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  methods: {      
    // 取消按钮
    cancel() {
      this.visible = false;
    },
    
    /** 提交按钮 */
    submitForm() {
        alert("提交！");
        this.visible = false;
    },
  },
};
</script>