<template>
<div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="400px"
        :showCancle="false"
        @close="dialogConfig.show = false">

        <el-form :model="formData" :rules="rules" ref="formDataRef" class="login-register">
            <el-form-item prop="email">
                <el-input
                    size="large"
                    clearable
                    placeholder="请输入邮箱:"
                    v-model="formData.email"
                    maxlength="150"
                >
                    <template #prefix>
                        <span class="iconfont icon-youxiang"></span>
                    </template>
                </el-input>
            </el-form-item>
                        <!--登录密码-->
            <el-form-item prop="password" v-if="onType == 1">
                <el-input
                    size="large"
                    :type="passwordEyeType.passwordEye?'text':'password'"
                    placeholder="请输入密码:"
                    v-model="formData.password">
                    <template #prefix>
                        <span class="iconfont icon-mima2"></span>
                    </template>
                    <template #suffix>
                        <span
                            @click="eyeChange('passwordEye')"
                            :class="[
                                'iconfont',passwordEyeType.passwordEye ?
                                'icon-yanjing_xianshi':'icon-biyan'
                            ]"
                            ></span>
                    </template>
                </el-input>
            </el-form-item>

<!--            当时注册的时候才出现的功能-->
            <div v-if="onType == 0 || onType==2">
                <el-form-item prop="emailCode">
                    <div class="send-email-panel">
                        <el-input
                            size="large"
                            placeholder="请输入邮箱验证码:"
                            v-model="formData.emailCode">
                            <template #prefix>
                                <span class="iconfont icon-yanzheng"></span>
                            </template>
                        </el-input>
                        <el-button class="send-email-btn" type="primary" size="large" @click="showSendEmailDialog">获取验证码</el-button>
                    </div>
                    <el-popover placement="left" :width="450" trigger="click">
                        <div>
                            <p>1、在垃圾箱中查找邮箱验证码</p>
                            <p>2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                            <p>3、将邮箱【1634114623@qq.com】添加到白名单</p>

                        </div>
                        <template #reference>
                            <span class="a-link" :style="{'font-size':'14px'}">
                                未收到邮箱验证码？
                            </span>
                        </template>
                    </el-popover>

                </el-form-item>

                <el-form-item prop="nickName" v-if="onType==0">
                    <el-input
                        size="large"
                        clearable
                        placeholder="请输入昵称:"
                        v-model="formData.nickName">
                        <template #prefix>
                            <span class="iconfont icon-yonghu"></span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="registerPassword">
                    <el-input
                        size="large"
                        :type="passwordEyeType.registerPasswordEye?'text':'password'"
                        placeholder="请输入密码:"
                        v-model="formData.registerPassword">
                        <template #prefix>
                            <span class="iconfont icon-mima2"></span>
                        </template>
                        <template #suffix>
                            <span   @click="eyeChange('registerPasswordEye')"
                                    :class="[
                                'iconfont',passwordEyeType.registerPasswordEye ?
                                'icon-yanjing_xianshi':'icon-biyan'
                            ]"
                            >></span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="reregisterPassword">
                    <el-input
                        size="large"
                        :type="passwordEyeType.reregisterPasswordEye?'text':'password'"
                        placeholder="请再次输入密码:"
                        v-model="formData.reregisterPassword">
                        <template #prefix>
                            <span class="iconfont icon-mima2"></span>
                        </template>
                        <template #suffix>
                            <span   @click="eyeChange('reregisterPasswordEye' +
                             '' +
                              '' +
                               '')"
                                    :class="[
                                'iconfont',passwordEyeType.reregisterPasswordEye ?
                                'icon-yanjing_xianshi':'icon-biyan'
                            ]"
                            >></span>
                        </template>
                    </el-input>
                </el-form-item>
            </div>




            <el-form-item prop="checkCode">
                <div class="check-code-panel">
                    <el-input
                        size="large"
                        clearable
                        placeholder="请输入验证码:"
                        v-model="formData.checkCode">
                        <template #prefix>
                            <span class="iconfont icon-yanzheng"></span>
                        </template>
                    </el-input>
                    <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode(0)">
                </div>

            </el-form-item>

            <el-form-item v-if="onType==1">
                <div class="rememberme-panel">
                    <el-checkbox  v-model="formData.rememberMe">记住我</el-checkbox>
                </div>
                <div class="no-account">
                    <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码？</a>
                    <a href="javascript:void(0)"  class="a-link" @click="showPanel(0)">没有账号？</a>

                </div>

            </el-form-item>
            <el-form-item v-if="onType==0">
                <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有帐号？</a>
            </el-form-item>

            <el-form-item v-if="onType==2">
                <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登陆</a>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" class="btn-login" @click="doSubmit">
                    <span v-if="onType==0">注册</span>
                    <span v-if="onType==1">登录</span>
                    <span v-if="onType==2">重置密码</span>
                </el-button>
            </el-form-item>
        </el-form>




    </Dialog>

<!--    发送验证码-->
    <Dialog
        :show="dialogConfigsendEmailCode.show"
        :title="dialogConfigsendEmailCode.title"
        :buttons="dialogConfigsendEmailCode.buttons"
        width="500px"
        :showCancle="false"
        @close="dialogConfigsendEmailCode.show = false">

        <el-form
            :model="formDatasendEmailCode"
            :rules="rules"
            ref="formDatasendEmailCodeRef"
            label-width="80px">

            <el-form-item label="邮箱"  >
             {{formData.email}}
            </el-form-item>

            <el-form-item label="验证码" prop="checkCode">
                <div class="check-code-panel" >
                    <el-input
                        size="large"
                        clearable
                        placeholder="请输入验证码:"
                        v-model="formDatasendEmailCode.checkCode">
                        <template #prefix>
                            <span class="iconfont icon-yanzheng"></span>
                        </template>
                    </el-input>
                    <img :src="checkCodeUrlSendEmailCode" class="check-code" @click="changeCheckCode(1)">
                </div>
            </el-form-item>


        </el-form>


    </Dialog>

</div>
</template>

<script setup>

//接受注册还是登录的标记 0 注册  1 登录
import Dialog from "@/components/Dialog.vue";
import md5 from 'md5';
import {ref, reactive, getCurrentInstance, onMounted, nextTick} from "vue";
import {useRouter,useRoute} from "vue-router";
import store from "@/store";
import Message from "@/utils/Message";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();


const onType = ref();

const api = {
    checkCode:"/api/checkCode",
    sendMailCode:"/sendEmailCode",
    register:"/register",
    login:"/login",
    resetPwd:"/resetPwd",
};
const showPanel = (type)=>{
    onType.value = type;
    resetFrom();
};

//登陆注册表单数据
const formData = ref({});
const formDataRef = ref(null);
const dialogConfig = reactive({
    show:false,
    title:"",
});
//验证码发送表单数据
const formDatasendEmailCode = ref({});
const formDatasendEmailCodeRef = ref(null);
const dialogConfigsendEmailCode = reactive({
    show:false,
    title:"发送邮箱验证码",
    buttons:[{
        type: "primary",
        text: "发送验证码",
        click: () => {
            sendEmailCode();
        },
    }],
});
//显示发送邮件弹框
const showSendEmailDialog= ()=>{
    formDataRef.value.validateField("email",(valid)=>{
        if(!valid){
            return;
        }
        dialogConfigsendEmailCode.show = true;
        nextTick(()=>{
            changeCheckCode(1);
            formDatasendEmailCodeRef.value.resetFields();
            formDatasendEmailCode.value = {
                email:formData.value.email,
            };
        });
    });

};
//发送邮件方法
const sendEmailCode = ()=>{
  formDatasendEmailCodeRef.value.validate(async (valid)=>{
      if(!valid){
          return;
      }
      const params = Object.assign({},formDatasendEmailCode.value);
      params.type = onType.value==0?0:1;
      let result = await proxy.Request({
          url:api.sendMailCode,
          params:params,
          errorCallback:()=>{
              changeCheckCode(1);
          }
      });
      if(!result){
          return;
      }
      proxy.Message.success("验证码发送成功,请登录邮箱查看");
      dialogConfigsendEmailCode.show =false;
  });
};


//校验
const checkRePassword=(rule,value,callback)=>{
  if(value!=formData.value.registerPassword){
      callback(new Error(rule.message));
  }else {
      callback();
  }
};
const rules={
    email:[
        {request:true, message:"请输入邮箱"},
        {max:150,message: "邮箱过长"},
        {validator:proxy.Verify.email,message: "请输入正确的邮箱"},
    ],
    password:[{request:true,message:"请输入密码"}],
    nickName:[{request:true,message:"请输入昵称"}],
    emailCode:[{request:true,message:"请输入邮箱验证码"}],
    registerPassword:[{request:true,message:"请输入密码"},
        {validator:proxy.Verify.password,message: "密码含有八个字符，至少一个字母，一个数字和一个特殊字符："}
    ],
    reregisterPassword:[{request:true,message:"请再次输入密码"},
        {validator:checkRePassword,message: "两次输入的密码不一致"}
    ],
    checkCode:[{request:true,message:"请输入图片验证码"}],
}




//验证码
const checkCodeUrl = ref(api.checkCode);
const checkCodeUrlSendEmailCode=ref(api.checkCode)

//验证码切换
const changeCheckCode = (type)=>{
    if(type==0){
        checkCodeUrl.value=api.checkCode+"?type"+type+"&time"+new Date().getTime();
    }else {
        checkCodeUrlSendEmailCode.value=api.checkCode+"?type"+type+"&time"+new Date().getTime();

    }

}

defineExpose({showPanel});


//密码显示隐藏操作
const passwordEyeType = reactive({
    passwordEye:false,
    registerPasswordEye:false,
    reregisterPasswordEye:false,
});

const eyeChange = (type)=>{
    passwordEyeType[type]=!passwordEyeType[type];

};
//表单重置
const resetFrom=()=>{
    dialogConfig.show=true;
    if(onType.value===0){
        dialogConfig.title="注册";
    }else if(onType.value === 1){
        dialogConfig.title="登录";
    }else if(onType.value === 2){
        dialogConfig.title="重置密码";
    }
    nextTick(()=>{
        changeCheckCode(0);
        formDataRef.value.resetFields();
        formData.value={};

        if(onType.value==1){
            const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
            if(cookieLoginInfo){
                formData.value = cookieLoginInfo;
            }
        }

    })
};


//登陆注册以及重置密码
const doSubmit = ()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return;
        }
        let params={};
        Object.assign(params,formData.value);
        //注册
        if(onType.value==0||onType.value==2){
            params.password=params.registerPassword;
        }
        if(onType.value==1){
            let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
            let cookiePassword = cookieLoginInfo ? cookieLoginInfo.password : null;
            if(params.password!=cookiePassword){
                params.password = md5(params.password);
            }
        }

        let url = null;
        if(onType.value==0){
            url = api.register;
        }else if(onType.value==1){
            url = api.login;
        }else if(onType.value==2){
            url = api.resetPwd;
        }
        let result = await proxy.Request({
            url:url,
            params:params,
            errorCallback:()=>{
                changeCheckCode(0);
            },
        });
        if(!result){
            return;
        }
        if(onType.value==0){
            proxy.Message.success("注册成功,请登录");
            showPanel(1);
        }else if(onType.value==1){
            if(params.rememberMe){
                const loginInfo ={
                    email:params.email,
                    password:params.password,
                    rememberMe:params.rememberMe,
                };
                proxy.VueCookies.set("loginInfo",loginInfo,"7d");
            }else {
                proxy.VueCookies.remove("loginInfo");
            }
            dialogConfig.show =false;
            proxy.Message.success("登陆成功");
            store.commit("updateLoginUserInfo",result.date)

        }else if(onType.value==2){
            proxy.Message.success("重置密码成功,请登录");
            showPanel(1);
        }

    });
};

</script>

<style lang="scss" scoped>
.login-register{
    .send-email-panel{
        display: flex;
        width: 100%;
        justify-content: space-between;
        .send-email-btn{
            margin-left: 5px;
        }
    }

    .rememberme-panel{
        width: 100%;
    }
    .no-account{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .btn-login{
        width: 100%;
    }


}

.check-code-panel{
    display: flex;
    width: 100%;
    justify-content: space-between;
    .check-code{
        margin-left: 5px;
        cursor: pointer;
    }

}

.el-form-item{
    align-items: center;
}

</style>