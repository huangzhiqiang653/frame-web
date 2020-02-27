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
      <el-row class="margin-top-20">
        <el-col :span="24">
          <el-form-item label="区域：" prop="villageCode">
            <cascader :set-props="setProps" :set-options="treeData" :set-data-type="'value'"
                      :set-size="GLOBAL.config.systemSize" maxlength="64"
                      :val="formData.villageCode"
                      @getValue="getValue"
                      ref="myArea"></cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="人员姓名：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号码：" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="管理区域：" prop="townCode">
            <cascader :set-props="setManageProps" :set-options="treeData" :set-data-type="'value'"
                      :set-size="GLOBAL.config.systemSize" maxlength="64"
                      :val="formData.listManageArea"
                      ref="manageArea"></cascader>
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
<script>
    import cascader from '../../../components/Cascader'

    export default {
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
        data() {
            return {
                formData: {
                    id: '',
                    name: '',
                    phoneNumber: '',
                    villageCode: '',
                    userType: this.GLOBAL.config.userType.repairPersonnel,
                    listManageArea: [],
                },
                // 校验规则
                formRules: {
                    name: [],
                    phoneNumber: [],
                    villageCode: [],
                    listManageArea: [],
                },
                //管理区域
                setManageProps: {
                    multiple: true, // 多选
                    checkStrictly: true, // 父节点取消选中关联
                    value: 'code',
                    label: 'name',
                    children: 'children',
                    leaf: 'leaf'
                },
                //所属区域
                setProps: {
                    multiple: false, // 单选
                    checkStrictly: true, // 父节点取消选中关联
                    value: 'code',
                    label: 'name',
                    children: 'children',
                    leaf: 'leaf'
                },
                treeData: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.orgTreeName))),
                // 字典数据
                dictionary: {},
                editableFlag: true,
                loading: false,
                showTitle: '新增',
                showFlag: false
            }
        },
        components: {
            cascader
        },
        methods: {
            init: function (type, id) {
                let _title = ''
                if (type === 'add') {
                    _title = '新增'
                } else if (type === 'edit') {
                    _title = '编辑'
                } else if (type === 'view') {
                    _title = '查看'
                    this.editableFlag = false
                }
                this.showTitle = _title
                this.showFlag = true
                if (id) {
                    this.formData.id = id
                    this.getManageArea()
                    this.getInfo()
                }
            },
            closeDialog: function () {
                this.showFlag = false
            },
            saveOrUpdateForm: function () {
                // 参数处理======start==========
                let myAreaCode = this.$refs.myArea.selectValue
                if (!myAreaCode) {
                    this.$message.warning('请勾选区域～')
                    return
                }

                let checkedNode = this.$refs.manageArea.radioObj
                if (!checkedNode) {
                    _this.$message.warning('请勾选区域～')
                    return
                }
                let checkedAreaId = []
                checkedNode.forEach(item => {
                    checkedAreaId.push({"orgCode": item.code, "orgId": item.id})
                })
                this.formData.villageCode = myAreaCode
                this.formData.listManageArea = checkedAreaId
                // 参数处理======end============
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
            },
            //获取管理区域
            getManageArea: function () {
                let _this = this
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtManageArea,
                    _this.GLOBAL.config.handleType.getListByCondition,
                    {"targetId": _this.formData.id},
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            // 结果参数赋值
                            let manageAreaIds = []
                            resultData.forEach(item => {
                                manageAreaIds.push(item.orgCode)
                            })
                            _this.formData.listManageArea = manageAreaIds
                        }
                    }
                )
            },
        }
    }
</script>
