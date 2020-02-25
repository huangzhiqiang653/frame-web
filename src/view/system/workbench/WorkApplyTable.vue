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
                    类型:
                </label>
            </el-col>
            <el-col :span="4" class="margin-top-10">
                <el-input v-model="searchForm.type"
                          :size="GLOBAL.config.systemSize"
                          placeholder="类型"
                          maxlength="32"></el-input>
            </el-col>
            <el-col :span="2" class="margin-top-10">
                <label class="search-label">
                    待修人主键:
                </label>
            </el-col>
            <el-col :span="4" class="margin-top-10">
                <el-input v-model="searchForm.targetUserId"
                          :size="GLOBAL.config.systemSize"
                          placeholder="待修人主键"
                          maxlength="32"></el-input>
            </el-col>
            <el-col :span="2" class="margin-top-10">
                <label class="search-label">
                    报修时间:
                </label>
            </el-col>
            <el-col :span="6" class="margin-top-10">
                <el-date-picker
                        v-model="searchForm.reportTime"
                        :size="GLOBAL.config.systemSize"
                        type="daterange"
                        align="right"
                        unlink-panels
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        style="width: 100%;">
                </el-date-picker>
            </el-col>
            <el-col :span="2" class="margin-top-10">
                <label class="search-label">
                    维修人主键:
                </label>
            </el-col>
            <el-col :span="4" class="margin-top-10">
                <el-input v-model="searchForm.operationUserId"
                          :size="GLOBAL.config.systemSize"
                          placeholder="维修人主键"
                          maxlength="32"></el-input>
            </el-col>
            <el-col :span="2" class="margin-top-10">
                <el-button type="primary" @click="doSearch" :size="GLOBAL.config.systemSize" icon="el-icon-search">查询
                </el-button>
            </el-col>
        </el-row>
        <el-row class="margin-top-20">
            <el-col :span="24">
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
            <!--类型 0报修，1报抽-->
            <el-table-column prop="type" label="类型" align="center"/>
            <!--待修人主键-->
            <el-table-column prop="targetUserId" label="待修人主键" align="center"/>
            <!--报修时间-->
            <el-table-column prop="reportTime"
                             label="报修时间">
                <template slot-scope="scope">
                    {{ scope.row.reportTime
                    ?$moment(scope.row.reportTime
                    ).format('yyyy-MM-dd'):'' }}
                </template>
            </el-table-column>
            <!--维修人主键-->
            <el-table-column prop="operationUserId" label="维修人主键" align="center"/>
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
    </div>
</template>
<script>
    // 替换成相应的模板
    import operationTemplate from './WorkApplyOperateDialog'

    export default {
        name: 'RecordRepairTable',
        data () {
            return {
                // 查询表单
                searchForm: {
                    type: '',
                    targetUserId: '',
                    reportTime: '',
                    operationUserId: '',
                },
                tableData: [],
                // 字典数据
                dictionary: {
                },
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    export: true,
                    infoView: true,
                    infoSubmit: true,
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
            operationTemplate
        },
        mounted () {
            // this.init()
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
            getSource: function (rowData) {
                let tempList = []
                this.source.infoView && tempList.push({icon: 'el-icon-view', title: '查看', method: 'handleView'})
                this.source.infoSubmit && tempList.push({icon: 'el-icon-bell', title: '提交', method: 'handleSubmit'})
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
                this.operationMethod('view', rowData)
                // TODO
            },
            // 提交
            handleSubmit: function (rowData) {
                // TODO
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
                    _this.GLOBAL.config.businessFlag.recordRepair,
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
            // 列表数据导出
            exportTableData: function () {
                let _this = this, searchParams = this.searchForm
                _this.FUNCTIONS.systemFunction.removeNullFields(searchParams)
                this.FUNCTIONS.systemFunction.postDownFile(this, {
                    type: 'litigationCasesServiceImpl.downFile',
                    info: searchParams
                })
            },
        }
    }
</script>
