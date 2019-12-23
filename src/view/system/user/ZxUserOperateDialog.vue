<!--zx_frame_db.auth_zx_user（用户表）-dialog-->
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
                <el-col :span="8">
                    <el-form-item label="姓名：" prop="userName">
                        <el-input v-model="formData.userName" placeholder="姓名" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="性别：" prop="sex">
                        <el-radio-group
                                v-model="formData.sex"
                                placeholder="性别">
                            <el-radio
                                    v-for="item in dictionary.sex"
                                    :label="item.code"
                                    :key="item.id">{{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出生年月日：" prop="birthDay">
                        <el-date-picker
                                style="width: 100%"
                                v-model="formData.birthDay"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择出生年月日：" prop="birthDay">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="头像地址：" prop="headUrl">
                        <el-input v-model="formData.headUrl" placeholder="头像地址" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属机构：" prop="organizationId">
                        <el-input v-model="formData.organizationId" placeholder="所属机构" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="formData.email" placeholder="邮箱" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码：" prop="phoneNumber">
                        <el-input v-model="formData.phoneNumber" placeholder="手机号码" maxlength="64"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户状态：" prop="status">
                        <el-switch
                                style="float: left;"
                                v-model="formData.status"
                                inactive-color="#13ce66"
                                active-color="#ececec"
                                active-value="dictionary.status[0].code"
                                inactive-value="dictionary.status[1].code"
                                active-text="dictionary.status[0].name"
                                inactive-text="dictionary.status[1].name"
                        >
                        </el-switch>
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
                <el-button type="primary" @click="saveForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存</el-button>
                <el-button type="primary" @click="updateForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存修改</el-button>
            </el-row>
        </el-form>
    </div>
</template>
<script>export default {
        name: 'zxUser',
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
                    userName: '',
                    sex: '',
                    birthDay: '',
                    headUrl: '',
                    organizationId: '',
                    email: '',
                    phoneNumber: '',
                    status: '',
                    remark: '',
                },
                // 校验规则
                formRules: {
                    userName: [],
                    sex: [],
                    birthDay: [],
                    headUrl: [],
                    organizationId: [],
                    email: [],
                    phoneNumber: [],
                    status: [],
                    remark: [],
                },
                // 字典数据
                dictionary: {
                    sex: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.sex))),
                    status: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.status))),
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
                            _this.GLOBAL.config.businessFlag.zxUser,
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
                            _this.GLOBAL.config.businessFlag.zxUser,
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
                    _this.GLOBAL.config.businessFlag.zxUser,
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
