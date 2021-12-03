<template>
  <el-dialog
    class="delDialog"
    title="是否确认批量删除"
    :visible.sync="isShowDelDialog"
    width="30%"
    @closed="closed"
  >
    <el-form :model="delDialogForm" :rules="delDialogRules" ref="delDialog" label-width="80px">
      <el-form-item label="备注" prop="remark">
        <el-input v-model="delDialogForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onDialogCancel">取 消</el-button>
      <el-button type="primary" @click="onDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

/*
 * 事件
 * - 点击确认（confirm）
 *   返回参数：用户输入的备注
 *
 * 待优化内容
 * - 代码整理
 *
 * 可研究内容
 * - 不重置备注（包括不用resetFields方法），备注也会消失的原因
 *   onDialogCancel和onDialogConfirm里不用重置，closed要
 * */
export default {
  name: 'DelDialog',
  props:{
    min:{
      type:Number,
      default:4,
    },
    max:{
      type:Number,
      default:60,
    },
  },
  data() {
    return {
      isShowDelDialog:false,
      delDialogForm: {
        remark: null
      },
      delDialogRules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { min: this.min, max: this.max, message: `长度在 ${this.min} 到 ${this.max} 个字符`, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show(){
      this.isShowDelDialog = true
    },
    onDialogCancel() {
      this.isShowDelDialog = false
      this.$refs.delDialog.resetFields()
    },
    onDialogConfirm() {
      this.$refs.delDialog.validate((valid) => {
        if (valid) {
          this.isShowDelDialog = false
          this.$emit('confirm', this.delDialogForm.remark)
        } else {
          return false
        }
      })
    },
    closed() { // (这个回调没参数的)
      this.isShowDelDialog = false
      this.delDialogForm.remark = null
      this.$refs.delDialog.resetFields()
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
.delDialog {
  .el-dialog__header{
    padding-left: 20px;
  }
  .el-dialog__body{
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 20px;
  }
}
</style>
