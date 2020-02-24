<!--zx_frame_db.auth_zx_account（账户表）-dialog-->
<template>
  <el-dialog
    :title="showTitle"
    :visible.sync="showFlag"
    :destroy-on-close="true"
  >
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
        <el-col :span="24">
          <el-form-item label="账户名称：" prop="accountName">
            <el-input v-model="formData.accountName" placeholder="账户名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属用户：" prop="userId">
            <el-select v-model="formData.userId"
                       placeholder="所属用户"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.userName" :value="item.id+','+item.userName"
                         v-for="item in dictionary.availableUsers" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="margin-top-20">
      <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
      <el-button
        v-if="editableFlag"
        type="primary"
        @click="saveOrUpdateForm"
        style="margin: 0 20px;"
        :size="GLOBAL.config.systemSize">保存
      </el-button>
    </el-row>
  </el-dialog>
</template>
<script>
  export default {
    name: 'ZxAccountOperateDialog',
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
          userId: ''
        },
        // 校验规则
        formRules: {
          accountName: [
            {required: true, message: '请输入账号名称', trigger: 'blur'}
          ],
          userId: [
            {required: true, message: '请选择用户', trigger: 'blur'}
          ]
        },
        // 字典数据
        dictionary: {
          availableUsers: []
        },
        editableFlag: true,
        loading: false,
        showTitle: '新增',
        showFlag: false
      }
    },
    mounted () {
      this.getAvailableUser()
    },
    methods: {
      init: function (type, id) {
        this.formData = {
          id: '',
          accountName: '',
          userId: ''
        }
        let _title = ''
        if (type === 'add') {
          _title = '新增'
        } else if (type === 'edit') {
          _title = '编辑'
        } else if (type === 'view') {
          _title = '查看'
          this.editableFlag = false
        }
        this.showTitle = this.showTitle || _title
        this.showFlag = true
        if (id) {
          this.formData.id = id
          this.getInfo()
        }
      },
      closeDialog: function () {
        this.showFlag = false
      },
      saveOrUpdateForm: function () {
        this.formData.id ? this.updateForm() : this.saveForm()
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
                  _this.showFlag = false
                  _this.$props.refresh && this.$props.refresh('init')
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
                  _this.showFlag = false
                  _this.$props.refresh && this.$props.refresh('init')
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
            this.$refs.formData.resetFields()
            _this.loading = false
            Object.assign(_this.formData, resultData)
          }
        )
      },
      getAvailableUser: function (searchName) {
        let _this = this
        this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.zxUser,
          _this.GLOBAL.config.handleType.getListByCondition,
          {userName: searchName},
          null,
          resultData => {
              // cs
            this.dictionary.availableUsers = resultData
          }
        )
      }
    }
  }
</script>
