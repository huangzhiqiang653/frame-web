<template>
  <el-dialog
    title="账户明细预览"
    :visible.sync="showFlag"
    :destroy-on-close="true"
    width="80%"
  >
    <el-divider content-position="left">账户信息</el-divider>
    <el-form
      :inline="true"
      :model="accountInfo"
      class="demo-ruleForm"
      label-width="100px"
      :size="GLOBAL.config.systemSize"
      :disabled="true">
      <el-row class="margin-top-20">
        <el-col :span="8">
          <el-form-item label="账户名称：" prop="accountName">
            <el-input v-model="accountInfo.accountName" placeholder="账户名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属用户：" prop="userId">
            <el-select v-model="accountInfo.userId"
                       placeholder="所属用户"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.userName" :value="item.id+','+item.userName"
                         v-for="item in dictionary.availableUsers" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="更新时间：" prop="updateTime">
            <el-date-picker
              style="width: 100%"
              v-model="accountInfo.updateTime"
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">所属用户信息</el-divider>
    <el-form
      :inline="true"
      :model="userInfo"
      class="demo-ruleForm"
      label-width="100px"
      :size="GLOBAL.config.systemSize"
      :disabled="true">
      <el-row class="margin-top-20">
        <el-col :span="12">
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="userInfo.userName" placeholder="姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：" prop="sex">
            <el-radio-group
              v-model="userInfo.sex + ''"
              placeholder="性别">
              <el-radio
                v-for="item in dictionary.sex"
                :label="item.code"
                :key="item.id" border>{{item.name}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthDay">
            <el-date-picker
              style="width: 100%"
              v-model="userInfo.birthDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择出生年月日" prop="birthDay">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属机构：" prop="organizationId">
            <el-input v-model="userInfo.organizationId" placeholder="所属机构" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="userInfo.email" placeholder="邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码：" prop="phoneNumber">
            <el-input v-model="userInfo.phoneNumber" placeholder="手机号码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea"
                      :rows="2"
                      v-model="userInfo.remark"
                      placeholder="备注"
                      maxlength="500"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">权限信息</el-divider>
    <div>TODO</div>
    <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
  </el-dialog>
</template>
<script>

  export default {
    name: 'ZxAccountAllView',
    props: {
      id: {
        type: String
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
        accountInfo: {},
        userInfo: {
          id: '',
          userName: '',
          sex: '',
          birthDay: '',
          organizationId: '',
          email: '',
          phoneNumber: '',
          remark: ''
        },
        // 字典数据
        dictionary: {
          availableUsers: [],
          sex: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.sex)))
        },
        showFlag: false
      }
    },
    mounted () {
      this.getAvailableUser()
    },
    methods: {
      init: function (info) {
        this.accountInfo = info
        this.showFlag = true
        this.getUserInfo()
      },
      getAvailableUser: function (searchName) {
        let _this = this
        this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.zxUser,
          _this.GLOBAL.config.handleType.getListByCondition,
          {userName: searchName},
          null,
          resultData => {
            this.dictionary.availableUsers = resultData
          }
        )
      },
      closeDialog: function () {
        this.showFlag = false
      },
      getUserInfo: function () {
        let _this = this
        _this.accountInfo.userId && _this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.zxUser,
          _this.GLOBAL.config.handleType.getInfoById,
          _this.accountInfo.userId.split(',')[0],
          null,
          resultData => {
            _this.userInfo = Object.assign(_this.userInfo, resultData)
          }
        )
      }
    }
  }
</script>
