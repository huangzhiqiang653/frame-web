<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
    <!--查询区域-->
    <el-row>
      <el-container>
        <el-aside width="30%" class="tree-area">
          <el-divider>已授权</el-divider>
          <el-tree
            ref="accountList"
            :data="treeData"
            node-key="id"
            :props="defaultProps">
              <span class="custom-tree-node" slot-scope="{node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => deleteAccountNode(node, data)">
                    删除
                  </el-button>
                </span>
              </span>
          </el-tree>
        </el-aside>
        <el-main width="80%">
          <el-divider>待授权</el-divider>
          <el-row class="margin-top-10">
            <el-col :span="4" class="margin-top-10">
              <label class="search-label">
                账号名:
              </label>
            </el-col>
            <el-col :span="6" class="margin-top-10">
              <el-input v-model="searchForm.accountName"
                        :size="GLOBAL.config.systemSize"
                        placeholder="账号名"
                        maxlength="32"></el-input>
            </el-col>
            <el-col :span="3" class="margin-top-10">
              <label class="search-label">
                状态:
              </label>
            </el-col>
            <el-col :span="6" class="margin-top-10">
              <el-select v-model="searchForm.status"
                         :size="GLOBAL.config.systemSize"
                         placeholder="账号状态"
                         style="width: 100%;"
              >
                <el-option label="--请选择--" value=""></el-option>
                <el-option :label="item.name" :value="item.code"
                           v-for="item in dictionary.accountStatus"
                           :key="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5" class="margin-top-10">
              <el-button type="primary" @click="doSearch" :size="GLOBAL.config.systemSize" icon="el-icon-search">查询
              </el-button>
            </el-col>
          </el-row>
          <el-table style="width: 100%"
                    :data="tableData"
                    element-loading-text="数据处理中...请稍等..."
                    v-loading="loading">
            <!--账户名称-->
            <el-table-column prop="accountName" label="账户名称" align="center"/>
            <!--所属用户-->
            <el-table-column prop="userId" label="所属用户" align="center">
              <template slot-scope="scope">
                {{scope.row.userId?scope.row.userId.split(',')[1]:'--'}}
              </template>
            </el-table-column>
            <!--账号状态 0启用(默认)，1禁用-->
            <el-table-column prop="status"
                             label="账号状态" align="center">
              <template slot-scope="scope">
                {{
                FUNCTIONS.systemFunction.getConfigValue(
                scope.row.status+'',
                GLOBAL.config.dictionaryPre + GLOBAL.config.dictionary.accountStatus)
                }}
              </template>
            </el-table-column>
            <el-table-column prop="scope" label="操作" align="center">
              <template slot-scope="scope">
                <el-button :id="scope.row.id" type="text"
                           :disabled="scope.row.isdisabled"
                           @click="appendAccountNode(scope.row, $event)">添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="currentChange"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :layout="pagination.layout"
            :total="pagination.total">
          </el-pagination>
        </el-main>
      </el-container>
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
        name: 'ZxRoleAuthAccountTableDialog',
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
                formData: {
                    roleId: '',
                    accountIds: []
                },
                // 查询表单
                searchForm: {
                    roleId: '',
                    accountName: '',
                    status: '0',
                    //授权标志：false 只查询未授权，true 只查询已授权
                    authFlag: 'false'
                },
                defaultProps: {
                    children: 'children',
                    label: 'accountName'
                },
                tableData: [],
                // 校验规则
                formRules: {},
                // 字典数据
                dictionary: {
                    accountStatus: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.accountStatus)))
                },
                // 分页参数
                pagination: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'prev, pager, next',
                    total: 0,
                    currentPage: 1
                },
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {},
                loading: false,
                editableFlag: true,
                showTitle: '账户授权',
                showFlag: false
            }
        },
        components: {},
        methods: {
            init: function (type, id) {
                let _title = ''
                if (type === 'auth') {
                    _title = '账户授权'
                } else if (type === 'view') {
                    _title = '查看'
                    this.editableFlag = false
                }

                this.showTitle = _title || this.showTitle
                this.showFlag = true
                this.formData.roleId = id
                this.searchForm.roleId = id
                this.getTableData('init')
                this.getAuthCountTree();
            },
            doSearch: function () {
                this.getTableData('init')
            },
            // 获取列表
            getTableData: function (initPageFlag) {
                this.loading = true
                let _this = this, searchParams = this.searchForm
                _this.FUNCTIONS.systemFunction.removeNullFields(searchParams)
                let paginationData = _this.FUNCTIONS.systemFunction.paginationSet(
                    initPageFlag ? 1 : _this.pagination.currentPage,
                    initPageFlag ? 10 : _this.pagination.pageSize,
                    searchParams)
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxAccount,
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
                            resultData.records.forEach(item => {
                                item.isdisabled = false
                            })
                            _this.tableData = resultData.records
                        } else {
                            _this.$message.warning('获取列表数据失败～')
                        }
                    },
                    () => {
                        _this.loading = false
                    }
                )
            },      // 复选框选择事件
            //获取已设置角色列表
            getAuthCountTree: function () {
                this.loading = true
                let _this = this
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxAccount,
                    _this.GLOBAL.config.handleType.listAccountByRole,
                    this.formData.roleId,
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            _this.treeData = resultData
                        } else {
                            _this.$message.warning('获取数据失败～')
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
            closeDialog: function () {
                this.showFlag = false
            },
            // 列表树删除节点
            deleteAccountNode: function (node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1)
                this.tableData.forEach(item => {
                    if (item.id === data.id) {
                        item.isdisabled = false
                    }
                })
            },
            // 项列表树追加节点
            appendAccountNode: function (rowData, event) {
                let _this = this
                let i = _this.treeData.findIndex(d => d.id === rowData.id)
                if (i < 0) {
                    _this.treeData.push(rowData)
                }
                _this.tableData.forEach(item => {
                    if (item.id === rowData.id) {
                        item.isdisabled = true
                    }
                })
            },
            saveOrUpdateForm: function () {
                if (!this.formData.roleId) {
                    this.$message.warning('请先选择角色～')
                    return
                }
                // 参数处理======start==========
                let _this = this
                let accountIds = []
                this.treeData.forEach(item => {
                    accountIds.push(item.id)
                })
                _this.formData.accountIds = accountIds
                // 参数处理======end============
                _this.loading = true
                let params = this.formData
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxRelationAccountRole,
                    _this.GLOBAL.config.handleType.addRoleAccountsRelation,
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
