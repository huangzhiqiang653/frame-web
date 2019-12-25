<template>
  <el-drawer
    :title="'字典【' +info.name + '(' +info.code + ')】明细'"
    :visible.sync="drawer"
    direction="ltr"
    size="70%"
    :before-close="handleClose">
    <div style="margin-left: 20px">
      <el-row class="margin-top-20">
        <el-col :span="24">
          <el-button type="primary"
                     icon="el-icon-plus"
                     :size="GLOBAL.config.systemSize"
                     style="float: left;"
                     @click="operationMethod('add')">新增
          </el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     :size="GLOBAL.config.systemSize"
                     style="float: left;"
                     :disabled="deleteBatchList.ids.length === 0"
                     @click="deleteBatch">批量删除
          </el-button>
        </el-col>
      </el-row>
      <el-table style="width: 100%"
                :data="tableData"
                @selection-change="tableSelectionChange"
                element-loading-text="数据处理中...请稍等..."
                v-loading="loading">
        <el-table-column
          type="selection">
        </el-table-column>
        <!--名称-->
        <el-table-column prop="id" label="主键" align="center" width="300"/>
        <!--名称-->
        <el-table-column prop="name" label="名称" align="center"/>
        <!--编码-->
        <el-table-column prop="code" label="编码" align="center"/>
        <!--排序-->
        <el-table-column prop="sort" label="排序" align="center"/>
        <el-table-column prop="scope" label="操作" align="center">
          <template slot-scope="scope">
          <span @click="handleEdit(scope.row)" class="operation-normal">
            <i class="el-icon-edit"></i>
            编辑
          </span>
            <span @click="handleDelete(scope.row)" class="operation-normal">
            <i class="el-icon-delete"></i>
            删除
          </span>
          </template>
        </el-table-column>
      </el-table>
      <!--操作-->
      <operationTemplate ref="operationTemplate" :refresh="getTableData"/>
    </div>
  </el-drawer>
</template>
<script>
  // 替换成相应的模板
  import operationTemplate from './ZxDictionaryOperateDialogNormal'

  export default {
    name: 'ZxDictionaryTableNormal',
    props: {
      refresh: {
        type: Function
      }
    },
    data () {
      return {
        info: {},
        drawer: false,
        tableData: [],
        // 字典数据
        dictionary: {
          type:
            JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.type)))
        },
        operationVisibleFlag: false,
        deleteBatchList: {
          ids: [],
          deleteFlag: false
        },
        loading: false
      }
    },
    components: {
      operationTemplate
    },
    methods: {
      init: function (info) {
        this.info = info
        this.getTableData()
        this.drawer = true
      },
      operationMethod: function (operateType, info) {
        this.$refs.operationTemplate.init(operateType, info ? info.id : null, this.info)
      },
      deleteBatch: function () {
        let _this = this
        _this.$confirm('确认删除当前选择' +
          '的' + _this.deleteBatchList.ids.length + '条数据？？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.loading = true
          _this.FUNCTIONS.systemFunction.interactiveData(
            _this,
            _this.GLOBAL.config.businessFlag.zxDictionary,
            _this.GLOBAL.config.handleType.deleteLogicalBatch,
            _this.deleteBatchList.ids,
            'list',
            resultData => {
              _this.loading = false
              if (resultData) {
                _this.$message.success('删除成功～')
                _this.getTableData('init')
              } else {
                _this.$message.warning('删除失败～')
              }
            }
          )
        })
      },
      getSource: function (rowData) {
        let tempList = []
        tempList.push({icon: 'el-icon-edit', title: '编辑', method: 'handleEdit'})
        tempList.push({icon: 'el-icon-delete', title: '删除', method: 'handleDelete'})
        return tempList
      },
      // 编辑
      handleEdit: function (rowData) {
        this.operationMethod('edit', rowData)
      },
      // 单条数据删除
      handleDelete: function (rowData) {
        let _this = this
        _this.$confirm('确认删除当前数据？？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.loading = true
          _this.FUNCTIONS.systemFunction.interactiveData(
            _this,
            _this.GLOBAL.config.businessFlag.zxDictionary,
            _this.GLOBAL.config.handleType.deleteLogical,
            rowData.id,
            null,
            resultData => {
              _this.loading = false
              if (resultData) {
                _this.$message.success('删除成功～')
                _this.getTableData('init')
              } else {
                _this.$message.warning('删除失败～')
              }
            }
          )
        })
      },
      // 获取列表
      getTableData: function (initPageFlag) {
        this.loading = true
        let _this = this
        // 3、 调接口获取数据
        _this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.zxDictionary,
          _this.GLOBAL.config.handleType.getListByCondition,
          {'parentCode': _this.info.code},
          null,
          resultData => {
            _this.loading = false
            if (resultData) {
              _this.tableData = resultData
            } else {
              _this.$message.warning('获取列表数据失败～')
            }
          },
          () => {
            _this.loading = false
          }
        )
      },
      // 复选框选择事件
      tableSelectionChange: function (targetList) {
        let ids = []
        targetList.forEach(item => {
          ids.push(item.id)
        })
        this.deleteBatchList.ids = ids
        if (this.deleteBatchList.ids &&
          this.deleteBatchList.ids.length > 0) {
          this.deleteBatchList.deleteFlag = true
        } else {
          this.deleteBatchList.deleteFlag = false
        }
      },
      // 关闭
      handleClose: function () {
        this.drawer = false
      }
    }
  }
</script>
