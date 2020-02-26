<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :destroy-on-close="true">
    <el-form :inline="true" :model="form" label-width="100px">
      <el-form-item label="区划" prop="area" label-width="70px">
        <cascader :set-props="setProps" :set-options="options" :set-data-type="'value'" ref="cascaderTemplete"></cascader>
<!--        <el-input v-model="form.area" placeholder="请选择区划"></el-input>-->
      </el-form-item>
      <el-form-item label="户主姓名" prop="name" label-width="70px">
        <el-input v-model="form.name" placeholder="请输入户主姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="tel" label-width="70px">
        <el-input v-model="form.tel" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address" label-width="70px">
        <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureClick">确 定</el-button>
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
            form: {
                area: '',
                name: '',
                tel: '',
                address: ''
            },
            options: [{
                value: '111',
                label: '测试1',
                children: [
                    {
                        value: '222',
                        label: 'ceshi'
                    }, {
                        value: '333',
                        label: 'jksld'
                    }
                ]
            }],
            setProps: {
                multiple: true, // 多选
                checkStrictly: true, // 父节点取消选中关联
                value: 'value',
                label: 'label',
                children: 'children',
                leaf: 'leaf'
            },
        }
      },
      components: {
          cascader
      },
      methods: {
          sureClick: function () {
              let temp = this.$refs.cascaderTemplete.sendToParent()
              console.log(temp)
              this.dialogFormVisible = false
          },
          open: function (type) {
              if (type === 'add') {
                  this.dialogTitle = '新建村民档案'
              } else if (type === 'edit') {
                  this.dialogTitle = '编辑村民档案'
              }
              this.dialogFormVisible = true
          }
      }
  }
</script>
