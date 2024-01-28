<template>
<div>
<Head></Head>

                    <div class="body-content">
                        <router-view/>
                    </div>




</div>

</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import store from "@/store";
import Head from "@/views/Head.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();

const api ={
    getUserInfo:"/getUserInfo",
    loadBoard:"/board/loadBoard",
    getSysSetting:"/getSysSetting"
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
    loadSysSetting();

}

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


//获取系统配置
const loadSysSetting = async ()=>{
    let result = await proxy.Request({
        url:api.getSysSetting,
    });
    if(!result){
        return;
    }
    store.commit("setSysSetting",result.data);
};

</script>

<style lang="scss" scoped>



.body-content{
  margin: 65px 0px auto auto;
  background: linear-gradient(180deg, #f0f8ff, rgb(243,243,243));
  min-height: calc(100vh - 65px);

}


</style>
