<template>
  <div class="main-area">
    <el-page-header @back="goBack" content="村民信息查看"></el-page-header>
    <el-divider content-position="left">基本信息</el-divider>
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
        <el-col :span="6">
          <el-form-item label="区划：" prop="townCode">
            <el-input autosize v-model="formData.orgName" placeholder="区划" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="户主姓名：" prop="name">
            <el-input autosize v-model="formData.name" placeholder="户主姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码：" prop="phoneNumber">
            <el-input autosize v-model="formData.phoneNumber" placeholder="手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="建档时间：" prop="createTime">
            <el-input autosize v-model="formData.createTime" placeholder="建档时间" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="详细地址：" prop="address">
            <el-input autosize v-model="formData.address" placeholder="详细地址" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">报修信息</el-divider>
    <el-table
      :data="repairsData"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="报修时间"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.createTime
          ?$moment(scope.row.createTime
          ).format(GLOBAL.config.dateFormat.ymdhms):'' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="repairStatus"
        label="状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{
          FUNCTIONS.systemFunction.getRtConfigValue(
          scope.row.repairStatus,
          GLOBAL.config.dictionaryData.repairStatus)
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="targetUserName"
        label="维修责任人"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="problem"
        align="center"
        label="报修描述">
      </el-table-column>
      <el-table-column
        prop="evaluate"
        align="center"
        label="评价">
      </el-table-column>
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
    <el-divider content-position="left">报抽信息</el-divider>
    <el-table
      :data="pumpData"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="报抽时间"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.createTime
          ?$moment(scope.row.createTime
          ).format(GLOBAL.config.dateFormat.ymdhms):'' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pumpStatus"
        label="状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{
          FUNCTIONS.systemFunction.getRtConfigValue(
          scope.row.pumpStatus,
          GLOBAL.config.dictionaryData.pumpStatus)
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="targetUserName"
        label="维修责任人"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pumpCarId"
        align="center"
        label="抽粪责任车辆">
      </el-table-column>
      <el-table-column
        prop="evaluate"
        align="center"
        label="评价">
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
      <el-button @click="goBack" style="float: right;margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
    </el-row>
  </div>
</template>
<script>
    export default {
        name: 'VillagerInfo',
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
                formData: {},
                // 校验规则
                formRules: {},
                // 字典数据
                dictionary: {},
                // 报修数据
                repairsData: [
                    {
                        date: '2019-12-11 15:33:23',
                        status: '未处理',
                        name: '张三',
                        address: '修不了',
                        evaluate: '4'

                    }
                ],
                // 报抽数据
                pumpData: [
                    {
                        date: '2019-12-11 15:33:23',
                        status: '未处理',
                        name: '张三',
                        address: '修不了',
                        evaluate: '4'

                    }
                ],
                // 报修分页参数
                paginationRepairs: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
                // 报抽分页参数
                pagination: {
                    pageSizeList: [10, 20, 30, 40, 50],
                    pageSize: 10,
                    layout: 'total, sizes, prev, pager, next, jumper',
                    total: 0,
                    currentPage: 1
                },
                costDisabledInput: true,
                outsideLawyerYes: false,
                loading: false,
                editableFlag: false,
                currentId: null
            }
        },
        mounted() {
            this.init()
        },
        components: {},
        methods: {
            init: function () {
                console.log(this.$route.params.id)
                this.currentId = this.$route.params.id
                this.getVillagerInfo()
                this.getRepairList('init')
                this.getPumpList('init')
            },
            goBack: function () {
                this.$router.go(-1)
            },
            // 基本信息请求
            getVillagerInfo: function () {
                let _this = this
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtUser,
                    _this.GLOBAL.config.handleType.getInfoById,
                    _this.currentId,
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            resultData.createTime = _this.$moment(resultData.createTime).format(_this.GLOBAL.config.dateFormat.ymdhms)
                            resultData.orgName = _this.FUNCTIONS.systemFunction.getAreaName(_this, resultData.villageCode)
                            _this.formData = resultData
                        } else {
                            _this.$message.warning('获取村民信息失败～')
                        }
                    }
                )
            },
            // 报修列表请求
            getRepairList: function (initPageFlag) {
                let _this = this
                let paginationData = _this.FUNCTIONS.systemFunction.paginationSet(
                    initPageFlag ? 1 : _this.pagination.currentPage,
                    initPageFlag ? 10 : _this.pagination.pageSize,
                    {submitUserId: _this.currentId})
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
                            _this.paginationRepairs.pageSize = resultData.size
                            _this.paginationRepairs.total = resultData.total
                            _this.paginationRepairs.currentPage = resultData.current
                            // resultData.records.forEach(item => {
                            //     item.orgName = _this.FUNCTIONS.systemFunction.getAreaName(_this, item.villageCode)
                            // })
                            _this.repairsData = resultData.records
                        } else {
                            _this.$message.warning('获取列表数据失败～')
                        }
                    })
            },
            // 报抽列表请求
            getPumpList: function (initPageFlag) {
                let _this = this
                let paginationData = _this.FUNCTIONS.systemFunction.paginationSet(
                    initPageFlag ? 1 : _this.pagination.currentPage,
                    initPageFlag ? 10 : _this.pagination.pageSize,
                    {submitUserId: _this.currentId})
                // 3、 调接口获取数据
                _this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.rtPump,
                    _this.GLOBAL.config.handleType.getPage,
                    paginationData,
                    null,
                    resultData => {
                        _this.loading = false
                        if (resultData) {
                            // 结果参数赋值
                            _this.paginationRepairs.pageSize = resultData.size
                            _this.paginationRepairs.total = resultData.total
                            _this.paginationRepairs.currentPage = resultData.current
                            // resultData.records.forEach(item => {
                            //     item.orgName = _this.FUNCTIONS.systemFunction.getAreaName(_this, item.villageCode)
                            // })
                            _this.pumpData = resultData.records
                        } else {
                            _this.$message.warning('获取列表数据失败～')
                        }
                    })
            },
            // 报修分页方法
            tableSizeChangeRepairs: function (pageSize) {
                this.paginationRepairs.pageSize = pageSize
                this.getRepairList()
            },
            currentChangeRepairs: function (current) {
                this.paginationRepairs.currentPage = current
                this.getRepairList()
            },
            // 报抽分页方法
            tableSizeChange: function (pageSize) {
                this.pagination.pageSize = pageSize
                this.getPumpList()
            },
            currentChange: function (current) {
                this.pagination.currentPage = current
                this.getPumpList()
            }
        }
    }
</script>
