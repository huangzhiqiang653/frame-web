<template>
  <div class="main-area">
    <el-breadcrumb separator=":">
      <el-breadcrumb-item>当前位置</el-breadcrumb-item>
      <el-breadcrumb-item>代码生成</el-breadcrumb-item>
    </el-breadcrumb>
    <!--数据源配置-->
    <el-divider content-position="left">配置</el-divider>
    <el-form
      :inline="true"
      :model="connectData"
      class="demo-ruleForm"
      label-width="120px"
      :rules="formRules"
      ref="formData"
      element-loading-text="校验中...请稍等..."
      v-loading="loading"
    >
      <el-row class="margin-top-20">
        <el-col :span="24">
          <el-form-item label="数据库地址：" prop="url">
            <el-input
              autosize
              placeholder="数据库地址"
              maxlength="100"
              v-model="connectData.url">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(connectData.url && (connectData.url.length === 100))?'color: red;':''">{{connectData.url?connectData.url.length:0}}/100</span>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据库驱动：" prop="driver">
            <el-input
              autosize
              placeholder="数据库驱动"
              maxlength="100"
              v-model="connectData.driver">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(connectData.driver && (connectData.driver.length === 100))?'color: red;':''">{{connectData.driver?connectData.driver.length:0}}/100</span>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名：" prop="userName">
            <el-input
              autosize
              placeholder="用户名"
              maxlength="32"
              v-model="connectData.userName">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="密码：" prop="password">
            <el-input
              autosize
              placeholder="密码"
              maxlength="32"
              v-model="connectData.password">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" icon="el-icon-thumb" circle title="test" @click="validateDb"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="表前缀：" prop="tablePre">
            <el-input
              autosize
              placeholder="表前缀"
              maxlength="32"
              v-model="connectData.tablePre">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="业务表：" prop="tableList">
            <el-input
              placeholder="业务表"
              type="textarea"
              :autosize="{ minRows: 3}"
              v-model="connectData.tableList">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" title="获取表结果数据" @click="getDbData">获取表结果数据</el-button>
      </el-row>
    </el-form>
    <el-divider content-position="left">列表页面生成配置</el-divider>
    <div>
      <el-row>
        <el-col :span="3">
          <label class="search-label">
            选择待生成表:
          </label>
        </el-col>
        <el-col :span="21">
          <el-radio-group v-model="listData.tableCode" style="float: left;" @change="listTabChange">
            <el-radio v-for="(item, index) in tablesData" :label="item.tableName" :key="index" border>
              {{item.tableComment}}
            </el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-col :span="3">
          <label class="search-label">
            列表整体操作选择:
          </label>
        </el-col>
        <el-col :span="21">
          <el-checkbox-group v-model="listData.tableHandle" :disabled="!tablesData.length">
            <el-checkbox style="float: left;" v-for="(item, index) in tableHandleList" :label="item.code"
                         :key="index" border> {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-col :span="3">
          <label class="search-label">
            单条数据操作选择:
          </label>
        </el-col>
        <el-col :span="21">
          <el-checkbox-group v-model="listData.infoHandle" :disabled="!tablesData.length">
            <el-checkbox style="float: left;" v-for="(item, index) in dataInfoHandleList" :label="item.code"
                         :key="index" border> {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="margin-top-20" style="border: 1px solid #ececec; border-radius: 10px; padding: 10px 0;">
        <el-col :span="3">
          <label class="search-label">
            字段设置:
          </label>
        </el-col>
        <el-col :span="24">
          <el-row class="margin-top-10" v-for="(item, index) in listData.showFields" :key="index">
            <el-col :span="1" style="line-height: 40px;">排序</el-col>
            <el-col :span="1">
              <el-input v-model="item.fieldSort" :disabled="true" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="1" style="line-height: 40px;">字段</el-col>
            <el-col :span="3">
              <el-select v-model="item.filedNameCode" placeholder="请选择字段" style="width: 100%"
                         :disabled="!tablesData.length">
                <el-option
                  v-for="item2 in listData.fields"
                  :key="item2.COLUMN_NAM"
                  :value="item2.COLUMN_COMMENT.split(' ')[0] + '#' + item2.COLUMN_NAME + '#'+ item2.DATA_TYPE + '#' + item2.COLUMN_COMMENT"
                  :label="item2.COLUMN_COMMENT.split(' ')[0]">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" style="line-height: 40px;">类型</el-col>
            <el-col :span="3">
              <el-select v-model="item.fieldType" placeholder="请选择字段" style="width: 100%"
                         :disabled="!tablesData.length">
                <el-option
                  v-for="item3 in listData.fieldType"
                  :key="item3.code"
                  :value="item3.code"
                  :label="item3.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2" style="line-height: 40px;">
              {{(item.fieldType !== 'dateTime' && item.fieldType !== 'time' && item.fieldType !==
              'date')?'字典code':'日期时间类型' }}
            </el-col>
            <el-col :span="6">
              <el-input v-if="item.fieldType !== 'dateTime' && item.fieldType !== 'time'  && item.fieldType !== 'date' "
                        placeholder="非必填，需要时填写" :disabled="!tablesData.length"
                        v-model="item.remark" style="width: 100%"></el-input>
              <el-select v-else v-model="item.remark" placeholder="日期时间类型" style="width: 100%"
                         :disabled="!tablesData.length">
                <el-option
                  v-for="item4 in formHandle.dateTimeType"
                  :key="item4.code"
                  :value="item4.code"
                  :label="item4.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button v-if="index > 0"
                         style="margin: 10px 0 0 10px; float: left;"
                         title="删除"
                         type="danger"
                         icon="el-icon-delete"
                         @click.prevent="removeListField(item)"
                         :size="GLOBAL.config.systemSize"
                         :disabled="!tablesData.length"
                         circle></el-button>
              <el-button v-if="(index === listData.showFields.length - 1)"
                         style="margin: 10px; float: left;"
                         title="添加案件进展"
                         type="primary"
                         icon="el-icon-plus"
                         @click="addListField"
                         :disabled="!tablesData.length"
                         :size="GLOBAL.config.systemSize" circle></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-button type="primary" @click="generateTableFile" :disabled="!tablesData.length">生成列表vue文件</el-button>
      </el-row>
    </div>
    <el-divider content-position="left">SUVDAS生成配置</el-divider>
    <div>
      <el-row>
        <el-col :span="3">
          <label class="search-label">
            选择表:
          </label>
        </el-col>
        <el-col :span="21">
          <el-radio-group v-model="formHandle.mainTable" style="float: left;" @change="formMainTableChange"
                          :disabled="!tablesData.length">
            <el-radio v-for="(item, index) in tablesData" :label="item.tableName" :key="index" border>
              {{item.tableComment}}
            </el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-col :span="3">
          <label class="search-label">
            展现形式:
          </label>
        </el-col>
        <el-col :span="21">
          <el-radio v-model="formHandle.formShowType" label="dialog" :disabled="!tablesData.length"
                    style="float: left;line-height: 28px;">弹出框
          </el-radio>
          <el-radio v-model="formHandle.formShowType" label="page" :disabled="!tablesData.length"
                    style="float: left;line-height: 28px;">
            新页面
          </el-radio>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-col :span="3">
          <label class="search-label">
            表单整体功能:
          </label>
        </el-col>
        <el-col :span="21">
          <el-checkbox-group v-model="formHandle.handleList" :disabled="!tablesData.length">
            <el-checkbox style="float: left;" v-for="(item, index) in formHandleList" :label="item.code"
                         :key="index" border> {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="margin-top-20" style="border: 1px solid #ececec; border-radius: 10px; padding: 10px 0;">
        <el-col :span="3">
          <label class="search-label">
            字段设置:
          </label>
        </el-col>
        <el-col :span="24">
          <el-row class="margin-top-10" v-for="(item, index) in formHandle.mainSelectFields" :key="index">
            <el-col :span="1" style="line-height: 40px;">排序</el-col>
            <el-col :span="1">
              <el-input v-model="item.fieldSort" :disabled="true" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="1" style="line-height: 40px;">字段</el-col>
            <el-col :span="3">
              <el-select v-model="item.filedNameCode" placeholder="请选择字段" style="width: 100%"
                         :disabled="!tablesData.length">
                <el-option
                  v-for="item2 in formHandle.mainFields"
                  :key="item2.COLUMN_NAM"
                  :value="item2.COLUMN_COMMENT.split(' ')[0] + '#' + item2.COLUMN_NAME + '#'+ item2.DATA_TYPE + '#' + item2.COLUMN_COMMENT"
                  :label="item2.COLUMN_COMMENT.split(' ')[0]">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" style="line-height: 40px;">类型</el-col>
            <el-col :span="3">
              <el-select v-model="item.fieldType" placeholder="请选择字段" style="width: 100%"
                         :disabled="!tablesData.length">
                <el-option
                  v-for="item3 in formHandle.fieldType"
                  :key="item3.code"
                  :value="item3.code"
                  :label="item3.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1" style="line-height: 40px;">宽度</el-col>
            <el-col :span="3">
              <el-input-number v-model="item.fieldWidth" :step="1" :min="0" :max="24" :disabled="!tablesData.length"
                               style="width: 100%"></el-input-number>
            </el-col>
            <el-col :span="2" style="line-height: 40px;">
              {{(item.fieldType !== 'dateTime' && item.fieldType !== 'time' && item.fieldType !==
              'date')?'字典code':'日期时间类型' }}
            </el-col>
            <el-col :span="6">
              <el-input v-if="item.fieldType !== 'dateTime' && item.fieldType !== 'time'  && item.fieldType !== 'date' "
                        placeholder="非必填，需要时填写" :disabled="!tablesData.length"
                        v-model="item.remark" style="width: 100%"></el-input>
              <el-select v-else v-model="item.remark" placeholder="日期时间类型" style="width: 100%">
                <el-option
                  v-for="item4 in formHandle.dateTimeType"
                  :key="item4.code"
                  :value="item4.code"
                  :label="item4.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button v-if="index > 0"
                         style="margin: 10px 0 0 10px; float: left;"
                         title="删除"
                         type="danger"
                         icon="el-icon-delete"
                         @click.prevent="removeField(item)"
                         :size="GLOBAL.config.systemSize"
                         :disabled="!tablesData.length"
                         circle></el-button>
              <el-button v-if="(index === formHandle.mainSelectFields.length - 1)"
                         style="margin: 10px; float: left;"
                         title="添加案件进展"
                         type="primary"
                         icon="el-icon-plus"
                         @click="addField"
                         :disabled="!tablesData.length"
                         :size="GLOBAL.config.systemSize" circle></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="margin-top-20" style="margin-bottom: 20px;">
        <el-button type="primary" @click="generateSUVDASFile" :disabled="!tablesData.length">生成相应SUVDAS的vue文件
        </el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CodeGenerate',
    data () {
      return {
        connectData: {
          url: 'jdbc:mysql://127.0.0.1:3306/zx_frame_db?useUnicode=true&useSSL=false&characterEncoding=utf8',
          driver: 'com.p6spy.engine.spy.P6SpyDriver',
          userName: 'root',
          password: 'root',
          tablePre: 'auth_',
          tableList: 'auth_zx_account,auth_zx_user,auth_zx_role,auth_zx_menu,auth_zx_resource,auth_zx_organization'
        },
        formRules: {
          url: [
            {required: true, message: '请输入数据库地址', trigger: 'blur'}
          ],
          driver: [
            {required: true, message: '请输入数据库驱动', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          tableList: [
            {required: true, message: '请输入待生成表', trigger: 'blur'}
          ]
        },
        loading: false,
        tablesData: [],
        listData: {
          tableCode: '',
          tableDetail: '',
          fields: [],
          showFields: [
            {filedNameCode: '', fieldSort: 1, fieldType: '', remark: ''}
          ],
          tableHandle: [],
          infoHandle: [],
          fieldType: [
            {name: 'normal', code: 'normal'},
            {name: 'dictionary', code: 'dictionary'},
            {name: 'dateTime', code: 'dateTime'}
          ]
        },
        formHandle: {
          mainTable: '',
          tableDetail: '',
          formShowType: 'dialog',
          mainFields: [],
          mainSelectFields: [
            {filedNameCode: '', fieldSort: 1, fieldWidth: 4, fieldType: '', remark: ''}
          ],
          handleList: [],
          fieldType: [
            {name: 'input', code: 'input'},
            {name: 'radio', code: 'radio'},
            {name: 'checkbox', code: 'checkbox'},
            {name: 'inputNumber', code: 'inputNumber'},
            {name: 'select', code: 'select'},
            {name: 'switch', code: 'switch'},
            {name: 'date', code: 'date'},
            {name: 'time', code: 'time'},
            {name: 'dateTime', code: 'dateTime'}
          ],
          dateTimeType: [
            {name: 'yMd', code: 'yyyy-MM-dd'},
            {name: 'yMd H:m', code: 'yyyy-MM-dd HH:mm'},
            {name: 'yMd H:m:s', code: 'yyyy-MM-dd HH:mm:ss'},
            {name: 'H:m', code: 'HH:mm'},
            {name: 'H:m:s', code: 'HH:mm:ss'}
          ]
        },
        tableHandleList: [
          {id: 1, name: '新增', code: 'addInfo'},
          {id: 2, name: '批量删除', code: 'deleteBatch'},
          {id: 3, name: '导出', code: 'export'},
          {id: 4, name: '导入', code: 'import'}
        ],
        dataInfoHandleList: [
          {id: 1, name: '编辑', code: 'edit'},
          {id: 2, name: '查看', code: 'view'},
          {id: 3, name: '删除', code: 'deleteInfo'},
          {id: 4, name: '审批', code: 'approval'},
          {id: 5, name: '提交', code: 'submit'}
        ],
        formHandleList: [
          {id: 1, name: '新增', code: 'add'},
          {id: 2, name: '更新', code: 'update'},
          {id: 3, name: '查看', code: 'view'},
          {id: 4, name: '审批', code: 'approval'},
          {id: 5, name: '提交', code: 'submit'},
          {id: 6, name: '附件', code: 'enclosure'}
        ]
      }
    },
    methods: {
      validateDb: function () {
        let _this = this
        this.loading = true
        this.FUNCTIONS.systemFunction.jsonPost(
          _this.CONFIG.urls.root + _this.CONFIG.urls.system.validateDbConnect,
          {type: null, info: _this.connectData},
          resultData => {
            _this.loading = false
            if (resultData.code === '0') {
              _this.$message({
                showClose: true,
                message: '校验通过',
                type: 'success'
              })
            } else {
              _this.$message({
                showClose: true,
                message: resultData.msg,
                type: 'warning'
              })
            }
          },
          () => {
            _this.loading = false
            _this.$message({
              showClose: true,
              message: '请求异常，请联系管理员～',
              type: 'error'
            })
          }
        )
      },
      getDbData: function () {
        let _this = this
        this.loading = true
        this.FUNCTIONS.systemFunction.jsonPost(
          _this.CONFIG.urls.root + _this.CONFIG.urls.system.getTableData,
          {type: null, info: _this.connectData},
          resultData => {
            _this.loading = false
            if (resultData.code === '0') {
              _this.tablesData = resultData.data
              if (resultData.data && resultData.data.length > 0) {
                _this.listData.tableCode = resultData.data[0].tableName
                _this.listData.tableDetail = resultData.data[0].tableName + ',' + resultData.data[0].tableFullName + ',' + resultData.data[0].tableComment + ',' + resultData.data[0].tableDb
                _this.listData.fields = resultData.data[0].fieldsData
                _this.formHandle.mainTable = resultData.data[0].tableName
                _this.formHandle.tableDetail = resultData.data[0].tableName + ',' + resultData.data[0].tableFullName + ',' + resultData.data[0].tableComment + ',' + resultData.data[0].tableDb
                _this.formHandle.mainFields = resultData.data[0].fieldsData
              }
              _this.$message({
                showClose: true,
                message: '获取成功',
                type: 'success'
              })
            } else {
              _this.$message({
                showClose: true,
                message: resultData.msg,
                type: 'warning'
              })
            }
          },
          () => {
            _this.loading = false
            _this.$message({
              showClose: true,
              message: '请求异常，请联系管理员～',
              type: 'error'
            })
          }
        )
      },
      listTabChange: function (target) {
        let _data = this.tablesData.filter(item => item.tableName === target)
        this.listData.tableDetail = _data[0].tableName + ',' + _data[0].tableFullName + ',' + _data[0].tableComment + ',' + _data[0].tableDb
        this.listData.fields = (_data && (_data.length === 1)) ? _data[0].fieldsData : []
        this.listData.showFields = [
          {filedNameCode: '', fieldSort: 1, fieldType: '', remark: ''}
        ]
        this.listData.tableHandle = []
        this.listData.infoHandle = []
      },
      generateTableFile: function () {
        this.FUNCTIONS.systemFunction.postDownFile(this, {type: 'generateVue.forTable', info: this.listData})
      },
      generateSUVDASFile: function () {
        this.FUNCTIONS.systemFunction.postDownFile(this, {type: 'generateVue.forForm', info: this.formHandle})
      },
      formMainTableChange: function (targetCode) {
        let _data = this.tablesData.filter(item => item.tableName === targetCode)
        this.formHandle.tableDetail = _data[0].tableName + ',' + _data[0].tableFullName + ',' + _data[0].tableComment + ',' + _data[0].tableDb
        this.formHandle.mainFields = (_data && (_data.length === 1)) ? _data[0].fieldsData : []
        this.formHandle.mainSelectFields = [
          {filedNameCode: '', fieldSort: 1, fieldWidth: 4, fieldType: '', remark: ''}
        ]
        this.formHandle.handleList = []
      },
      removeField: function (item) {
        let index = this.formHandle.mainSelectFields.indexOf(item)
        if (index !== -1) {
          this.formHandle.mainSelectFields.splice(index, 1)
        }
      },
      removeListField: function (item) {
        let index = this.listData.showFields.indexOf(item)
        if (index !== -1) {
          this.listData.showFields.splice(index, 1)
        }
      },
      addField: function () {
        this.formHandle.mainSelectFields.push({
          filedNameCode: '',
          fieldSort: this.formHandle.mainSelectFields.length + 1,
          fieldWidth: 4,
          fieldType: '',
          remark: ''
        })
      },
      addListField: function () {
        this.listData.showFields.push({
          filedNameCode: '',
          fieldSort: this.listData.showFields.length + 1,
          fieldType: '',
          remark: ''
        })
      }
    }
  }
</script>
