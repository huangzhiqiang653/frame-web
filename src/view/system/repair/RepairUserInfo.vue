<template>
  <div class="main-area">
    <el-page-header @back="goBack" :content="showTitle+'维修人员'"></el-page-header>
    <el-divider content-position="left">人员信息</el-divider>
    <el-form
      :inline="true"
      :model="formData"
      class="demo-ruleForm"
      label-width="100px"
      :rules="formRules"
      ref="formData"
      :size="GLOBAL.config.systemSize"
      element-loading-text="数据处理中...请稍等..."
      :disabled="!editableFlag"
      v-loading="loading">
      <el-row class="margin-top-20">
        <el-col :span="8">
          <el-form-item label="区域：" prop="villageCode">
            <cascader :set-props="setProps" :set-options="treeData" :set-data-type="'value'"
                      :set-size="GLOBAL.config.systemSize" maxlength="64"
                      :val="formData.villageCode"
                      @getValue="getValue"
                      ref="myArea"></cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="人员姓名：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码：" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="管理区域：" prop="listManageArea">
            <cascader :set-props="setManageProps" :set-options="treeData" :set-data-type="'value'"
                      :set-size="GLOBAL.config.systemSize" maxlength="64"
                      :val="formData.listManageArea"
                      ref="manageArea"></cascader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">维修记录</el-divider>
    <el-table
      :data="repairsData"
      element-loading-text="数据处理中...请稍等..."
      v-loading="loading"
      style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="area" label="报修人区域" align="center" width="180"></el-table-column>
      <el-table-column prop="name" label="报修人姓名" align="center" width="120"></el-table-column>
      <el-table-column prop="phoneNumber" label="报修人手机号" align="center" width="180"></el-table-column>
      <el-table-column prop="date" label="报修时间" align="center" width="180"></el-table-column>
      <el-table-column prop="date" label="首次上门时间" align="center" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="120"></el-table-column>
      <el-table-column prop="evaluate" align="center" label="评价"></el-table-column>
    </el-table>
    <el-pagination
      class="margin-top-10 margin-bottom-20"
      @size-change="tableSizeChangeRepairs"
      @current-change="currentChangeRepairs"
      :current-page="paginationRepairs.currentPage"
      :page-sizes="paginationRepairs.pageSizeList"
      :page-size="paginationRepairs.pageSize"
      :layout="paginationRepairs.layout"
      :total="paginationRepairs.total">
    </el-pagination>
    <el-row class="margin-top-20">
      <el-button @click="goBack" style="float: right;margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
    </el-row>
  </div>
</template>
<script>
    import cascader from '../../../components/Cascader'

    export default {
        name: 'RepairUserInfo',
        props: {
            id: {
                type: String,
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
                    operationUserId: ''
                },
                formData: {
                    id: '',
                    name: '',
                    phoneNumber: '',
                    villageCode: '',
                    listManageArea: [],
                },
                // 校验规则
                formRules: {
                    name: [],
                    phoneNumber: [],
                    villageCode: [],
                    listManageArea: [],
                },
                //管理区域
                setManageProps: {
                    multiple: true, // 多选
                    checkStrictly: true, // 父节点取消选中关联
                    value: 'code',
                    label: 'name',
                    children: 'children',
                    leaf: 'leaf'
                },
                //所属区域
                setProps: {
                    multiple: false, // 单选
                    checkStrictly: true, // 父节点取消选中关联
                    value: 'code',
                    label: 'name',
                    children: 'children',
                    leaf: 'leaf'
                },
                treeData: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.orgTreeName))),
                // 字典数据
                dictionary: {},
                // 报修数据
                repairsData: [],
                // 报修分页参数
                paginationRepairs: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
                loading: false,
                editableFlag: false,
                showTitle: "查看"
            }
        },
        mounted() {
            this.init()
        },
        components: {
            cascader
        },
        methods: {
            init: function () {
                console.log(this.$route.params)
                let _this = this
                if (this.$route.params) {
                    let userInfo = this.$route.params.userInfo
                    _this.formData.id = userInfo.id
                    _this.formData.villageCode = userInfo.villageCode
                    _this.formData.name = userInfo.name
                    _this.formData.phoneNumber = userInfo.phoneNumber
                    _this.searchForm.operationUserId = userInfo.id
                    let type = this.$route.params.type
                    if (type === 'add') {
                        this.showTitle = '新增'
                    } else if (type === 'edit') {
                        this.showTitle = '编辑'
                        this.editableFlag = true
                    } else if (type === 'view') {
                        this.showTitle = '查看'
                    }
                }
                this.getManageArea()
                this.getTableData('init')
            },
            goBack: function () {
                this.$router.go(-1)
            },
            // 报修分页方法
            tableSizeChangeRepairs: function (pageSize) {
                this.paginationRepairs.pageSize = pageSize
                this.getTableData()
            },
            currentChangeRepairs: function (current) {
                this.paginationRepairs.currentPage = current
                this.getTableData()
            },
            // 页面请求
            getTableData: function () {
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
            //获取管理区域
            getManageArea: function () {
                let _this = this
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtManageArea,
                    _this.GLOBAL.config.handleType.getListByCondition,
                    {"targetId": _this.formData.id},
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            // 结果参数赋值
                            let manageAreaIds = []
                            resultData.forEach(item => {
                                manageAreaIds.push(item.orgCode)
                            })
                            _this.formData.listManageArea = manageAreaIds
                        }
                    }
                )
            },
        }
    }
</script>
