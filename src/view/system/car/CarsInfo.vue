<template>
    <div class="main-area">
        <el-page-header @back="goBack" content="cars"></el-page-header>
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
            <el-row class="margin-top-20">
                <el-button @click="goBack" style="float: right;margin: 0 20px;" :size="GLOBAL.config.systemSize">关闭</el-button>
                    <el-button v-if="editableFlag" type="primary" @click="saveOrUpdateForm" style="margin: 0 20px;" :size="GLOBAL.config.systemSize">保存
                    </el-button>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'OperationAdd',
        props: {
            id: {
                type: String,
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

                },
                //校验规则
                formRules: {

                },
                // 字典数据
                dictionary: {
                },
                costDisabledInput:true,
                outsideLawyerYes:false,
                loading: false,
                editableFlag: false
            }
        },
        mounted () {
            this.init()
        },
        components: {

        },
        methods: {
            init: function () {
                console.log(this.$router.params.id)
            },
            goBack: function () {
                this.$router.go(-1)
            },
            saveForm: function () {
                this.$refs.formData.validate(valid => {
                    if (valid) {
                        let params = this.formData
                        // 参数处理======start==========
                        ////////// 1、诉求，多选
                        if (params.appeal && params.appeal.length > 0) {
                            params.appeal = params.appeal.join(',')
                        }

                        delete params.filesCache
                        // 参数处理======end============

                        let _this = this
                        _this.loading = true

                        this.FUNCTIONS.systemFunction.interactiveData(
                            _this,
                            _this.GLOBAL.config.businessFlag.case,
                            _this.GLOBAL.config.handleType.add,
                            _this.FUNCTIONS.systemFunction.removeNullFields(this.formData),
                            null,
                            resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$props.closeSelf && _this.$props.closeSelf()
                                _this.$props.refresh && _this.$props.refresh()
                                _this.$message.success('保存成功～')
                            } else {
                                _this.$message.warning('保存失败～')
                            }
                        }
                    )
                    } else {
                        this.$message.error('校验失败～')
                        return false
                    }
                })
            },
        }
    }
</script>
