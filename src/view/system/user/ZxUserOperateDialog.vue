<!--zx_frame_db.auth_zx_user（用户表）-dialog-->
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
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="formData.userName" placeholder="姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="性别：" prop="sex">
            <el-radio-group
              v-model="formData.sex"
              style="float: left;"
              placeholder="性别">
              <el-radio
                v-for="item in dictionary.sex"
                :label="item.code"
                :key="item.id" border>{{item.name}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出生年月日" prop="birthDay">
            <el-date-picker
              style="width: 100%"
              v-model="formData.birthDay"
              type="date"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd"
              placeholder="选择出生年月日" prop="birthDay">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属机构：" prop="organizationId">
            <el-cascader
              ref="orgList"
              v-model="formData.organizationId"
              style="width: 100%;"
              placeholder="所属机构"
              :options="dictionary.treeData"
              :props="defaultProps"
              clearable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="formData.email" placeholder="邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号码：" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea"
                      :rows="2"
                      v-model="formData.remark"
                      placeholder="备注"
                      maxlength="500"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
    name: 'ZxUserOperateDialog',
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
    data() {
        return {
            formData: {
                id: '',
                userName: '',
                sex: '',
                birthDay: '',
                organizationId: [],
                email: '',
                phoneNumber: '',
                remark: '',
                status: ''
            },
            // 校验规则
            formRules: {
                userName: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                birthDay: [],
                organizationId: [
                    {required: true, message: '请选择部门', trigger: 'blur'}
                ],
                email: [],
                phoneNumber: [
                    {required: true, message: '请输入手机号码', trigger: 'blur'}
                ],
                remark: []
            },
            // 字典数据
            dictionary: {
                sex: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.sex))),
                treeData: []
            },
            editableFlag: true,
            loading: false,
            showTitle: '',
            showFlag: false,
            defaultProps: {
                checkStrictly: true,
                label: 'shortName',
                value: 'id',
                children: 'children',
                expandTrigger: 'hover'
            }
        }
    },
    mounted() {
        this.getTreeData()
    },
    methods: {
        init: function (type, id) {
            this.formData = {
                id: '',
                userName: '',
                sex: '',
                birthDay: '',
                organizationId: [],
                email: '',
                phoneNumber: '',
                remark: '',
                status: ''
            }
            let _title = ''
            if (type === 'add') {
                _title = '新增'
            } else if (type === 'edit') {
                _title = '编辑'
                this.editableFlag = true
            } else if (type === 'view') {
                _title = '查看'
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
            let orgs = this.$refs.orgList.getCheckedNodes(), selectOrgName = ''
            if (orgs && orgs.length && (orgs.length === 1)) {
                selectOrgName = orgs[0].label
            }
            this.$refs.formData.validate(valid => {
                if (valid) {
                    let params = this.formData
                    // 参数处理======start==========
                    // TODO 对于单选、复选、多选、附件等需要进行单独处理
                    this.$refs.orgList.getCheckedNodes()
                    params.organizationId = params.organizationId.join(',')
                    if (selectOrgName) {
                        params.organizationId = params.organizationId + ',' + selectOrgName
                    }
                    // 参数处理======end============
                    let _this = this
                    _this.loading = true
                    this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxUser,
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
            let _this = this, orgs = this.$refs.orgList.getCheckedNodes(), selectOrgName = ''
            if (orgs && orgs.length && (orgs.length === 1)) {
                selectOrgName = orgs[0].label
            }
            _this.$refs.formData.validate(valid => {
                if (valid) {
                    let params = this.formData
                    // 参数处理======start==========
                    // TODO 对于单选、复选、多选、附件等需要进行单独处理
                    if (params.organizationId && params.organizationId.length) {
                        params.organizationId = params.organizationId.join(',')
                    }
                    if (selectOrgName) {
                        params.organizationId = params.organizationId + ',' + selectOrgName
                    }
                    // 参数处理======end============
                    let _this = this
                    _this.loading = true
                    this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxUser,
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
                _this.GLOBAL.config.businessFlag.zxUser,
                _this.GLOBAL.config.handleType.getInfoById,
                _this.formData.id,
                null,
                resultData => {
                    _this.loading = false
                    resultData.sex = resultData.sex.toString()
                    if (resultData.organizationId) {
                        resultData.organizationId = resultData.organizationId.split(',').slice(0, resultData.organizationId.split(',').length - 1)
                    }
                    Object.assign(_this.formData, resultData)
                }
            )
        },
// 组织树数据
        getTreeData: function () {
            this.loading = true
            let _this = this
            // 3、 调接口获取数据
            _this.FUNCTIONS.systemFunction.interactiveData(
                _this,
                _this.GLOBAL.config.businessFlag.zxOrganization,
                _this.GLOBAL.config.handleType.getTree,
                null,
                null,
                resultData => {
                    _this.loading = false
                    if (resultData) {
                        _this.dictionary.treeData = resultData
                    } else {
                        _this.$message.warning('获取组织数据失败～')
                    }
                },
                () => {
                    _this.loading = false
                }
            )
        }
    }
}
</script>
