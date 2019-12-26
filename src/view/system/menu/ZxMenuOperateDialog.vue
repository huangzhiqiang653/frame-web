<!--zx_frame_db.auth_zx_menu（菜单表）-dialog-->
<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
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
        <el-col :span="24">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="formData.name" placeholder="名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="编码：" prop="code">
            <el-input v-model="formData.code" placeholder="编码" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型：" prop="menuType">
            <el-select v-model="formData.menuType"
                       placeholder="类型"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.menuType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图标：" prop="icon">
            <el-select v-model="formData.icon"
                       placeholder="图标"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.menuIcon" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序：" prop="sort">
            <el-input-number
              v-model="formData.sort"
              placeholder="排序"
              :min="0"
              :precision="2"
              :step="1"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址：" prop="url">
            <el-input v-model="formData.url" placeholder="地址" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formData.remark" placeholder="备注" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
        <el-button type="primary" @click="saveOrUpdateForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存
        </el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    name: 'ZxMenuOperateDialog',
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
        formData: {
          id: '',
          name: '',
          code: '',
          menuType: '',
          icon: '',
          sort: '',
          url: '',
          remark: ''
        },
        // 校验规则
        formRules: {
          name: [],
          code: [],
          menuType: [],
          icon: [],
          sort: [],
          url: [],
          remark: []
        },
        // 字典数据
        dictionary: {
          menuType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.menuType))),
          menuIcon: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.menuIcon)))
        },
        editableFlag: true,
        loading: false,
        showTitle: '新增',
        showFlag: false
      }
    },
    methods: {
      init: function (type, id) {
        this.formData = {
          id: '',
          name: '',
          code: '',
          menuType: '',
          icon: '',
          sort: '',
          url: '',
          remark: ''
        }
        let _title = ''
        if (type === 'add') {
          _title = '新增'
        } else if (type === 'edit') {
          _title = '编辑'
        } else if (type === 'view') {
          _title = '查看'
          this.editableFlag = false
        }
        this.showTitle = this.showTitle || _title
        this.showFlag = true
        if (id) {
          this.formData.id = id
          this.getInfo()
        }
      },
      closeDialog: function () {
        this.showFlag = false
      },
      saveOrUpdateForm: function () {
        this.formData.id ? this.updateForm() : this.saveForm()
      },
      saveForm: function () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let params = this.formData
            // 参数处理======start==========
            // TODO 对于单选、复选、多选、附件等需要进行单独处理
            // 参数处理======end============
            let _this = this
            _this.loading = true
            this.FUNCTIONS.systemFunction.interactiveData(
              _this,
              _this.GLOBAL.config.businessFlag.zxMenu,
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
          } else {
            this.$message.error('校验失败～')
            return false
          }
        })
      },
      updateForm: function () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let params = this.formData
            // 参数处理======start==========
            // TODO 对于单选、复选、多选、附件等需要进行单独处理
            // 参数处理======end============
            let _this = this
            _this.loading = true
            this.FUNCTIONS.systemFunction.interactiveData(
              _this,
              _this.GLOBAL.config.businessFlag.zxMenu,
              _this.GLOBAL.config.handleType.updateAll,
              _this.FUNCTIONS.systemFunction.removeNullFields(params),
              null,
              resultData => {
                _this.loading = false
                if (resultData) {
                  _this.$message.success('修改成功～')
                  _this.showFlag = false
                  _this.$props.refresh && this.$props.refresh('init')
                } else {
                  _this.$message.warning('修改失败～')
                }
              },
              () => {
                _this.loading = false
              })
          } else {
            this.$message.error('校验失败～')
            return false
          }
        })
      },
      getInfo: function () {
        let _this = this
        this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.zxMenu,
          _this.GLOBAL.config.handleType.getInfoById,
          _this.formData.id,
          null,
          resultData => {
            _this.loading = false
            Object.assign(_this.formData, resultData)
          }
        )
      }
    }
  }
</script>
