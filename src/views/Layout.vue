<template>
<div>
<Head></Head>


                    <div class="body-content">
                        <router-view/>
                    </div>




<!--    登陆注册-->
    <LoginAndRegister ref="loginRegisterRef">

    </LoginAndRegister>



</div>

</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import Dialog from "@/components/Dialog.vue";
import LoginAndRegister from "@/views/LoginAndRegister.vue";
import store from "@/store";
import Avatar from "@/components/Avatar.vue";
import Head from "@/views/Head.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();

const api ={
    getUserInfo:"/getUserInfo",
    loadBoard:"/board/loadBoard"
};
//显示与隐藏头部导航栏
const showHeader = ref(true);
//获取滚动
const getScrollTop = ()=>{
    let scrollTop = document.documentElement.scrollTop ||
        window.pageYOffset || document.body.scrollTop;
    return scrollTop;
};
//初始化滚动
const initScroll = ()=>{
    let initScrollTop = getScrollTop();
    let scrollType = 0;
    window.addEventListener("scroll",()=>{
        let currentScrollTop = getScrollTop();
        if(currentScrollTop>initScrollTop){
            scrollType = 1;
        }else {
            scrollType = 0;
        }
        initScrollTop = currentScrollTop;
        if(scrollType == 1 && currentScrollTop>90){
            showHeader.value = false;
        }else {
            showHeader.value = true;
        }
    })
};

const getUserInfo= async ()=>{
    let result = await proxy.Request({
        url:api.getUserInfo
    });
    if(!result){
        return;
    }
    store.commit("updateLoginUserInfo",result.data);
};

const myPopover = ref(null);
onMounted(()=>{
    initScroll();
    getUserInfo();

}

);

//获取板块信息
const boardList =ref({});

const loadBoard = async ()=>{
    let result = await proxy.Request({
        url:api.loadBoard,
    });
    if(!result){
        return;
    };
    boardList.value = result.data;
    store.commit("saveBoardList",result.data);
};
loadBoard();

//监听登陆后的用户信息
const userInfo = ref({});
watch(()=>store.state.loginUserInfo,
    (newVal,oldVal)=>{
    if(newVal!=undefined&&newVal!=null){
        userInfo.value = newVal;
    }else {
        userInfo.value = {};
    }
    },
    {immediate:true,deep:true}
);

watch(()=>store.state.showLogin,
    (newVal,oldValue)=>{
    if(newVal){
        loginAndRegister(1);
    }
    },{immediate:true,deep:true});

//登陆注册功能
const loginRegisterRef = ref();

const loginAndRegister = (type)=>{
    loginRegisterRef.value.showPanel(type);
}

const activePBoardId = ref(0);
watch(
    ()=>store.state.activePBoardId,
    (newVal,oldValue)=>{
        if(newVal!=0){
            activePBoardId.value = newVal;
        }
    },
    {immediate:true,deep:true}
);

const activeBoardId = ref(0);
watch(
    ()=>store.state.activeBoardId,
    (newVal,oldValue)=>{
            activeBoardId.value = newVal;
    },
    {immediate:true,deep:true}
);



//Zblog的logo
const logoInfo = ref([
    {letter:"Z",
    color: "rgb(50, 133, 255)",
    },
    {letter:"b",
        color: "rgb(251, 54, 36)",
    },
    {letter:"l",
        color: "rgb(255, 186, 2)",
    },
    {letter:"o",
        color: "rgb(50, 133, 255)",
    },
    {letter:"g",
        color: "color: rgb(37, 178, 78)",
    },
]);

//一级模块点击事件
const boardClickHandler=(board)=>{
router.push(`/forum/${board.board_id}`);

};

//二级模块点击事件
const subBoardClickHandler = (subBoard)=>{
    router.push(`/forum/${subBoard.p_board_id}/${subBoard.board_id}`);
};


</script>

<style lang="scss" scoped>

.el-header{
  padding: 0px;
}

.body-content{
  margin: 65px 0px auto auto;
}


</style>
