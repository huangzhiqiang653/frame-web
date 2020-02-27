<template>
  <div class="main-area">
    <el-page-header @back="goBack" :content="showTitle+'车辆信息'"></el-page-header>
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
        <el-col :span="10">
          <el-form-item label="区域：" prop="villageCode">
            <cascader :set-props="setProps" :set-options="treeData" :set-data-type="'value'"
                      :set-size="GLOBAL.config.systemSize" maxlength="64"
                      v-model="formData.villageCode"
                      ref="myArea"></cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="车牌号：" prop="carNo">
            <el-input v-model="formData.carNo" placeholder="车牌号" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="管理区域：" prop="listManageArea">
            <cascader :set-props="setManageProps" :set-options="treeData" :set-data-type="'value'"
                      :set-size="GLOBAL.config.systemSize" maxlength="64"
                      v-model="formData.listManageArea"
                      ref="manageArea"></cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="editableFlag">
          <el-button v-if="source.add"
                     type="primary"
                     icon="el-icon-plus"
                     :size="GLOBAL.config.systemSize"
                     style="float: left;"
                     @click="addCarUsers">添加驾驶员
          </el-button>
        </el-col>
      </el-row>
      <el-divider content-position="left">驾驶员信息</el-divider>
      <el-table style="width: 100%"
                :data="tableData"
                element-loading-text="数据处理中...请稍等..."
                v-loading="loading">
        <!--序号-->
        <el-table-column prop="index" label="序号" width="80px" align="center"/>
        <!--当值司机-->
        <el-table-column prop="name" label="当值司机" align="center"/>
        <!--所属乡镇编码-->
        <el-table-column prop="orgName" label="区域" align="center"/>
        <!--车牌号-->
        <el-table-column prop="carNo" label="车牌号" align="center"/>
        <!--手机号-->
        <el-table-column prop="phoneNumber" label="手机号" align="center"/>
        <!--更新时间-->
        <el-table-column prop="updateTime"
                         label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime
            ?$moment(scope.row.updateTime
            ).format(GLOBAL.config.dateFormat.ymdhms):'' }}
          </template>
        </el-table-column>
        <el-table-column prop="scope" label="操作" align="center" v-if="editableFlag">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="text" @click.native="handleDelete(scope.row)">删除
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
        <el-button @click="goBack" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
        <el-button v-if="editableFlag" type="primary" @click="saveForm" style="margin: 0 20px;"
                   :size="GLOBAL.config.systemSize">保存
        </el-button>
      </el-row>
    </el-form>
    <!--操作-->
    <addCarUserTemplate ref="addCarUserTemplate" :refresh="getTableData"/>
  </div>
</template>
<script>
    import addCarUserTemplate from '.././villager/VillagerSimpleTableDialog'
    import cascader from '../../../components/Cascader'

    export default {
        name: 'OperationAdd',
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
                    carNo: ''
                },
                formData: {
                    id: '',
                    villageCode: '',
                    carNo: '',
                    listManageArea: [],
                },
                //校验规则
                formRules: {
                    villageCode: [
                        {required: true, message: '请设置所属区域', trigger: 'blur'}
                    ],
                    carNo: [
                        {required: true, message: '请设置所属区域', trigger: 'blur'}
                    ],
                    listManageArea: [
                        {required: true, message: '请设置所属区域', trigger: 'blur'}
                    ]
                },
                tableData: [],
                // 分页参数
                pagination: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
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
                treeData: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.orgTreeName))),
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
                // 字典数据
                dictionary: {},
                loading: false,
                editableFlag: false,
                showTitle: "查看"
            }
        },
        mounted() {
            this.init()
        },
        components: {
            addCarUserTemplate,
            cascader
        },
        methods: {
            init: function () {
                let _this = this
                if (this.$route.params) {
                    let carInfo = this.$route.params.carInfo
                    carInfo.orgName = _this.FUNCTIONS.systemFunction.getAreaName(_this, carInfo.villageCode)
                    _this.formData.id = carInfo.id
                    _this.formData.villageCode = carInfo.villageCode
                    _this.formData.carNo = carInfo.carNo
                    _this.formData.listManageArea = carInfo.listManageArea
                    _this.searchForm.carNo = carInfo.carNo
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
                this.getTableData('init')
            },
            goBack: function () {
                this.$router.go(-1)
            },
            //添加驾驶员
            addCarUsers: function () {
                let _this = this
                _this.$refs.addCarUserTemplate.init(_this.formData.carNo, _this.GLOBAL.config.userType.driver, false)
            },
            //删除驾驶员
            handleDelete: function (rowData) {
                let _this = this
                _this.$confirm('确认删除当前驾驶员？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.loading = true
                    let params = {
                        id: rowData.id,
                        userType: _this.GLOBAL.config.userType.driver
                    }
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.rtUser,
                        _this.GLOBAL.config.handleType.removeUserRole,
                        params,
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
            saveForm: function () {
                let _this = this
                // 参数处理======start==========
                let checkedNode = _this.$refs.manageArea.radioObj
                if (!checkedNode) {
                    _this.$message.warning('请勾选区域～')
                    return
                }
                let checkedAreaId = []
                checkedNode.forEach(item => {
                    checkedAreaId.push({"orgCode": item.code, "orgId": item.id})
                })
                _this.formData.listManageArea = checkedAreaId
                // 参数处理======end============
                _this.loading = true
                let params = this.formData
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtCar,
                    _this.GLOBAL.config.handleType.updateAll,
                    _this.FUNCTIONS.systemFunction.removeNullFields(params),
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            _this.$message.success('保存成功～')
                            this.$router.push({
                                name: 'Cars'
                            })
                        } else {
                            _this.$message.warning('保存失败～')
                        }
                    },
                    () => {
                        _this.loading = false
                    })
            },
        }
    }
</script>
