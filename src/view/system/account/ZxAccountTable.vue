<!--zx_frame_db.auth_zx_account（账户表）-table-->
<!--参数添加，1、config.js business中添加：zxAccount: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：zxAccount: 'zxAccount'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>账户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          账户名称:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.accountName"
                  :size="GLOBAL.config.systemSize"
                  placeholder="账户名称"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          账号状态:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
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
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          更新时间:
        </label>
      </el-col>
      <el-col :span="6" class="margin-top-10">
        <el-date-picker
          v-model="searchForm.updateTime"
          :size="GLOBAL.config.systemSize"
          type="daterange"
          align="right"
          unlink-panels
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始"
          end-placeholder="结束"
          style="width: 100%;">
        </el-date-picker>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <el-button type="primary" @click="doSearch" :size="GLOBAL.config.systemSize" icon="el-icon-search">查询
        </el-button>
      </el-col>
    </el-row>
    <el-row class="margin-top-20">
      <el-col :span="24">
        <el-button v-if="source.add"
                   type="primary"
                   icon="el-icon-plus"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   @click="operationMethod('add')">新增
        </el-button>
        <el-button v-if="source.deleteBatch"
                   type="danger"
                   icon="el-icon-delete"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   :disabled="deleteBatchList.ids.length === 0"
                   @click="deleteBatch">批量删除
        </el-button>
      </el-col>
    </el-row>
    <el-table style="width: 100%"
              :data="tableData"
              @selection-change="tableSelectionChange"
              element-loading-text="数据处理中...请稍等..."
              v-loading="loading">
      <el-table-column
        type="selection">
      </el-table-column>
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
          <el-switch
            @change="inActiveUse(scope.row)"
            v-model="scope.row.status + '' "
            :active-value="dictionary.accountStatus[0]?dictionary.accountStatus[0].code:''"
            :inactive-value="dictionary.accountStatus[1]?dictionary.accountStatus[1].code:''"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </template>
      </el-table-column>
      <!--更新时间-->
      <el-table-column prop="updateTime"
                       label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime
          ?$moment(scope.row.updateTime
          ).format('YYYY-MM-DD HH:mm:ss'):'' }}
        </template>
      </el-table-column>
      <el-table-column prop="scope" label="操作" align="center">
        <template slot-scope="scope">
          <el-dropdown>
                <span class="el-dropdown-link operator-text">
                  选择操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :icon="item.icon" v-for="item in getSource(scope.row)"
                                :key="item.method"
                                @click.native="handleCommon(item.method, scope.row)">
                {{item.title}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="margin-top-10 margin-bottom-20"
      @size-change="tableSizeChange"
      @current-change="currentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.pageSizeList"
      :page-size="pagination.pageSize"
      :layout="pagination.layout"
      :total="pagination.total">
    </el-pagination>
    <!--操作-->
    <operationTemplate ref="operationTemplate" :refresh="getTableData"/>
    <!--查看明细-->
    <viewAllTemplate ref="viewAllTemplate"/>
    <!--设置角色-->
    <roleTemplate ref="roleTemplate"/>
  </div>
</template>
<script>
    // 替换成相应的模板
    import operationTemplate from './ZxAccountOperateDialog'
    import viewAllTemplate from './ZxAccountAllView'
    import roleTemplate from '../role/ZxAccountAuthRoleTableDialog'

    export default {
        name: 'ZxAccountTable',
        data() {
            return {
                // 查询表单
                searchForm: {
                    accountName: '',
                    status: '',
                    userId: '',
                    updateTime: ''
                },
                tableData: [],
                // 字典数据
                dictionary: {
                    accountStatus: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.accountStatus)))
                },
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    add: true,
                    deleteBatch: true,
                    infoEdit: true,
                    infoView: true,
                    infoDelete: true,
                    resetPwd: true,
                    setRole: true
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
                loading: false
            }
        },
        components: {
            operationTemplate,
            viewAllTemplate,
            roleTemplate
        },
        mounted() {
            this.init()
        },
        methods: {
            init: function () {
                // TODO 加载列表数据
                this.getTableData('init')
            },
            doSearch: function () {
                this.getTableData('init')
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
                        _this.GLOBAL.config.businessFlag.zxAccount,
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
                this.source.resetPwd && tempList.push({
                    icon: 'el-icon-refresh-right',
                    title: '重置密码',
                    method: 'resetPwd'
                })
                this.source.infoEdit && tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'})
                this.source.infoView && tempList.push({icon: 'el-icon-view', title: '查看', method: 'handleView'})
                this.source.infoDelete && tempList.push({icon: 'el-icon-delete', title: '删除', method: 'handleDelete'})
                this.source.setRole && tempList.push({icon: 'el-icon-user', title: '设置角色', method: 'setRole'})
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
                    case 'resetPwd':
                        this.resetPwd(rowData)
                        break
                    case 'setRole':
                        this.setRole(rowData)
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
                this.$refs.viewAllTemplate.init(rowData)
            },
            // 重置密码
            resetPwd: function (rowData) {
                let _this = this
                _this.$confirm('确认初始化密码？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.loading = true
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.zxAccount,
                        _this.GLOBAL.config.handleType.initialAccountPwd,
                        rowData.id,
                        null,
                        resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$message.success('初始化密码成功～')
                                _this.getTableData('init')
                            } else {
                                _this.$message.warning('初始化密码失败～')
                            }
                        }
                    )
                })
            },
            // 设置角色
            setRole: function (rowData) {
                this.$refs.roleTemplate.init('auth', rowData.id)
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
                        _this.GLOBAL.config.businessFlag.zxAccount,
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
            // 禁用账号
            inActiveUse: function (rowData) {
                let _this = this
                !rowData.status ? this.$confirm('确定禁用该账号【' + rowData.accountName + '】吗?', '提示', {
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
                        _this.GLOBAL.config.businessFlag.zxAccount,
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
            }
        }
    }
</script>
