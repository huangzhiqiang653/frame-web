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
        <el-col :span="8">
          <el-form-item label="区域：" prop="townCode">
            <el-input v-model="formData.townCode" placeholder="所属区域" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号：" prop="carNo">
            <el-input v-model="formData.carNo" placeholder="车牌号" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理区域：" prop="manageAreaCode">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              ref="manageArea"
            >
            </el-tree>
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
        <el-table-column prop="dutyUserId" label="当值司机" align="center"/>
        <!--所属乡镇编码-->
        <el-table-column prop="townCode" label="区域" align="center"/>
        <!--车牌号-->
        <el-table-column prop="carNo" label="车牌号" align="center"/>
        <!--手机号-->
        <el-table-column prop="phoneNum" label="手机号" align="center"/>
        <!--更新时间-->
        <el-table-column prop="updateTime"
                         label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime
            ?$moment(scope.row.updateTime
            ).format('yyyy-MM-dd HH:mm:ss'):'' }}
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

    export default {
        name: 'OperationAdd',
        data() {
            return {
                formData: {
                    id: '',
                    townCode: '',
                    villageCode: '',
                    carNo: '',
                    manageAreaCode: ''
                },
                //校验规则
                formRules: {},
                tableData: [{
                    id: '1',
                    index: '1',
                    dutyUserId: '张三',
                    phoneNum: '12345678900',
                    townCode: '桃花镇',
                    villageCode: '古城村',
                    carNo: 'N123456'
                }],
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
                treeData: [{
                    id: '1',
                    name: '肥西县',
                    code: '0001',
                    children: [{name: '上派镇', code: '00001', children: []}, {name: '桃花镇', code: '00002', children: []}]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                // 字典数据
                dictionary: {},
                costDisabledInput: true,
                outsideLawyerYes: false,
                loading: false,
                editableFlag: false,
                showTitle: "查看"
            }
        },
        mounted() {
            this.init()
        },
        components: {
            addCarUserTemplate
        },
        methods: {
            init: function () {
                if (this.$route.params) {
                    this.formData.id = this.$route.params.id
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
                // this.getTableData('init')
            },
            goBack: function () {
                this.$router.go(-1)
            },
            //添加驾驶员
            addCarUsers: function () {
                this.$refs.addCarUserTemplate.init(this.formData.id)
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
                        id: _this.formData.id,
                        userId: rowData.id
                    }
                    _this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.cars,
                        _this.GLOBAL.config.handleType.deleteLogicalBatch,
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
            saveForm: function () {
                // 参数处理======start==========
                let checkedMenusNode = this.$refs.manageArea.getCheckedNodes(true)
                if (!checkedMenusNode) {
                    this.$message.warning('请勾选区域～')
                    return
                }
                let checkedAreaId = new Set()
                checkedMenusNode.forEach(item => {
                    checkedAreaId.add(item.id + "," + item.code)
                })
                this.formData.manageAreaCode = checkedAreaId
                // 参数处理======end============
                let _this = this
                _this.loading = true
                let params = this.formData
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.zxRelationRoleMenu,
                    _this.GLOBAL.config.handleType.add,
                    _this.FUNCTIONS.systemFunction.removeNullFields(params),
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            _this.$message.success('保存成功～')
                            _this.showFlag = false
                            _this.$props.refresh && this.$props.refresh('init')
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
