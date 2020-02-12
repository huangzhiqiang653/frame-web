<template>
  <div>
    <div class="register-wrapper" v-loading="loading">
      <div id="register" v-if="isRegister">
        <p class="title">登录</p>
        <el-form
          :model="dataForm"
          status-icon
          :rules="rules"
          ref="dataForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="accountName">
            <el-input v-model="dataForm.accountName" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="accountPassword">
            <el-input type="password" v-model="dataForm.accountPassword" auto-complete="off"
                      placeholder="输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width:100%;">登录</el-button>
            <p class="login" @click="gotoRegist">没有账号？立即注册</p>
            <!--<router-link to='/RegisterAccount'>没有账号？立即注册</router-link>-->
           <!-- <button @click="gotoRegist" class="btn btn-success">没有账号？立即注册</button>-->
          </el-form-item>
        </el-form>
      </div>

      <registerAccount v-if="!isRegister" v-on:listenToChildEvent="showMsgFromChild"></registerAccount>
    </div>
  </div>
</template>
<script>
  import registerAccount from '../../view/system/RegisterAccount'
    export default {
        name: "Register",
        components: {
            registerAccount
        },
        data() {
            // <!--验证手机号是否合法-->
            let checkName = (rule, value, callback) => {
                if (value === '' || value.trim() === '') {
                    callback(new Error('请输入账号'))
                } else {
                    callback()
                }
            }
            // <!--验证密码-->
            let validatePass = (rule, value, callback) => {
                if (value === "" || value.trim() === "") {
                    callback(new Error("请输入密码"))
                }
            }

            return {
                isRegister: true, // 判断登录或注册
                dataForm: {
                    accountName: "",
                    accountPassword: ""
                },
                rules: {
                    accountName: [{validator: checkName, trigger: 'change'}],
                    accountPassword: [{validator: validatePass, trigger: 'change'}],
                },
                isDisabled: false, // 是否禁止点击发送验证码按钮
                flag: true,
                loading: false
            }
        },
        methods: {
            // <!--提交登录-->
            submitForm: function () {
                //登录
                let _this = this
                let params = this.dataForm
                _this.loading = true
                _this.FUNCTIONS.systemFunction.jsonPost(
                    _this.CONFIG.urls.root + _this.CONFIG.urls.index.login,
                    params,
                    resultData => {
                        if (resultData.code === '0') {
                            window.location.reload()
                        } else {
                            _this.$message({
                                showClose: true,
                                message: '操作失败～',
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
         //获取子组件传递的值
          showMsgFromChild: function (data){
                this.isRegister = data;
          },

            // <!--进入注册页-->
          gotoRegist: function () {
                this.isRegister = false;
            }
        }
    }
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
