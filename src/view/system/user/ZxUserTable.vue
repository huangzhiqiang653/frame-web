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
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.userName"
                  :size="GLOBAL.config.systemSize"
                  placeholder="姓名"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          性别:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-select v-model="searchForm.sex"
                   :size="GLOBAL.config.systemSize"
                   placeholder="性别"
                   style="width: 100%;"
        >
          <el-option label="--请选择--" value=""></el-option>
          <el-option :label="item.name" :value="item.code"
                     v-for="item in dictionary.sex"
                     :key="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          邮箱:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
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
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.phoneNumber"
                  :size="GLOBAL.config.systemSize"
                  placeholder="手机号码"
                  maxlength="32"></el-input>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          用户状态:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-select v-model="searchForm.status"
                   :size="GLOBAL.config.systemSize"
                   placeholder="用户状态"
                   style="width: 100%;"
        >
          <el-option label="--请选择--" value=""></el-option>
          <el-option :label="item.name" :value="item.code"
                     v-for="item in dictionary.userStatus"
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
          type="datetimerange"
          align="right"
          unlink-panels
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始"
          end-placeholder="结束"
          style="width: 100%;">
        </el-date-picker>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          所属机构:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-cascader
          ref="orgList"
          v-model="searchForm.organizationId"
          style="width: 100%;"
          placeholder="所属机构"
          :options="dictionary.treeData"
          :props="defaultProps"
          :size="GLOBAL.config.systemSize"
          clearable></el-cascader>
      </el-col>
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          <el-checkbox
            :size="GLOBAL.config.systemSize"
            v-model="searchForm.childrenInclude">含子部门
          </el-checkbox>
        </label>
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
      <!--姓名-->
      <el-table-column prop="userName" label="姓名" align="center"/>
      <!--性别 0女，1男，2未知(默认)-->
      <el-table-column prop="sex"
                       label="性别" align="center">
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
      <!--用户状态 0启用(默认)，1禁用-->
      <el-table-column prop="status"
                       label="用户状态" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="inActiveUse(scope.row)"
            v-model="scope.row.status + '' "
            :active-value="dictionary.userStatus[0]?dictionary.userStatus[0].code:''"
            :inactive-value="dictionary.userStatus[1]?dictionary.userStatus[1].code:''"
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
  </div>
</template>
<script>
  // 替换成相应的模板
  import operationTemplate from './ZxUserOperateDialog'

  export default {
    name: 'ZxUserTable',
    data () {
      return {
        // 查询表单
        searchForm: {
          userName: '',
          sex: '',
          email: '',
          phoneNumber: '',
          status: '',
          updateTime: '',
          organizationId: '',
          childrenInclude: false
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
    components: {
      operationTemplate
    },
    mounted () {
      this.init()
      this.getTreeData()
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

        function f () {
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
