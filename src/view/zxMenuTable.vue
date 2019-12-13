<!--zx_frame_db.auth_zx_account（账户表）-dialog-->
<template>
  <div class="main-area">
    <el-form
      :inline="true"
      :model="formData"
      class="demo-ruleForm"
      label-width="100px"
      :rules="formRules"
      ref="formData"
      :size="GLOBAL.config.systemSize"
      element-loading-text="数据处理中...请稍等..."
      :disabled="!editableFlag"
      v-loading="loading">
      <el-row class="margin-top-20">
        <el-col :span="8">
          <el-form-item label="账户名称：" prop="accountName">
            <el-input v-model="formData.accountName" placeholder="账户名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账户密码：" prop="accountPassword">
            <el-input v-model="formData.accountPassword" placeholder="账户密码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账号状态：" prop="status">
            <el-radio-group
              v-model="formData.status"
              placeholder="账号状态">
              <el-radio
                v-for="item in dictionary.zhzt"
                :label="item.code"
                :key="item.id">{{item.name}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序：" prop="sort">
            <el-input-number
              v-model="formData.sort"
              placeholder="排序"
              :min="0"
              :precision="2"
              :step="1"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：">
            <el-upload
              style="float: left;"
              class="upload-demo"
              list-type="picture-card"
              :action="CONFIG.urls.root +  CONFIG.urls.system.upload"
              :on-success="fileUpload"
              :file-list="formData.filesCache"
              ref="upload"
              multiple>
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}" class="upload-view">
                <img
                  style="display: block;"
                  class="el-upload-list__item-thumbnail"
                  :src="FUNCTIONS.systemFunction.fileTypeView(this, file)">
                <span class="el-upload-list__item-actions">
                                        <span
                                          class="el-upload-list__item-delete"
                                          @click="FUNCTIONS.systemFunction.fileDownload(file)">
                                          <i class="el-icon-download"></i>
                                        </span>
                                        <span class="el-upload-list__item-delete"
                                              @click="fileRemove(file)">
                                          <i class="el-icon-delete"></i>
                                        </span>
                                      </span>
                <span>{{file.response.data.fileName}}</span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
        <el-button type="primary" @click="saveForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存</el-button>
        <el-button type="primary" @click="updateForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保持修改</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>export default {
  name: 'zxAccount',
  props: {
    id: {
      type: String
    },
    refresh: {
      type: Function
    },
    closeSelf: {
      type: Function
    }
  },
  data () {
    return {
      formData: {
        id: '',
        accountName: '',
        accountPassword: '',
        status: '',
        sort: '',
        filesCache: []
      },
      // 校验规则
      formRules: {
        accountName: [],
        accountPassword: [],
        status: [],
        sort: [],
      },
      // 字典数据
      dictionary: {
        zhzt: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.zhzt))),
      },
      editableFlag: true,
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init: function () {
      this.getInfo()
    },
    closeDialog: function () {
      this.$props.closeSelf && this.$props.closeSelf()
    },
    saveForm: function () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          let params = this.formData
          // 参数处理======start==========
          // TODO 对于单选、复选、多选、附件等需要进行单独处理
          // 参数处理======end============
          let _this = this
          _this.loading = true
          this.FUNCTIONS.systemFunction.interactiveData(
            _this,
            _this.GLOBAL.config.businessFlag.zxAccount,
            _this.GLOBAL.config.handleType.add,
            _this.FUNCTIONS.systemFunction.removeNullFields(params),
            null,
            resultData => {
              _this.loading = false
              if (resultData) {
                _this.$message.success('保存成功～')
              } else {
                _this.$message.warning('保存失败～')
              }
            },
            () => {
              _this.loading = false
            })
        } else {
          this.$message.error('校验失败～')
          return false
        }
      })
    },
    updateForm: function () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          let params = this.formData
          // 参数处理======start==========
          // TODO 对于单选、复选、多选、附件等需要进行单独处理
          // 参数处理======end============
          let _this = this
          _this.loading = true
          this.FUNCTIONS.systemFunction.interactiveData(
            _this,
            _this.GLOBAL.config.businessFlag.zxAccount,
            _this.GLOBAL.config.handleType.updateAll,
            _this.FUNCTIONS.systemFunction.removeNullFields(params),
            null,
            resultData => {
              _this.loading = false
              if (resultData) {
                _this.$message.success('修改成功～')
              } else {
                _this.$message.warning('修改失败～')
              }
            },
            () => {
              _this.loading = false
            })
        } else {
          this.$message.error('校验失败～')
          return false
        }
      })
    },
    getInfo: function () {
      let _this = this
      this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
        _this,
        _this.GLOBAL.config.businessFlag.zxAccount,
        _this.GLOBAL.config.handleType.getInfoById,
        _this.formData.id,
        null,
        resultData => {
          _this.loading = false
          // 附件数据处理
          if (resultData.files && resultData.files.length > 0) {
            resultData.files.forEach(item => {
              _this.formData.filesCache.push({
                response: {
                  code: '0',
                  data: item
                }
              })
            })
          }
          Object.assign(_this.formData, resultData)
        }
      )
    },
    fileUpload: function (response, file, fileList) {
      if (response && (response.code !== this.GLOBAL.config.resultCode.success)) {
        this.$message.error('上传失败～')
      } else {
        this.formData.files.push(response.data)
      }
    },
    fileRemove: function (file) {
      let eg = file.response.data
      this.formData.files = this.formData.files.filter(item => (item.fileUrl !== eg.fileUrl)
      )
      let fileList = this.$refs.upload.uploadFiles
      let index = fileList.findIndex(fileItem => {
          return fileItem.uid === file.uid
        }
      )
      fileList.splice(index, 1)
    }
  }
}
</script>
