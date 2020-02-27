<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
    <el-table style="width: 100%"
              :data="tableData"
              element-loading-text="数据处理中...请稍等..."
              v-loading="loading">
      <!--序号-->
      <el-table-column prop="index" label="序号" align="center"/>
      <!--账户名称-->
      <el-table-column prop="name" label="姓名" align="center"/>
      <!--所属用户-->
      <el-table-column prop="orgName" label="区划" align="center"/>
      <el-table-column prop="phoneNumber" label="手机号码" align="center"/>
      <el-table-column
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button :id="scope.row.id" v-if="!scope.row.isdisabled" type="text" @click="selectUser(scope.row)">选择
          </el-button>
          <el-button :id="scope.row.id" v-if="scope.row.isdisabled" type="text" @click="unSelectUser(scope.row)">取消
          </el-button>
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

    <el-row class="margin-top-20">
      <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
      <el-button type="primary" @click="saveForm" style="margin: 0 20px;"
                 :size="GLOBAL.config.systemSize">保存
      </el-button>
    </el-row>
  </el-dialog>
</template>
<script>
    export default {
        name: 'VillagerSimpleTableDialog',
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
                searchForm: {
                    userType: '',
                    remark: ''
                },
                formData: {
                    carNo: '',
                    ids: []
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
                showTitle: '选择人员',
                showFlag: false,
                loading: false
            }
        },
        components: {},
        mounted() {
        },
        methods: {
            init: function (carNo, userType, includeFlag) {
                let _this = this
                _this.showFlag = true
                if (carNo) {
                    _this.formData.carNo = carNo
                    _this.getTableData('init')
                }
                //用户类型
                if (userType) {
                    _this.searchForm.userType = userType
                }
                //是否查询当前用户类型用户的标识：false 查询除当前用户类型外的所有用户
                if (!includeFlag) {
                    _this.searchForm.remark = 'notListRole'
                }
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
                    _this.GLOBAL.config.businessFlag.rtUser,
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
                                item.orgName = _this.FUNCTIONS.systemFunction.getAreaName(_this, item.villageCode)
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
            //选择人员
            selectUser: function (rowData) {
                let _this = this
                _this.tableData.forEach(item => {
                    if (item.id === rowData.id) {
                        item.isdisabled = true
                    }
                })

                _this.formData.ids.push(rowData.id)
            },
            //取消选择人员
            unSelectUser: function (rowData) {
                let _this = this
                _this.tableData.forEach(item => {
                    if (item.id === rowData.id) {
                        item.isdisabled = false
                    }
                })
                //去除已选择人员id
                _this.formData.ids.some((item, i) => {
                    if (item === rowData.id) {
                        _this.formData.ids.splice(i, 1)
                        return true
                    }
                })
            },
            closeDialog: function () {
                this.showFlag = false
            },
            //保存
            saveForm: function () {
                if (!this.formData.carNo) {
                    this.$message.warning('请先选择车辆～')
                    return
                }
                // 参数处理======start==========
                let _this = this
                // 参数处理======end============
                _this.loading = true
                let params = _this.formData
                params.ids = params.ids.join(',')
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtUser,
                    _this.GLOBAL.config.handleType.updateBatchPersonnel,
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
