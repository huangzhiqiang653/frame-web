<!--zx_rts_db.t_rt_user（用户表）-dialog-->
<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
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
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="formData.name" placeholder="姓名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber" placeholder="手机号" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="所属乡镇编码：" prop="townCode" label-width="80" >
        <el-input v-model="formData.townCode" placeholder="所属乡镇编码" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="所属村居编码：" prop="villageCode" label-width="80" >
        <el-input v-model="formData.villageCode" placeholder="所属村居编码" maxlength="64"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="margin-top-20">
      <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
      <el-button v-if="editableFlag" type="primary" @click="saveOrUpdateForm" style="margin: 0 20px;"
                 :size="GLOBAL.config.systemSize">保存
      </el-button>
    </el-row>
  </el-dialog>
</template>
<script>export default {
    name: 'user',
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
                name: '',
                phoneNumber: '',
                townCode: '',
                villageCode: ''
            },
            // 校验规则
            formRules: {
                name: [],
                phoneNumber: [],
                townCode: [],
                villageCode: []
            },
            // 字典数据
            dictionary: {},
            editableFlag: true,
            loading: false,
            showTitle: '',
            showFlag: false
        }
    },
    methods: {
        init: function (type, id) {
            let _title = ''
            if (type === 'add') {
                _title = '新增人员审核'
                this.editableFlag = true
            } else if (type === 'edit') {
                _title = '编辑人员审核'
                this.editableFlag = true
            } else if (type === 'view') {
                _title = '查看人员审核'
                this.editableFlag = false
            }
            this.showTitle = _title
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
                        _this.GLOBAL.config.businessFlag.rtUser,
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
                        _this.GLOBAL.config.businessFlag.rtUser,
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
                _this.GLOBAL.config.businessFlag.rtUser,
                _this.GLOBAL.config.handleType.getInfoById,
                _this.formData.id,
                null,
                resultData => {
                    _this.loading = false
                    Object.assign(_this.formData, resultData)
                }
            )
        }
    }
}
</script>
