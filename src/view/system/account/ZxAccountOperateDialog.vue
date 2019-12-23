<!--zx_frame_db.auth_zx_account（账户表）-dialog-->
<template>
    <div class="main-area">
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
                <el-col :span="4">
                    <el-form-item label="账户名称：" prop="accountName">
                        <el-input v-model="formData.accountName" placeholder="账户名称" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="margin-top-20">
                <el-button @click="closeDialog" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
                <el-button type="primary" @click="saveForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存</el-button>
                <el-button type="primary" @click="updateForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存修改</el-button>
            </el-row>
        </el-form>
    </div>
</template>
<script>export default {
        name: 'zxAccount',
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
                    accountName: '',
                },
                // 校验规则
                formRules: {
                    accountName: [],
                },
                // 字典数据
                dictionary: {
                },
                editableFlag: true,
                loading: false
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init: function () {
                this.getInfo()
            },
            closeDialog: function () {
                this.$props.closeSelf && this.$props.closeSelf()
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
                            _this.GLOBAL.config.businessFlag.zxAccount,
                            _this.GLOBAL.config.handleType.add,
                            _this.FUNCTIONS.systemFunction.removeNullFields(params),
                            null,
                            resultData => {
                                _this.loading = false
                                if (resultData) {
                                    _this.$message.success('保存成功～')
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
                            _this.GLOBAL.config.businessFlag.zxAccount,
                            _this.GLOBAL.config.handleType.updateAll,
                            _this.FUNCTIONS.systemFunction.removeNullFields(params),
                            null,
                            resultData => {
                                _this.loading = false
                                if (resultData) {
                                    _this.$message.success('修改成功～')
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
                    _this.GLOBAL.config.businessFlag.zxAccount,
                    _this.GLOBAL.config.handleType.getInfoById,
                    _this.formData.id,
                    null,
                    resultData => {
                        _this.loading = false
                        Object.assign(_this.formData, resultData)
                    }
                )
            },
        }
    }
</script>
