<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @closed="closeDialog" :destroy-on-close="true">
    <el-form :inline="true" :model="form" ref="formData" label-width="100px">
      <el-form-item label="区划" label-width="70px" v-loading="loading">
        <cascader
          :set-props="setProps"
          ref="cascaderTemplete"></cascader>
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
      <el-button @click="cancelClick">取 消</el-button>
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
                name: '肥西县',
                children: [
                    {
                        code: '100000',
                        name: '大王镇',
                        children: [
                            {
                                code: '112',
                                name: '小王村'
                            }, {
                                code: '1001',
                                name: '德庄'
                            }, {
                                code: '1002',
                                name: '先林'
                            }
                        ]
                    }, {
                        code: '333',
                        name: '东西镇',
                        children: [
                            {
                                code: '543',
                                name: '觉得村'
                            }
                        ]
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
      },
      methods: {
          closeDialog: function () {
              this.form = {}
          },
          open: function (type, rowData) {
              let _this = this
              _this.type = type
              _this.dialogFormVisible = true
              if (type === 'add') {
                  _this.dialogTitle = '新建村民档案'
              } else if (type === 'edit') {
                  _this.dialogTitle = '编辑村民档案'
                  _this.form = rowData
                  // 调用级联组建内 init 方法重组默认值
                  setTimeout(function () {
                      _this.$refs.cascaderTemplete.init(_this.form.villageCode)
                  }, 100)
              }
          },
          // 取消按钮
          cancelClick: function () {
              this.dialogFormVisible = false
          },
          // 确定按钮
          makesure: function () {
              let temp = this.$refs.cascaderTemplete.sendToParent('value')
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
                      debugger
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
                      delete params.orgName
                      let _this = this
                      debugger
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
          }
      }
  }
</script>
