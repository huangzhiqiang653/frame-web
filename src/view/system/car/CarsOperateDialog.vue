<!--zx_rts_db.t_rt_cars（车辆表）-dialog-->
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
                v-loading="loading">
            <el-row class="margin-top-20">
                <el-col :span="4">
                    <el-form-item label="所属乡镇编码：" prop="townCode">
                        <el-input v-model="formData.townCode" placeholder="所属乡镇编码" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="所属村居编码：" prop="villageCode">
                        <el-input v-model="formData.villageCode" placeholder="所属村居编码" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车牌号：" prop="carNo">
                        <el-input v-model="formData.carNo" placeholder="车牌号" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="margin-top-20">
            <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
        </el-row>
    </el-dialog>
</template>
<script>export default {
        name: 'cars',
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
                    townCode: '',
                    villageCode: '',
                    carNo: '',
                },
                // 校验规则
                formRules: {
                    townCode: [],
                    villageCode: [],
                    carNo: [],
                },
                // 字典数据
                dictionary: {
                },
                loading: false,
                showTitle: '新增',
                showFlag: false
            }
        },
        methods: {
            init: function (type, id) {
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
        }
    }
</script>
