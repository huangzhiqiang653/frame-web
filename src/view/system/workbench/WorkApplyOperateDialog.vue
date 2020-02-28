<!--zx_rts_db.t_rt_record_repair（报修记录表）-dialog-->
<template>
  <div class="main-area">
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @closed="closeDialog" :destroy-on-close="true">
      <el-page-header @back="closeDialog" content="工作信息查看"></el-page-header>
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
          <el-divider content-position="left">{{msg}}</el-divider>
          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
              <el-input autosize v-model="formData.type" placeholder="类型" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报修时间：" prop="reportTime" v-if="a.p_show">
              <el-input autosize v-model="formData.reportTime" placeholder="报修时间" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报抽时间：" prop="repairTime" v-if="a.p_show1">
              <el-input autosize v-model="formData.repairTime" placeholder="报抽时间" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分派时间：" prop="assignTime">
              <el-input autosize v-model="formData.assignTime" placeholder="分派时间" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区划：" prop="area">
              <el-input v-model="formData.area" placeholder="区划"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户主姓名" prop="accountName">
              <el-input v-model="formData.accountName" placeholder="户主姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="tel">
              <el-input v-model="formData.tel" placeholder="手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="报修描述：" prop="Flag">
              <el-input v-model="formData.Flag" placeholder="报修描述" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left" v-if="a.p_show">维修信息</el-divider>
        <el-row class="margin-top-20" v-if="a.p_show">
          <el-col :span="6">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="formData.status"
                         :size="GLOBAL.config.systemSize"
                         placeholder="状态"
                         style="width: 100%;"
              >
                <el-option label="--请选择--" value=""></el-option>
                <el-option :label="item.name" :value="item.code"
                           v-for="item in dictionary.accountStatus"
                           :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="维修责任人：" prop="ren">
              <el-input v-model="formData.ren" placeholder="维修责任人" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="首次上门时间：" prop="oneTime" label-width="80">
              <el-input autosize v-model="formData.oneTime" placeholder="首次上门时间" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评价：" prop="appraise">
              <el-rate v-model="value1"></el-rate>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left" v-if="a.p_show1">抽粪信息</el-divider>
        <el-row class="margin-top-20" v-if="a.p_show1">
          <el-col :span="8">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="formData.status"
                         :size="GLOBAL.config.systemSize"
                         placeholder="状态"
                         style="width: 100%;"
              >
                <el-option label="--请选择--" value=""></el-option>
                <el-option :label="item.name" :value="item.code"
                           v-for="item in dictionary.accountStatus"
                           :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽粪责任车辆：" prop="car" label-width="80">
              <el-input v-model="formData.car" placeholder="抽粪责任车辆" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上门时间：" prop="Time">
              <el-input autosize v-model="formData.Time" placeholder="上门时间" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评价：" prop="appraise">
              <el-rate v-model="value1"></el-rate>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="margin-top-20">
        <el-button @click="cancelClick" style="float: right;margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>export default {
    name: 'recordRepair',
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
            a: {
                p_show: false,
                p_show1: false
            },
            msg: '',
            value1: null,
            value2: null,
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            formData: {
                id: '',
                type: '',
                reportTime: '',
                repairTime: '',
                assignTime: '',
                area: '',
                accountName: '',
                tel: '',
                Flag: '',
                status: '',
                ren: '',
                oneTime: '',
                car: '',
                Time: '',
                appraise: '',
            },
            // 校验规则
            formRules: {
                type: [],
                reportTime: [],
                repairTime: [],
                assignTime: [],
                area: [],
                accountName: [],
                tel: [],
                Flag: [],
                status: [],
                ren: [],
                oneTime: [],
                car: [],
                Time: [],
                appraise: [],
            },
            // 字典数据
            dictionary: {
                repairStatus: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.repairStatus))),
                overtimeFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.overtimeFlag))),
            },
            editableFlag: true,
            loading: false,
            showTitle: '',
            showFlag: true
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        cancelClick: function () {
            this.dialogFormVisible = false
        },
        closeDialog: function () {
            this.form = {}
        },
        init: function () {
            let parm = this.$route.query
            if (parm.myType === 0) {
                this.msg = '报修信息'
                this.a.p_show = true
            } else if (parm.myType === 1) {
                this.msg = '报抽信息'
                this.a.p_show1 = true
            }
        },
        closeDialog: function () {
            this.$router.go(-1)
        },
        saveOrUpdateForm: function () {
            this.formData.id ? this.updateForm() : this.saveForm()
        },
        getInfo: function () {
            let _this = this
            this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
                _this,
                _this.GLOBAL.config.businessFlag.rtRepair,
                _this.GLOBAL.config.handleType.getInfoById,
                _this.formData.id,
                null,
                resultData => {
                    _this.loading = false
                    Object.assign(_this.formData, resultData)
                }
            )
        },
        // 提交
        submitForm: function () {
            // TODO
        }
    }
}
</script>
