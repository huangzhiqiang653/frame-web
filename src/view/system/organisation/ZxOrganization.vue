<!--zx_frame_db.auth_zx_organization（组织表）-table-->
<!--参数添加，1、config.js business中添加：zxOrganization: '后台地址'-->
<!--参数添加，2、global.js businessFlag中添加：zxOrganization: 'zxOrganization'-->
<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>组织管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区域-->
    <el-row class="margin-top-10">
      <el-col :span="2" class="margin-top-10">
        <label class="search-label">
          名称全程:
        </label>
      </el-col>
      <el-col :span="4" class="margin-top-10">
        <el-input v-model="searchForm.fullName"
                  :size="GLOBAL.config.systemSize"
                  placeholder="名称全程"
                  maxlength="32"></el-input>
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
      </el-col>
    </el-row>
    <!--操作-->
    <operationTemplate ref="operationTemplate"/>
  </div>
</template>
<script>
  // 替换成相应的模板
  import operationTemplate from './ZxOrganizationOperateDialog'

  export default {
    name: 'ZxOrganization',
    data () {
      return {
        // 查询表单
        searchForm: {
          fullName: ''
        },
        tableData: [],
        // 字典数据
        dictionary: {},
        // 资源权限控制，有的系统不需这么细，则全部为true
        source: {
          add: true,
          infoEdit: true
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
      this.init()
    },
    methods: {
      init: function () {
        // TODO 加载列表数据
        this.getTreeData()
      },
      doSearch: function () {
      },
      operationMethod: function (operateType, info) {
        this.$refs.operationTemplate.init(operateType, info ? info.id : null)
      },
      getSource: function (rowData) {
        let tempList = []
        this.source.infoEdit && tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'})
        return tempList
      },
      handleCommon: function (type, rowData) {
        switch (type) {
          case 'handleEdit':
            this.handleEdit(rowData)
            break
        }
      },
      // 编辑
      handleEdit: function (rowData) {
        this.operationMethod('edit', rowData)
        // TODO
      },
      // 获取列表
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
              debugger
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
