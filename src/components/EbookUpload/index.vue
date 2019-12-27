<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :limit="1"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload" />
      <div v-if="fileList.length===0" class="el-upload__text">
        请将电子书拖入或<em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">
        图书已上传
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '../../utils/auth'
export default {
  name: 'EbookUpload',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    beforeUpload(file) {
      console.log(file)
      this.$emit('beforeUpload', file)
    },
    onSuccess(response, file) {
      const { code, msg } = response
      if (code === 0) {
        this.$message.success(msg)
        this.$emit('onSuccess', file)
      } else {
        this.$message.error(msg && `上传失败，失败原因: ${msg}` || msg)
        this.$emit('onError', file)
      }
    },
    onRemove(file) {
      this.$message.success('电子书删除成功')
      this.$emit('onRemove', file)
    },
    onError(err) {
      let errMsg = '上传失败'
      if (err.message) {
        errMsg = JSON.parse(err.message).msg
        this.$message.error('上传失败，原因是:' + errMsg)
      } else {
        // errMsg = '上传失败'
        this.$message.error(errMsg)
      }
      this.$emit('onError', err)
    },
    onExceed() {
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
