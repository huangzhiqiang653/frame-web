<!--zx_frame_db.auth_zx_organization（组织表）-table-->
<!--参数添加，1、config.js business中添加：zxOrganization: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：zxOrganization: 'zxOrganization'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>区域管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container>
      <el-aside class="tree-area">
        <el-tree
          style="margin: 10px"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :size="GLOBAL.config.systemSize"
          ref="orgList"
          accordion
          @node-click="handleNodeClick">
        </el-tree>
      </el-aside>
      <el-container class="tree-content">
        <el-row class="margin-top-20">
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

            <el-divider content-position="left">区域信息{{formData.name? '(' + formData.name+ ')':''}}
            </el-divider>
            <el-alert
              title="根节点数据不允许操作"
              v-if="!formData.parentCode && formData.id"
              style="margin-bottom: 10px;"
              :closable="false"
              type="warning">
            </el-alert>
            <el-alert
              title="请选择左侧待操作区域数据"
              v-if="!formData.parentCode && !formData.id"
              style="margin-bottom: 10px;"
              :closable="false"
              type="success">
            </el-alert>
            <el-col :span="12">
              <el-form-item label="区域名称：" prop="name">
                <el-input v-model="formData.name" placeholder="区域名称" maxlength="64" :disabled="codeDisabled(formData.parentCode,formData.id)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="区域编码：" prop="code">
                <el-input v-model="formData.code" placeholder="区域编码" maxlength="64" :disabled="codeAuth(formData.parentCode,formData.id)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型：" prop="type">
                <el-radio v-model="formData.type" :label="0" :disabled="codeAuth(formData.parentCode,formData.id)">村居</el-radio>
                <el-radio v-model="formData.type" :label="1" :disabled="codeAuth(formData.parentCode,formData.id)">乡镇</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input-number
                  v-model="formData.sort"
                  placeholder="排序"
                  :disabled="codeDisabled(formData.parentCode,formData.id)"
                  :min="1"
                  :step="1"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="2" v-model="formData.remark" placeholder="备注" :disabled="codeDisabled(formData.parentCode,formData.id)"
                          maxlength="64"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24">
            <el-button
              v-if="editableFlag"
              type="primary"
              @click="saveOrUpdateForm"
              style="margin: 0 20px;"
              :size="GLOBAL.config.systemSize">保存
            </el-button>
            <el-button
              v-if="editableFlag"
              type="primary"
              @click="appendDepartment"
              :disabled="childArea(formData.id, formData.type, formData.parentCode)"
              style="margin: 0 20px;"
              :size="GLOBAL.config.systemSize">增加子区域
            </el-button>
            <el-button
              v-if="editableFlag"
              @click="handleDelete"
              style="margin: 0 20px;"
              :disabled="!formData.parentCode"
              :size="GLOBAL.config.systemSize">删除
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">区域人员{{formData.name? '(' + formData.name+ ')':''}}
            </el-divider>
            <zxUser ref="zxUser"/>
          </el-col>
        </el-row>
      </el-container>
    </el-container>
  </div>
</template>
<script>
    // 替换成相应的模板
    import zxUser from './VillagerTableSimpl'

    export default {
        name: 'ZxOrganization',
        data () {
            return {
                // 查询表单
                searchForm: {
                    fullName: ''
                },
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                formData: {
                    id: '',
                    fullName: '',
                    name: '',
                    code: '',
                    sort: '',
                    type: '',
                    parentCode: '',
                    parentId: '',
                    remark: ''
                },
                // 校验规则
                formRules: {
                    fullName: [
                        {required: true, message: '请输入部门全称', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入简称', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'}
                    ],
                    sort: [],
                    remark: []
                },
                // 字典数据
                dictionary: {},
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    add: true,
                    infoEdit: true
                },
                loading: false,
                editableFlag: true
            }
        },
        components: {
            zxUser
        },
        mounted () {
            this.init()
        },
        methods: {
            // 判断新增子区域
            childArea: function (id, type, parentCode) {
                if (!id) {
                    return true
                } else if (type == 1 && !id) {
                    return true
                } else if (type == 1 && id) {
                    return false
                } else {
                    return true
                }
            },
            codeDisabled: function (parentCode, id) {
                if (!parentCode && id) {
                    return true
                } else if (parentCode && id) {
                    return false
                } else {
                    return false
                }
            },
            // 判断区域编码可编辑
            codeAuth: function (parentCode, id) {
                if (!id) {
                    return false
                } else {
                    return true
                }
            },
            init: function () {
                this.getTreeData()
                this.$refs.zxUser.init()
            },
            doSearch: function () {
            },
            operationMethod: function (operateType, info) {
                this.$refs.operationTemplate.init(operateType, info ? info.id : null)
            },
            getSource: function (rowData) {
                let tempList = []
                this.source.infoEdit && tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'})
                return tempList
            },
            handleCommon: function (type, rowData) {
                switch (type) {
                    case 'handleEdit':
                        this.handleEdit(rowData)
                        break
                }
            },
            // 编辑
            handleEdit: function (rowData) {
                this.operationMethod('edit', rowData)
                // TODO
            },
            // 组织树数据
            getTreeData: function () {
                this.loading = true
                let _this = this
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtOrganization,
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
            handleNodeClick: function (target, node) {
                debugger
                let ids = target.code

                function f (tmpNode) {
                    if (tmpNode &&
                        tmpNode.data &&
                        tmpNode.data.id &&
                        (typeof tmpNode.data === 'object')) {
                        ids = tmpNode.data.id + ',' + ids
                        f(tmpNode.parent)
                    }
                }

                // f(node)
                this.formData = target
                this.$refs.zxUser.init(ids)
            },
            appendDepartment: function () {
                this.formData = {
                    id: '',
                    fullName: '',
                    name: '',
                    code: '',
                    type: '',
                    sort: '',
                    parentId: this.formData.id ? this.formData.id : null,
                    parentCode: this.formData.code ? this.formData.code : null,
                    remark: ''
                }
                // this.$refs.zxUser.init()
            },
            saveOrUpdateForm: function () {
                this.formData.id ? this.updateForm() : this.saveForm()
            },
            saveForm: function () {
                this.$refs.formData.validate(valid => {
                    if (valid) {
                        let params = this.formData
                        debugger
                        // 参数处理======start==========
                        // TODO 对于单选、复选、多选、附件等需要进行单独处理
                        // 参数处理======end============
                        let _this = this
                        _this.loading = true
                        this.FUNCTIONS.systemFunction.interactiveData(
                            _this,
                            _this.GLOBAL.config.businessFlag.rtOrganization,
                            _this.GLOBAL.config.handleType.add,
                            _this.FUNCTIONS.systemFunction.removeNullFields(params),
                            null,
                            resultData => {
                                _this.loading = false
                                if (resultData) {
                                    Object.assign(_this.formData, resultData)
                                    _this.$message.success('保存成功～')
                                    _this.showFlag = false
                                    _this.getTreeData()
                                    if (_this.treeData.length > 0) {
                                        _this.$refs.zxUser.init(resultData.code)
                                    }
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
                        // 删除子数据
                        delete params.children
                        // 参数处理======end============
                        let _this = this
                        _this.loading = true
                        this.FUNCTIONS.systemFunction.interactiveData(
                            _this,
                            _this.GLOBAL.config.businessFlag.rtOrganization,
                            _this.GLOBAL.config.handleType.updateAll,
                            _this.FUNCTIONS.systemFunction.removeNullFields(params),
                            null,
                            resultData => {
                                _this.loading = false
                                if (resultData) {
                                    _this.$message.success('修改成功～')
                                    _this.showFlag = false
                                    _this.getTreeData()
                                    _this.$refs.zxUser.init(resultData.code)
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
            // 单条数据删除
            handleDelete: function () {
                if (this.formData.children && this.formData.children.length) {
                    this.$message.warning('请先删除子部门数据')
                    return
                }
                let _this = this
                _this.$confirm('确认删除当前部门数据？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.loading = true
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.rtOrganization,
                        _this.GLOBAL.config.handleType.deleteLogical,
                        _this.formData.id,
                        null,
                        resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$message.success('删除成功～')
                                _this.getTreeData()
                            } else {
                                _this.$message.warning('删除失败～')
                            }
                        },
                        () => {
                            _this.loading = false
                        }
                    )
                })
            }
        }
    }
</script>
