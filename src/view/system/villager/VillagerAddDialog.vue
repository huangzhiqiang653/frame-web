<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :destroy-on-close="true">
    <el-form :model="form">
      <el-form-item label="区划" prop="area">
        <el-input v-model="form.area" placeholder="请选择区划" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="户主姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入户主姓名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="form.tel" placeholder="请输入手机号码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
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
            }
        }
      },
      methods: {
          open: function (type) {
              if (type === 'add') {
                  this.dialogTitle = '新建村民档案'
              }
              this.dialogFormVisible = true;
          }
      }
  }
</script>
