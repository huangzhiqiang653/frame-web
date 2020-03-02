<!--zx_rts_db.t_rt_record_repair（报修记录表）-table-->
<!--参数添加，1、config.js business中添加：recordRepair: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：recordRepair: 'recordRepair'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>报修记录列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          分派状态:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-select v-model="searchForm.assignStatus"
                   :size="GLOBAL.config.systemSize"
                   placeholder="--请选择--"
                   style="width: 100%;"
        >
          <el-option :label="item.name" :value="item.code"
                     v-for="item in GLOBAL.config.dictionaryData.assignStatus"
                     :key="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          类型:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-select v-model="searchForm.type"
                   :size="GLOBAL.config.systemSize"
                   placeholder="--请选择--"
                   style="width: 100%;"
        >
          <el-option :label="item.name" :value="item.code"
                     v-for="item in GLOBAL.config.dictionaryData.applyType"
                     :key="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <el-button type="primary" @click="doSearch" :size="GLOBAL.config.systemSize" icon="el-icon-search">查询
        </el-button>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <el-button v-if="source.export"
                   type="primary"
                   icon="el-icon-download"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   @click="exportTableData">导出
        </el-button>
      </el-col>
    </el-row>
    <el-table style="width: 100%"
              :data="tableData"
              @selection-change="tableSelectionChange"
              element-loading-text="数据处理中...请稍等..."
              v-loading="loading">
      <el-table-column type="index" label="序号" align="center"/>
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          {{
          FUNCTIONS.systemFunction.getRtConfigValue(
          scope.row.type,
          GLOBAL.config.dictionaryData.applyType)
          }}
        </template>
      </el-table-column>
      <el-table-column prop="targetUserVillageCode" label="所属区划" align="center"/>
      <el-table-column prop="targetUserName" label="户主姓名" align="center"/>
      <el-table-column prop="targetUserPhoneNumber" label="手机号码" align="center"/>
      <el-table-column prop="reportTime" label="接收时间" width="200px" align="center"/>
      <el-table-column prop="assignStatus" label="状态" align="center">
        <template slot-scope="scope">
          {{
          FUNCTIONS.systemFunction.getRtConfigValue(
          scope.row.assiganStatus,
          GLOBAL.config.dictionaryData.assignStatus)
          }}
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
    <workApplyAssign ref="workApplyAssign" :refresh="getTableData"/>
    <workApplyCarAssign ref="workApplyCarAssign" :refresh="getTableData"/>
  </div>
</template>
<script>
    // 替换成相应的模板
    import workApplyAssign from './WorkApplyAssign'
    import workApplyCarAssign from './workApplyCarAssign'

    export default {
        name: 'RecordRepairTable',
        data() {
            return {
                // 查询表单
                searchForm: {
                    assignStatus: '',
                    type: ''
                },
                tableData: [],
                // 字典数据
                dictionary: {},
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    export: true,
                    infoView: true,
                    infoSubmit: true
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
                loading: false
            }
        },
        components: {
            workApplyAssign,
            workApplyCarAssign
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
            operationMethod: function (info) {
                if (info.type === 0) {//报修
                    this.$refs.workApplyAssign.init(info)
                } else if (info.type === 1) {//报抽
                    this.$refs.workApplyCarAssign.init(info)
                }
            },
            getSource: function (rowData) {
                let tempList = []
                this.source.infoView && tempList.push({icon: 'el-icon-view', title: '查看', method: 'handleView'})
                if (rowData.assignStatus !== 'finish') {
                    this.source.infoSubmit && tempList.push({icon: 'el-icon-bell', title: '分派', method: 'handleSubmit'})
                }
                return tempList
            },
            handleCommon: function (type, rowData) {
                switch (type) {
                    case 'handleView':
                        this.handleView(rowData)
                        break
                    case 'handleSubmit':
                        this.handleSubmit(rowData)
                        break
                }
            },
            // 查看
            handleView: function (rowData) {
                this.$router.push({
                    name: 'WorkApplyOperateDialog',
                    query: {
                        type: 'view',
                        data: rowData
                    }
                })
            },
            // 分派
            handleSubmit: function (rowData) {
                this.operationMethod(rowData)
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
                    _this.GLOBAL.config.businessFlag.rtRepair,
                    _this.GLOBAL.config.handleType.getMyPage,
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
                                if (item.type == 0) {
                                    if (item.operationUserId) {
                                        item.assiganStatus = 'assigned'
                                    } else {
                                        item.assiganStatus = 'unassigned'
                                    }
                                } else if (item.type == 1) {
                                    if (item.pumpCarId) {
                                        item.assiganStatus = 'assigned'
                                    } else {
                                        item.assiganStatus = 'unassigned'
                                    }
                                }

                                if (item.finishTime) {
                                    item.assiganStatus = 'finish'
                                }

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
            // 列表数据导出
            exportTableData: function () {
                let _this = this, searchParams = this.searchForm
                _this.FUNCTIONS.systemFunction.removeNullFields(searchParams)
                this.FUNCTIONS.systemFunction.postDownFile(this, {
                    type: 'litigationCasesServiceImpl.downFile',
                    info: searchParams
                })
            },
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
            }
        }
    }
</script>
