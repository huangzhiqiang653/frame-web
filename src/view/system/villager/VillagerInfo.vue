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
            <el-input autosize v-model="formData.townCode" placeholder="区划" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="户主姓名：" prop="villageCode">
            <el-input autosize v-model="formData.villageCode" placeholder="户主姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码：" prop="carNo">
            <el-input autosize v-model="formData.carNo" placeholder="手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="建档时间：" prop="carNo">
            <el-input autosize v-model="formData.carNo" placeholder="建档时间" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="详细地址：" prop="carNo">
            <el-input autosize v-model="formData.carNo" placeholder="详细地址" maxlength="64"></el-input>
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
        prop="date"
        label="报修时间"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="维修责任人"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
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
        prop="date"
        label="报抽时间"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="维修责任人"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
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
        data () {
            return {
                formData: {

                },
                // 校验规则
                formRules: {

                },
                // 字典数据
                dictionary: {
                },
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
                editableFlag: false
            }
        },
        mounted () {
            this.init()
        },
        components: {

        },
        methods: {
            init: function () {
                console.log(this.$router.params.id)
            },
            goBack: function () {
                this.$router.go(-1)
            },
            // 基本信息请求
            // 报修列表请求
            // 报抽列表请求
            // 报修分页方法
            tableSizeChangeRepairs: function (pageSize) {
                this.paginationRepairs.pageSize = pageSize
                this.getTableData()
            },
            currentChangeRepairs: function (current) {
                this.paginationRepairs.currentPage = current
                this.getTableData()
            },
            // 报抽分页方法
            tableSizeChange: function (pageSize) {
                this.pagination.pageSize = pageSize
                this.getTableData()
            },
            currentChange: function (current) {
                this.pagination.currentPage = current
                this.getTableData()
            },
            // 页面请求
            getTableData: function () {
                console.log('请求数据')
            }
        }
    }
</script>
