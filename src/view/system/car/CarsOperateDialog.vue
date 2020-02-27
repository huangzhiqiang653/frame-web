<!--zx_rts_db.t_rt_cars（车辆表）-dialog-->
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
      v-loading="loading">
      <el-form-item label="区域：" prop="villageCode">
        <cascader :set-props="setProps" :set-options="treeData" :set-data-type="'value'"
                  :set-size="GLOBAL.config.systemSize" maxlength="64"
                  v-model="formData.villageCode"
                  ref="myArea"></cascader>
      </el-form-item>
      <el-form-item label="车牌号：" prop="carNo">
        <el-input v-model="formData.carNo" placeholder="车牌号" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="管理区域：" prop="listManageArea">
        <cascader :set-props="setManageProps" :set-options="treeData" :set-data-type="'value'"
                  :set-size="GLOBAL.config.systemSize" maxlength="64"
                  v-model="formData.listManageArea"
                  ref="manageArea"></cascader>
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
<script>
    import cascader from '../../../components/Cascader'

    export default {
        name: 'cars',
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
                    townCode: '',
                    villageCode: '',
                    carNo: '',
                    manageAreaCode: ''
                },
                // 校验规则
                formRules: {
                    villageCode: [],
                    carNo: [],
                },
                treeData: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.orgTreeName))),
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
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
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
        methods:
            {
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
                        this.getInfo()
                    }
                },
                getTreeData: function () {
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
                                _this.treeData = resultData
                            } else {
                                _this.$message.warning('获取组织数据失败～')
                            }
                        },
                        () => {
                            _this.loading = false
                        }
                    )
                },
                getInfo: function () {
                    this.getTreeData()
                },
                closeDialog: function () {
                    this.showFlag = false
                },
                saveOrUpdateForm: function () {
                    // 参数处理======start==========
                    let checkedMenusNode = this.$refs.manageArea.getCheckedNodes(true)
                    if (!checkedMenusNode) {
                        this.$message.warning('请勾选区域～')
                        return
                    }
                    let checkedAreaId = new Set()
                    checkedMenusNode.forEach(item => {
                        checkedAreaId.add(item.id + "," + item.code)
                    })
                    this.formData.manageAreaCode = checkedAreaId
                    // 参数处理======end============
                    let _this = this
                    _this.loading = true
                    let params = this.formData
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxRelationRoleMenu,
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
                }
            }
    }
</script>
