<template>
  <div>
    <div class="register-wrapper" v-loading="loading">
      <div id="register">
        <p class="title">注册页面</p>
        <el-form
          :model="dataForm"
          status-icon
          :rules="formRules"
          ref="dataForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="account.accountName">
            <el-input v-model="dataForm.account.accountName" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="account.accountPassword">
            <el-input type="password" v-model="dataForm.account.accountPassword" auto-complete="off"
                      placeholder="输入密码"></el-input>
          </el-form-item>
          <!--注册用户名-->
        <el-form-item prop="user.userName">
          <el-input v-model="dataForm.user.userName" auto-complete="off" placeholder="姓名"></el-input>
          </el-form-item>
          <!--注册用户电话-->
          <el-form-item prop="user.phoneNumber">
            <el-input v-model="dataForm.user.phoneNumber" auto-complete="off" placeholder="电话"></el-input>
          </el-form-item>
          <!--注册用户出生日期-->
          <el-form-item prop="user.birthDay">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.user.birthDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择出生年月日" prop="birthDay">
            </el-date-picker>
          </el-form-item>
          <!--性别-->
          <el-form-item prop="user.sex">
            <div >
              <input type="radio" name="radios" value="1" v-model="dataForm.user.sex"><label>男</label>
              <input type="radio" name="radios" value="0" v-model="dataForm.user.sex"><label>女</label>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width:100%;">注册</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'RegisterAccount',
        data() {
            return {
                dataForm: {
                    account: {
                        accountName: "",
                        accountPassword: ""
                    },
                    user: {
                        userName: "",
                        phoneNumber: "",
                        birthDay: "",
                        sex: ""
                    }
                },
                formRules: {
                    accountName: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    accountPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    phoneNumber: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'}
                    ]
                },
                isDisabled: false, // 是否禁止点击发送验证码按钮
                flag: true,
                loading: false
            }
        },
        created: function () {
            console.log('注册')
        },
        methods: {
            // <!--提交注册-->
            submitForm: function () {
                let _this = this
                let params = this.dataForm
                _this.loading = true
                _this.FUNCTIONS.systemFunction.jsonPost(
                    _this.CONFIG.urls.root + _this.CONFIG.urls.index.registerAccount,
                    {"info": params},
                    resultData => {
                        _this.loading = false;
                        if (resultData.code === '0') {
                            _this.$emit("listenToChildEvent", true);
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '操作失败～请填完信息或账号已有请修改',
                                type: 'warning'
                            })
                        }
                    },
                    () => {
                        _this.$message({
                            showClose: true,
                            message: '请求异常，请联系管理员～',
                            type: 'error'
                        })
                    }
                )
            },
        }
    };
</script>

<style scoped>
  .loading-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #aedff8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .register-wrapper img {
    position: absolute;
    z-index: 1;
  }

  .register-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  #register {
    max-width: 340px;
    margin: 60px auto;
    background: #fff;
    padding: 20px 40px;
    border-radius: 10px;
    position: relative;
    z-index: 9;
  }

  .title {
    font-size: 26px;
    line-height: 50px;
    font-weight: bold;
    margin: 10px;
    text-align: center;
  }

  .el-form-item {
    text-align: center;
  }

  .login {
    margin-top: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #1ab2ff;
    cursor: pointer;
    text-align: left;
    text-indent: 8px;
    width: 160px;
  }

  .login:hover {
    color: #2c2fd6;
  }

  .code >>> .el-form-item__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .code button {
    margin-left: 20px;
    width: 140px;
    text-align: center;
  }

  .el-button--primary:focus {
    background: #409EFF;
    border-color: #409EFF;
    color: #fff;
  }
</style>
