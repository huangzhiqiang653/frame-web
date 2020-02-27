<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :destroy-on-close="true">
    <el-form :inline="true" :model="form" ref="formData" label-width="100px">
      <el-form-item label="区划" label-width="70px" v-loading="loading">
        <cascader
          :set-props="setProps"
          :set-options="options"
          :set-data-type="'value'"
          :val="form.villageCode"
          @getValue="getValue"
          ref="cascaderTemplete"></cascader>
<!--        <el-input v-model="form.area" placeholder="请选择区划"></el-input>-->
      </el-form-item>
      <el-form-item label="户主姓名" prop="name" label-width="70px">
        <el-input v-model="form.name" placeholder="请输入户主姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber" label-width="70px">
        <el-input v-model="form.phoneNumber" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address" label-width="70px">
        <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="makesure">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
    import cascader from '../../../components/Cascader'
  export default {
      name: 'VillagerAddDialog',
      props: {
          dialogVisible: {
              type: Boolean
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
            dialogTitle: '',
            dialogFormVisible: false,
            loading: false,
            form: {
                villageCode: '',
                name: '',
                phoneNumber: '',
                address: ''
            },
            tempValue: '',
            options: [{
                code: '111',
                name: '测试1',
                children: [
                    {
                        code: '100000',
                        name: 'ceshi'
                    }, {
                        code: '333',
                        name: 'jksld'
                    }
                ]
            }],
            setProps: {
                multiple: false, // 多选
                checkStrictly: true, // 父节点取消选中关联
                value: 'code',
                label: 'name',
                children: 'children',
                leaf: 'leaf'
            },
            type: ''
        }
      },
      components: {
          cascader
      },
      mounted () {
          this.getAreaData()
      },
      methods: {
          getValue: function (value) {
              console.log(value)
          },
          open: function (type, rowData) {
              this.type = type
              if (type === 'add') {
                  this.dialogTitle = '新建村民档案'
              } else if (type === 'edit') {
                  this.dialogTitle = '编辑村民档案'
                  this.form = rowData
              }
              this.dialogFormVisible = true
          },
          // 确定按钮
          makesure: function () {
              let temp = this.$refs.cascaderTemplete.sendToParent()
              this.form.villageCode = temp
              if (this.type === 'add') {
                  this.addVillager()
              } else {
                  this.updateVillager()
              }
          },
          // 新增村民
          addVillager: function () {
              this.$refs.formData.validate(valid => {
                  if (valid) {
                      let params = this.form
                      let _this = this
                      _this.loading = true
                      this.FUNCTIONS.systemFunction.interactiveData(
                          _this,
                          _this.GLOBAL.config.businessFlag.rtUser,
                          _this.GLOBAL.config.handleType.add,
                          _this.FUNCTIONS.systemFunction.removeNullFields(params),
                          null,
                          resultData => {
                              _this.dialogFormVisible = false
                              _this.loading = false
                              if (resultData) {
                                  // Object.assign(_this.formData, resultData)
                                  _this.refresh && _this.refresh()
                                  _this.$message.success('新增成功～')
                              } else {
                                  _this.$message.warning('新增失败～')
                              }
                          },
                          () => {
                              _this.dialogFormVisible = false
                              _this.loading = false
                              console.log('失败')
                          })
                  } else {
                      this.$message.error('校验失败～')
                      return false
                  }
              })
          },
          // 编辑村民
          updateVillager: function () {
              this.$refs.formData.validate(valid => {
                  if (valid) {
                      let params = this.form
                      let _this = this
                      _this.loading = true
                      this.FUNCTIONS.systemFunction.interactiveData(
                          _this,
                          _this.GLOBAL.config.businessFlag.rtUser,
                          _this.GLOBAL.config.handleType.updateAll,
                          _this.FUNCTIONS.systemFunction.removeNullFields(params),
                          null,
                          resultData => {
                              _this.dialogFormVisible = false
                              _this.loading = false
                              if (resultData) {
                                  _this.$message.success('修改成功～')
                              } else {
                                  _this.$message.warning('修改失败～')
                              }
                          },
                          () => {
                              _this.dialogFormVisible = false
                              _this.loading = false
                              console.log('失败')
                          })
                  } else {
                      this.$message.error('校验失败～')
                      return false
                  }
              })
          },
          // 请求区划数据
          getAreaData: function () {
              console.log('111111')
              debugger
              let _this = this
              _this.FUNCTIONS.systemFunction.interactiveData(
                  _this,
                  _this.GLOBAL.config.businessFlag.rtOrganization,
                  _this.GLOBAL.config.handleType.getTree,
                  null,
                  null,
                  resultData => {
                      if (resultData) {
                          _this.options = resultData
                          console.log(_this.options)
                      } else {
                          _this.$message.warning('获取区划数据失败～')
                      }
                  }
              )
          }
      }
  }
</script>
