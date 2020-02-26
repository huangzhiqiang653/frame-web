<!--zx_rts_db.t_rt_config（配置表）-dialog-->
<template>
  <el-dialog :title="showTitle" :visible.sync="showFlag">
    <el-divider content-position="center">报修信息分派</el-divider>
    <el-table style="width: 100%"
              :data="tableData" border>
      <el-table-column prop="index" label="序号" align="center" width="50"/>
      <el-table-column prop="name" label="人员姓名" align="center" width="180"/>
      <el-table-column prop="tel" label="手机号码" align="center" width="180"/>
      <el-table-column prop="todo" align="center" label="待处理报修"/>
      <el-table-column prop="scope" label="操作" align="center">
        <template slot-scope="scope">
                 <span class="el-dropdown-link operator-text">分派</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="margin-top-20">
      <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
      <el-button v-if="editableFlag" type="primary" @click="saveOrUpdateForm" style="margin: 0 20px;"
                 :size="GLOBAL.config.systemSize">保存
      </el-button>
    </el-row>
  </el-dialog>
</template>
<script>export default {
    name: 'assign',
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
            tableData: [
                {
                    index: '1',
                    name: '小张',
                    tel: '1352698',
                    todo: '111'
                }
            ],
            // 校验规则
            formRules: {
                name: [],
                tel: [],
                todo: []
            },
            // 字典数据
            dictionary: {},
            editableFlag: true,
            loading: false,
            showTitle: '',
            showFlag: false
        }
    },
    methods: {
        init: function (type, id) {
            let _title = ''
            if (type === 'bell') {
                this.editableFlag = false
                /* if (id.type === '0') {
                    _title = '报修信息分派'
                } else if (id.type === '1') {
                    _title = '报抽信息分派'
                } */
            }
            this.showTitle = _title
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
        getInfo: function () {
            let _this = this
            this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
                _this,
                _this.GLOBAL.config.businessFlag.config,
                _this.GLOBAL.config.handleType.getInfoById,
                _this.formData.id,
                null,
                resultData => {
                    _this.loading = false
                    Object.assign(_this.tableData, resultData)
                }
            )
        }
    }
}
</script>
