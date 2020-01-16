<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
    <el-row class="margin-top-20" style="margin-top: 0px">
      <div class="tree-area-dialog">
        <el-tree
          style="margin: 0px"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :size="GLOBAL.config.systemSize"
          :show-checkbox=true
          node-key="id"
          ref="menuList"
          accordion
          @node-click="handleNodeClick">
        </el-tree>
      </div>
    </el-row>
    <el-row class="margin-top-20">
      <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
      <el-button type="primary" @click="saveOrUpdateForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存
      </el-button>
    </el-row>
  </el-dialog>
</template>
<script>
    // 替换成相应的模板
    export default {
        name: 'ZxRoleAuthDialog',
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
                treeData: [],
                roleMenuRelations: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                formData: {
                    roleId: '',
                    menuIds: [],
                    menuResourceIds: ''
                },
                // 校验规则
                formRules: {},
                // 字典数据
                dictionary: {},
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    add: true,
                    infoEdit: true
                },
                loading: false,
                editableFlag: true,
                showTitle: '授权',
                showFlag: false
            }
        },
        components: {},
        methods: {
            init: function (type, id) {
                let _title = ''
                if (type === 'auth') {
                    _title = '授权'
                } else if (type === 'view') {
                    _title = '查看'
                    this.editableFlag = false
                }

                this.showTitle = _title || this.showTitle
                this.showFlag = true
                this.formData.roleId = id
                this.getTreeData()
                this.getRelationRoleMenu()
            },
            // 组织树数据
            getTreeData: function () {
                this.loading = true
                let _this = this
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxMenu,
                    _this.GLOBAL.config.handleType.getTree,
                    {'showResource': true},
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            _this.treeData = resultData
                        } else {
                            _this.$message.warning('获取菜单数据失败～')
                        }
                    },
                    () => {
                        _this.loading = false
                    }
                )
            },
            getRelationRoleMenu: function (role) {
                this.$refs.menuList.setCheckedKeys([])
                let _this = this
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxRole,
                    _this.GLOBAL.config.handleType.getAuthMenu,
                    {'id': _this.formData.roleId},
                    null,
                    resultData => {
                        if (resultData) {
                            let menuIds = resultData.menuIds
                            if (menuIds) {
                                let checkedKeys = []
                                let menuResourceIds = resultData.menuResourceIds
                                if (menuResourceIds) {
                                    menuIds.forEach((item) => {
                                         let resourceIds = menuResourceIds[item]
                                        if (resourceIds) {
                                            checkedKeys = checkedKeys.concat(resourceIds)
                                        } else {
                                            checkedKeys = checkedKeys.concat(item)
                                        }
                                    })
                                }else{
                                    checkedKeys = checkedKeys.concat(menuIds)
                                }
                                this.$refs.menuList.setCheckedKeys(checkedKeys)
                            }
                        } else {
                            _this.$message.warning('获取菜单数据失败～')
                        }
                    },
                    () => {
                    }
                )
            },
            handleNodeClick: function (target, node) {

            },
            closeDialog: function () {
                this.showFlag = false
            },
            saveOrUpdateForm: function () {
                if (!this.formData.roleId) {
                    this.$message.warning('请重新选择角色～')
                    return
                }
                let checkedMenusNode = this.$refs.menuList.getCheckedNodes(true)
                if (!checkedMenusNode) {
                    this.$message.warning('请勾选菜单～')
                    return
                }
                let checkedMenus = new Set()
                const menuResourceMap = {}
                checkedMenusNode.forEach(item => {
                    if (item.isResource) {
                        let menuId = item.relationId
                        checkedMenus.add(menuId)
                        let resourceId = item.id
                        if (resourceId) {
                            let resourceIds = menuResourceMap[menuId]
                            if (!resourceIds) {
                                resourceIds = []
                                menuResourceMap[menuId] = resourceIds
                            }

                            resourceIds.push(resourceId)
                        }
                    } else {
                        checkedMenus.add(item.id)
                    }
                })
                this.formData.menuIds = checkedMenus
                this.formData.menuResourceIds = menuResourceMap
                // 参数处理======start==========
                // TODO 对于单选、复选、多选、附件等需要进行单独处理
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
