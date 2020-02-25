<template>
  <div class="main-area">
    <el-page-header @back="goBack" content="维修人员查看"></el-page-header>
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
        <el-col :span="6">
          <el-form-item label="区划：" prop="townCode">
            <el-input autosize v-model="formData.townCode" placeholder="区划" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人员姓名：" prop="villageCode">
            <el-input autosize v-model="formData.villageCode" placeholder="户主姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码：" prop="carNo">
            <el-input autosize v-model="formData.carNo" placeholder="手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">维修记录</el-divider>
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
        prop="area"
        label="报修人区划"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="报修人姓名"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="报修人手机号"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="报修时间"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="首次上门时间"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="120">
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
                        area: 'xxx村',
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
                console.log('请求数据')
            }
        }
    }
</script>
