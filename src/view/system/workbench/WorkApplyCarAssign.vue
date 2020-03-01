<!--zx_rts_db.t_rt_config（配置表）-dialog-->
<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
    <el-table style="width: 100%"
              :data="tableData"
              element-loading-text="数据处理中...请稍等..."
              v-loading="loading">
      <!--序号-->
      <el-table-column type="index" label="序号" align="center"/>
      <!--账户名称-->
      <el-table-column prop="carNo" label="车牌号" align="center"/>
      <!--待报修处理/件-->
      <el-table-column prop="notPumpNum" label="待报抽处理/件" align="center"/>
      <!-- 操作-->
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button :id="scope.row.id" v-if="!scope.row.isdisabled" type="text" @click="assignUser(scope.row)">分派给他
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
    </el-row>
  </el-dialog>
</template>
<script>
    export default {
        name: 'workApplyCarAssign',
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
                    villageCode: '',
                    townCode: ''
                },
                formData: {
                    id: '',
                    pumpCarId: ''
                },
                tableData: [],
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {},
                // 分页参数
                pagination: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
                showTitle: '报抽信息分派',
                showFlag: false,
                loading: false
            }
        },
        methods: {
            init: function (rowData) {
                this.showFlag = true
                if (rowData) {
                    this.searchForm.villageCode = rowData.targetUserVillageCode
                    this.searchForm.townCode = rowData.targetUserTownCode
                    this.formData.id = rowData.id
                    this.getTableData('init')
                }
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
                    _this.GLOBAL.config.businessFlag.rtCar,
                    _this.GLOBAL.config.handleType.tellPumpPage,
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
            //分派任务
            assignUser: function (rowData) {
                // 参数处理======start==========
                let _this = this
                _this.formData.pumpCarId = rowData.id
                // 参数处理======end============
                _this.$confirm('确认分派给当前车辆？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.loading = true
                    let params = _this.formData
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.rtPump,
                        _this.GLOBAL.config.handleType.updateAll,
                        params,
                        null,
                        resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$message.success('分派成功～')
                                _this.showFlag = false
                                _this.$props.refresh && this.$props.refresh('init')
                            } else {
                                _this.$message.warning('分派失败～')
                            }
                        }
                    )
                })
            },
            closeDialog: function () {
                this.showFlag = false
            },
        }
    }
</script>
