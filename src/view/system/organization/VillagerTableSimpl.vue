<template>
  <div>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          关键词:
        </label>
      </el-col>
      <el-col :span="8" class="margin-top-10">
        <el-input v-model="searchForm.keyWords"
                  :size="GLOBAL.config.systemSize"
                  placeholder="关键词(姓名/电话)"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-checkbox
          :size="GLOBAL.config.systemSize"
          @change="getTableData('init')"
          v-model="searchForm.childrenInclude">含子区域人员
        </el-checkbox>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-button type="primary" @click="doSearch" :size="GLOBAL.config.systemSize" icon="el-icon-search">查询
        </el-button>
      </el-col>
    </el-row>
    <el-table style="width: 100%"
              :data="tableData"
              element-loading-text="数据处理中...请稍等..."
              v-loading="loading">
      <!--姓名-->
      <el-table-column prop="userName" label="姓名" align="center" width="100"/>
      <!--性别 0女，1男，2未知(默认)-->
      <el-table-column prop="sex"
                       label="性别" align="center" width="50">
        <template slot-scope="scope">
          {{
          FUNCTIONS.systemFunction.getConfigValue(
          scope.row.sex.toString(),
          GLOBAL.config.dictionaryPre +
          GLOBAL.config.dictionary.sex)
          }}
        </template>
      </el-table-column>
      <!--所属机构-->
      <el-table-column prop="organizationId" label="所属机构" align="center">
        <template slot-scope="scope">
          {{scope.row.organizationId.split(',').slice(-1).join('')}}
        </template>
      </el-table-column>
      <!--邮箱-->
      <el-table-column prop="email" label="邮箱" align="center"/>
      <!--手机号码-->
      <el-table-column prop="phoneNumber" label="手机号码" align="center"/>
      <!--更新时间-->
      <el-table-column prop="updateTime"
                       label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime
          ?$moment(scope.row.updateTime
          ).format('YYYY-MM-DD HH:mm:ss'):'' }}
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
  </div>
</template>
<script>
    export default {
        name: 'ZxUserTableSimple',
        data () {
            return {
                // 查询表单
                searchForm: {
                    childrenInclude: false,
                    organizationId: '',
                    keyWords: ''
                },
                tableData: [],
                // 字典数据
                dictionary: {
                    sex: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.sex))),
                    userStatus: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.userStatus)))
                },
                // 分页参数
                pagination: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
                deleteBatchList: {
                    ids: [],
                    deleteFlag: false
                },
                loading: false
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init: function (orgId) {
                if (orgId) {
                    this.searchForm.organizationId = orgId
                    this.getTableData('init')
                } else {
                    this.tableData = []
                    this.pagination = {
                        pageSizeList: [10, 20, 30, 40, 50],
                        pageSize: 10,
                        layout: 'total, sizes, prev, pager, next, jumper',
                        total: 0,
                        currentPage: 1
                    }
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
            }
        }
    }
</script>
