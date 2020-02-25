<!--zx_rts_db.t_rt_cars（车辆表）-table-->
<!--参数添加，1、config.js business中添加：cars: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：cars: 'cars'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>车辆列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          当值司机:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.dutyUserId"
                  :size="GLOBAL.config.systemSize"
                  placeholder="当值司机"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          所属乡镇编码:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.townCode"
                  :size="GLOBAL.config.systemSize"
                  placeholder="所属乡镇编码"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          所属村居编码:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.villageCode"
                  :size="GLOBAL.config.systemSize"
                  placeholder="所属村居编码"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          车牌号:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.carNo"
                  :size="GLOBAL.config.systemSize"
                  placeholder="车牌号"
                  maxlength="32"></el-input>
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
        <el-button v-if="source.export"
                   type="primary"
                   icon="el-icon-download"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   @click="exportTableData">导出
        </el-button>
        <el-button v-if="source.import"
                   type="primary"
                   icon="el-icon-download"
                   :size="GLOBAL.config.systemSize"
                   style="float: left;"
                   @click="importTableData">导入
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
      <!--当值司机-->
      <el-table-column prop="dutyUserId" label="当值司机" align="center"/>
      <!--所属乡镇编码-->
      <el-table-column prop="townCode" label="所属乡镇编码" align="center"/>
      <!--所属村居编码-->
      <el-table-column prop="villageCode" label="所属村居编码" align="center"/>
      <!--车牌号-->
      <el-table-column prop="carNo" label="车牌号" align="center"/>
      <!--更新时间-->
      <el-table-column prop="updateTime"
                       label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime
          ?$moment(scope.row.updateTime
          ).format('yyyy-MM-dd HH:mm:ss'):'' }}
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
    <!--查看-->
    <el-dialog
      :fullscreen="true"
      :show-close="false"
      :visible.sync="viewVisibleFlag"
      :destroy-on-close="true"
    >
      <operationEdit
        ref="operationEdit"
        :refresh="init"
        :close-self="()=> viewVisibleFlag = false"
      />
    </el-dialog>
  </div>
</template>
<script>
    // 替换成相应的模板
    import operationTemplate from './CarsOperateDialog'
    import operationEdit from './CarsInfo'

    export default {
        name: 'CarsTable',
        data() {
            return {
                // 查询表单
                searchForm: {
                    dutyUserId: '',
                    townCode: '',
                    villageCode: '',
                    carNo: '',
                    updateTime: '',
                },
                tableData: [{
                    index: '1',
                    dutyUserId: '张三',
                    townCode: '桃花镇',
                    villageCode: '古城村',
                    carNo: 'N123456'
                }],
                // 字典数据
                dictionary: {},
                // 资源权限控制，有的系统不需这么细，则全部为true
                source: {
                    add: true,
                    deleteBatch: true,
                    export: true,
                    import: true,
                    infoView: true,
                    infoEdit: true,
                    infoDelete: true,
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
                viewVisibleFlag: false,
            }
        },
        components: {
            operationTemplate,
            operationEdit
        },
        mounted() {
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
                        _this.GLOBAL.config.businessFlag.cars,
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
                this.source.infoView && tempList.push({icon: 'el-icon-view', title: '查看', method: 'handleView'})
                this.source.infoEdit && tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'})
                this.source.infoDelete && tempList.push({icon: 'el-icon-delete', title: '删除', method: 'handleDelete'})
                return tempList
            },
            handleCommon: function (type, rowData) {
                switch (type) {
                    case 'handleView':
                        this.handleView(rowData)
                        break
                    case 'handleEdit':
                        this.handleEdit(rowData)
                        break
                    case 'handleDelete':
                        this.handleDelete(rowData)
                        break
                }
            },
            // 查看
            handleView: function (rowData) {
                this.$router.push({
                    name: 'CarsInfo',
                    params: {
                        type: 'view',
                        id: '12345'
                    }
                })
            },
            // 编辑
            handleEdit: function (rowData) {
                this.$router.push({
                    name: 'CarsInfo',
                    params: {
                        type: 'edit',
                        id: '12345'
                    }
                })
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
                        _this.GLOBAL.config.businessFlag.cars,
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
                    _this.GLOBAL.config.businessFlag.cars,
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
            // 列表数据导出
            exportTableData: function () {
                let _this = this, searchParams = this.searchForm
                _this.FUNCTIONS.systemFunction.removeNullFields(searchParams)
                this.FUNCTIONS.systemFunction.postDownFile(this, {
                    type: 'litigationCasesServiceImpl.downFile',
                    info: searchParams
                })
            },
            importTableData: function () {
                // TODO
            }
        }
    }
</script>
