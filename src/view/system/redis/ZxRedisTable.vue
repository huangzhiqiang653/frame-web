<!--zx_frame_db.auth_zx_user（用户表）-table-->
<!--参数添加，1、config.js business中添加：zxUser: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：zxUser: 'zxUser'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>Redis缓存</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          Key:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.key"
                  :size="GLOBAL.config.systemSize"
                  placeholder="Key"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          Value:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.value"
                  :size="GLOBAL.config.systemSize"
                  placeholder="Value"
                  maxlength="32"></el-input>
      </el-col>
    </el-row>
    <el-row class="margin-top-20">
      <el-col :span="24">
        <el-button v-if="source.add"
                   type="primary"
                   icon="el-icon-plus"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   @click="addRedis">添加缓存
        </el-button>
        <el-button v-if="source.deleteBatch"
                   type="danger"
                   icon="el-icon-delete"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   :disabled="deleteBatchList.ids.length === 0"
                   @click="deleteBatch">删除缓存
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    export default {
        name: 'ZxRedisTable',
        data() {
            return {
                // 查询表单
                searchForm: {
                    key: '',
                    value: ''
                },
                tableData: [],
                // 字典数据
                dictionary: {
                    sex: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.sex))),
                    userStatus: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.userStatus))),
                    treeData: []
                },
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    add: true,
                    deleteBatch: true,
                    infoEdit: true,
                    infoView: true,
                    infoDelete: true
                },
                // 分页参数
                pagination: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
                operationVisibleFlag: false,
                deleteBatchList: {
                    ids: [],
                    deleteFlag: false
                },
                loading: false,
                defaultProps: {
                    checkStrictly: true,
                    label: 'shortName',
                    value: 'id',
                    children: 'children',
                    expandTrigger: 'hover'
                }
            }
        },
        components: {},
        mounted() {
        },
        methods: {
            init: function () {
                // TODO 加载列表数据
                this.getTableData('init')
            },
            doSearch: function () {
                this.getTableData('init')
            },
            addRedis: function () {
                let _this = this
                let paramsInfo = {
                    'type': '',
                    'info': _this.searchForm
                }
                _this.FUNCTIONS.systemFunction.jsonPost(
                    _this.CONFIG.urls.root + '/redis/set',
                    paramsInfo,
                    resultData => {
                        if (resultData.code === '0') {
                            _this.$message.success('操作成功～')
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '操作失败～',
                                type: 'warning'
                            })
                        }
                    },
                    () => {
                        _this.$message({
                            showClose: true,
                            message: '请求异常，请联系管理员～',
                            type: 'error'
                        })
                    }
                )
            },
            operationMethod: function (operateType, info) {
                this.$refs.operationTemplate.init(operateType, info ? info.id : null)
            },
            deleteBatch: function () {
                let _this = this
                _this.$confirm('确认删除当前选择' +
                    '的' + _this.deleteBatchList.ids.length + '条数据？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.loading = true
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxUser,
                        _this.GLOBAL.config.handleType.deleteLogicalBatch,
                        _this.deleteBatchList.ids,
                        'list',
                        resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$message.success('删除成功～')
                                _this.getTableData('init')
                            } else {
                                _this.$message.warning('删除失败～')
                            }
                        }
                    )
                })
            },
            getSource: function (rowData) {
                let tempList = []
                this.source.infoEdit && tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'})
                this.source.infoView && tempList.push({icon: 'el-icon-view', title: '查看', method: 'handleView'})
                this.source.infoDelete && tempList.push({icon: 'el-icon-delete', title: '删除', method: 'handleDelete'})
                return tempList
            },
            handleCommon: function (type, rowData) {
                switch (type) {
                    case 'handleEdit':
                        this.handleEdit(rowData)
                        break
                    case 'handleView':
                        this.handleView(rowData)
                        break
                    case 'handleDelete':
                        this.handleDelete(rowData)
                        break
                }
            },
            // 编辑
            handleEdit: function (rowData) {
                this.operationMethod('edit', rowData)
                // TODO
            },
            // 查看
            handleView: function (rowData) {
                this.operationMethod('view', rowData)
                // TODO
            },
            // 单条数据删除
            handleDelete: function (rowData) {
                let _this = this
                _this.$confirm('确认删除当前数据？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.loading = true
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxUser,
                        _this.GLOBAL.config.handleType.deleteLogical,
                        rowData.id,
                        null,
                        resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$message.success('删除成功～')
                                _this.getTableData('init')
                            } else {
                                _this.$message.warning('删除失败～')
                            }
                        }
                    )
                })
            },
            // 获取列表
            getTableData: function (initPageFlag) {
                this.loading = true
                let _this = this, searchParams = {},
                    orgs = this.$refs.orgList.getCheckedNodes(), selectOrgName = ''
                Object.assign(searchParams, this.searchForm)
                if (orgs && orgs.length && (orgs.length === 1)) {
                    selectOrgName = orgs[0].label
                }
                // 部门查询处理
                if (searchParams.organizationId) {
                    searchParams.organizationId = searchParams.organizationId.join(',')
                    if (selectOrgName) {
                        searchParams.organizationId = searchParams.organizationId + ',' + selectOrgName
                    }
                }
                _this.FUNCTIONS.systemFunction.removeNullFields(searchParams)
                let paginationData = _this.FUNCTIONS.systemFunction.paginationSet(
                    initPageFlag ? 1 : _this.pagination.currentPage,
                    initPageFlag ? 10 : _this.pagination.pageSize,
                    searchParams)
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxUser,
                    _this.GLOBAL.config.handleType.getPage,
                    paginationData,
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            // 结果参数赋值
                            _this.pagination.pageSize = resultData.size
                            _this.pagination.total = resultData.total
                            _this.pagination.currentPage = resultData.current
                            _this.tableData = resultData.records
                        } else {
                            _this.$message.warning('获取列表数据失败～')
                        }
                    },
                    () => {
                        _this.loading = false
                    }
                )
            },
            // 分页方法
            tableSizeChange: function (pageSize) {
                this.pagination.pageSize = pageSize
                this.getTableData()
            },
            currentChange: function (current) {
                this.pagination.currentPage = current
                this.getTableData()
            },
            // 复选框选择事件
            tableSelectionChange: function (targetList) {
                let ids = []
                targetList.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteBatchList.ids = ids
                if (this.deleteBatchList.ids &&
                    this.deleteBatchList.ids.length > 0) {
                    this.deleteBatchList.deleteFlag = true
                } else {
                    this.deleteBatchList.deleteFlag = false
                }
            },
            // 禁用用户
            inActiveUse: function (rowData) {
                let _this = this
                !rowData.status ? this.$confirm('确定禁用该用户【' + rowData.userName + '】吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    f()
                }) : f()

                function f() {
                    let params = {id: rowData.id, status: rowData.status ? 0 : 1}
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxUser,
                        _this.GLOBAL.config.handleType.updateAll,
                        params,
                        null,
                        resultData => {
                            if (resultData) {
                                _this.$message.success('操作成功～')
                                _this.showFlag = false
                                _this.getTableData('init')
                            } else {
                                _this.$message.warning('操作失败～')
                            }
                        })
                }
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
