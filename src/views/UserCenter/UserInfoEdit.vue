<template>
    <Dialog
            :show="dialogConfig.show"
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
             width="400px"
             :showCancel="false"
             @close="dialogConfig.show = false">
        <el-form
                :model="formData"
                :rules="rules"
                ref="formDataRef"
                label-width="60px"
                >
            <el-form-item label="昵称" prop="nickName" >
                 {{formData.nick_name}}
            </el-form-item>
            <el-form-item label="头像" prop="avatar" >
                <CoverUpload :imageUrlPrefix="proxy.globalInfo.avatarUrl" v-model="formData.avatar"></CoverUpload>
            </el-form-item>
            <el-form-item label="性别" prop="sex" >
                <el-radio-group v-model="formData.sex">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="简介" prop="person_description" >
                <el-input
                    clearable
                    type="textarea"
                    placeholder="请输入简介"
                    :rows="5"
                    maxlength="100"
                    resize="none"
                    show-word-limit
                    v-model="formData.person_description"
                >
                {{formData.person_description}}
                </el-input>
            </el-form-item>
        </el-form>
  </Dialog>
</template>

<script setup>
import {nextTick, reactive} from "vue";
import { ref, getCurrentInstance} from "vue";
import {useRouter, useRoute} from "vue-router"
import CoverUpload from "@/components/CoverUpload.vue";
const { proxy}= getCurrentInstance();
const router =useRouter();
const route =useRoute();

const api = {
    updateUserInfo: '/ucenter/updateUserInfo',
}

const dialogConfig = reactive({
    show: false,
    title: '编辑个人信息',
    buttons: [
        {
            text: '确定',
            type: 'primary',
            click: () => {
                updateUserInfoHandler();
            }
        }
    ]
})
const formData = ref([]);
const formDataRef = ref();
const showEditUserInfoDialog = (userInfo)=>{
    dialogConfig.show = true;
    nextTick((()=>{
        formDataRef.value.resetFields();
        const dataInfo = JSON.parse(JSON.stringify(userInfo));
        dataInfo.avatar ={
            imageUrl:dataInfo.user_id,
        };
        formData.value = dataInfo;
    }))
};
defineExpose({showEditUserInfoDialog});


const emit = defineEmits(["resetUserInfo"])
const updateUserInfoHandler = ()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return;
        }
        let params = {};
        Object.assign(params,formData.value);
        let result = await proxy.Request({
            url:api.updateUserInfo,
            params,
        });
        if(!result){
            return;
        }
        dialogConfig.show =false;
        if(params.avatar instanceof File){
            router.go(0);
        }else {
            emit('resetUserInfo',params)
        }
    })
};

</script>

<style scoped lang="scss">

</style>
