<!--zx_frame_db.auth_zx_user（用户表）-table-->
<!--参数添加，1、config.js business中添加：zxUser: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：zxUser: 'zxUser'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          姓名:
        </label>
      </el-col>
      <el-col :span="5" class="margin-top-10">
        <el-input v-model="searchForm.userName"
                  :size="GLOBAL.config.systemSize"
                  placeholder="姓名"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          出生年月日:
        </label>
      </el-col>
      <el-col :span="8" class="margin-top-10">
        <el-date-picker
          v-model="searchForm.birthDay"
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
          邮箱:
        </label>
      </el-col>
      <el-col :span="5" class="margin-top-10">
        <el-input v-model="searchForm.email"
                  :size="GLOBAL.config.systemSize"
                  placeholder="邮箱"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          手机号码:
        </label>
      </el-col>
      <el-col :span="5" class="margin-top-10">
        <el-input v-model="searchForm.phoneNumber"
                  :size="GLOBAL.config.systemSize"
                  placeholder="手机号码"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          更新时间:
        </label>
      </el-col>
      <el-col :span="8" class="margin-top-10">
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
        <label class="search-label">
          用户状态:
        </label>
      </el-col>
      <el-col :span="3" class="margin-top-10">
        <el-select v-model="searchForm.status"
                   :size="GLOBAL.config.systemSize"
                   placeholder="用户状态"
                   style="width: 100%;"
        >
          <el-option label="--请选择--" value=""></el-option>
          <el-option :label="item.name" :value="item.code"
                     v-for="item in dictionary.status"
                     :key="item.id"></el-option>
        </el-select>
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
      <!--姓名-->
      <el-table-column prop="userName" label="姓名" align="center"/>
      <!--出生年月日-->
      <el-table-column prop="birthDay"
                       label="出生年月日">
        <template slot-scope="scope">
          {{ scope.row.birthDay
          ?$moment(scope.row.birthDay
          ).format('yyyy-MM-dd'):'' }}
        </template>
      </el-table-column>
      <!--头像地址-->
      <el-table-column prop="headUrl" label="头像地址" align="center"/>
      <!--邮箱-->
      <el-table-column prop="email" label="邮箱" align="center"/>
      <!--手机号码-->
      <el-table-column prop="phoneNumber" label="手机号码" align="center"/>
      <!--用户状态 0启用(默认)，1禁用-->
      <el-table-column prop="status"
                       label="用户状态" align="center">
        <template slot-scope="scope">
          {{
          FUNCTIONS.systemFunction.getConfigValue(
          scope.row.status,
          GLOBAL.config.dictionaryPre +
          GLOBAL.config.dictionary.用户状态)
          }}
        </template>
      </el-table-column>
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
    <el-dialog
      :fullscreen="true"
      :show-close="false"
      :visible.sync="operationVisibleFlag"
      :destroy-on-close="true">
      <operationTemplate
        ref="operationTemplate"
        :refresh="init"
        :close-self="()=> operationVisibleFlag = false"
      />
    </el-dialog>
  </div>
</template>
<script>
  // 替换成相应的模板
  import operationTemplate from './ZxUserTable'

  export default {
    name: 'zxUser',
    data () {
      return {
        // 查询表单
        searchForm: {
          userName: '',
          birthDay: '',
          email: '',
          phoneNumber: '',
          status: '',
          updateTime: ''
        },
        tableData: [],
        // 字典数据
        dictionary: {
          status:
            JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.status))),
        },
        // 资源权限控制，有的系统不需这么细，则全部为true
        source: {
          deleteBatch: true,
          add: true,
          import: true,
          export: true,
          infoEdit: true,
          infoView: true,
          infoDelete: true,
          infoApproval: true,
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
        deleteBatchList: {
          ids: [],
          deleteFlag: false
        },
        loading: false
      }
    },
    components: {
      operationTemplate
    },
    mounted () {
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
        this.operationVisibleFlag = true
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
        return [
          this.source.infoEdit && tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'}),
          this.source.infoView && tempList.push({icon: 'el-icon-view', title: '查看', method: 'handleView'}),
          this.source.infoDelete && tempList.push({icon: 'el-icon-delete', title: '删除', method: 'handleDelete'}),
        ]
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
      }
    }
  }
</script>
