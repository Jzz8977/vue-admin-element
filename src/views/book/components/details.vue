<template>
  <el-form ref="postForm" :model="postForm" :rules="ruleForm">
    <Sticky :class-name="'sub-navbar '+ postForm.status">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button v-loading="loading" type="success" @click="submitForm">{{ isEdit?'显示帮助':'新增电子书' }}</el-button>
    </Sticky>
    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <!-- // 表单控件具体样式 -->
          <EbookUpload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdIput v-model="postForm.title" max-length="100" name="name" required>
              书名
            </MdIput>
          </el-form-item>
          <el-row>
            <el-col :span="12" class="form-item-author">
              <el-form-item :label-width="labelWidth" label="作者：" prop="author">
                <el-input
                  v-model="postForm.author"
                  placeholder="作者"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="出版社：" prop="publisher">
                <el-input
                  v-model="postForm.publisher"
                  placeholder="出版社"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="语言：" prop="language">
                <el-input
                  v-model="postForm.language"
                  placeholder="语言"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="根文件：">
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="文件路径：">
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="解压路径：">
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="封面路径：">
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="labelWidth" label="文件名称：">
                <el-input
                  v-model="postForm.fileName"
                  placeholder="文件名称"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="60px" label="封面：">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img">
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="60px" label="目录：">
                <div
                  v-if="postForm.contents && postForm.contents.length > 0"
                  class="contents-wrapper"
                >
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '../../../components/Sticky'
import Warning from './warning'
import EbookUpload from '../../../components/EbookUpload'
import MdIput from '../../../components/MDinput'
import { createBook } from '../../../api/book'
const fields = {
  title: '标题',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}
export default {
  name: 'Details',
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdIput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callBack) => {
      console.log(rule)
      if (value.length === 0) {
        callBack(new Error(fields[rule.field] + '必须填写'))
      } else {
        callBack()
      }
    }
    return {
      labelWidth: '120px',
      loading: false,
      fileList: [],
      postForm: {
      },
      defaultForm: {
        title: '',
        author: '',
        publisher: '',
        language: '',
        rootFile: '',
        cover: '',
        originalname: '',
        url: '',
        fileName: '',
        coverPath: '',
        filePath: '',
        unzipPath: ''
      },
      ruleForm: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    console.log(this.$route)
  },
  methods: {
    onContentClick(data) {
      if (data && data.text) {
        window.open(data.text)
      }
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalname,
        url,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath
      } = data

      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalname,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath
      }
      this.fileList = [{ name: originalname, url }]
      console.log(this.fileList)
      this.contentsTree = contentsTree
    },
    onUploadSuccess(data) {
      this.setData(data)
    },
    setDefault() {
      this.postForm = Object.assign({}, this.defaultForm)
      this.contentsTree = []
      this.fileList = []
      this.$refs.postForm.resetFields()
    },
    onUploadRemove() {
      // console.log('onUploadRemove')
      this.setDefault()
    },
    submitForm() {
      if (!this.loading) {
        this.loading = true

        this.$refs.postForm.validate((valid, fields) => {
          console.log(valid, fields)
          if (valid) {
          // 111
            const book = Object.assign({}, this.postForm)
            delete book.contentsTree
            console.log(book)
            if (!this.isEdit) {
              createBook(book).then(res => {
                const { message } = res
                this.$notify({
                  title: '操作作成功',
                  message,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                // this.setDefault()

              // eslint-disable-next-line handle-callback-err
              }).catch(err => {
                this.loading = false
              })
            } else {

              // updateBook(book)
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message.error(message)
            this.loading = false
          }
        })
      }
    },
    showGuide() {
      console.log('show guide..')
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-container{
  padding: 30px;
}
</style>
