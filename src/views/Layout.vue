<template>
<div>

<!--            <div class="header" v-if="showHeader">-->
<!--            <div class="header-content" :style="{width:proxy.globalInfo.headbodywidth+'px'}">-->
<!--                <div class="logo">-->
<!--                  <span v-for="item in logoInfo" :style="{color: item.color}">-->
<!--                      {{item.letter}}-->
<!--                  </span>-->
<!--                </div>-->
<!--                <div class="menu-panel">-->
<!--                    <router-link :class="['menu-item home',activePBoardId==undefined?'active':'']" to="/">首页</router-link>-->
<!--                    <template v-for="board in boardList">-->
<!--                        <el-popover-->
<!--                                placement="bottom-start"-->
<!--                                :width="300"-->
<!--                                trigger="hover"-->
<!--                                v-if="board.children.length >0"-->

<!--                        >-->
<!--                            <template #reference>-->
<!--                                <span :class="['menu-item',board.board_id==activePBoardId?'active':'']"-->
<!--                                      @click="boardClickHandler(board)">{{board.board_name}}</span>-->
<!--                            </template>-->
<!--                            <div class="sub-board-list">-->
<!--                        <span :class="['sub-board',subboard.board_id==activeBoardId?'active':'']"-->
<!--                              v-for="subboard in board.children"-->
<!--                              @click="subBoardClickHandler(subboard)">-->
<!--                            {{subboard.board_name}}-->
<!--                        </span>-->
<!--                            </div>-->
<!--                        </el-popover>-->
<!--                        <span :class="['menu-item',board.board_id==activePBoardId?'active':'']" v-else @click="boardClickHandler(board)">{{board.board_name}}</span>-->
<!--                    </template>-->
<!--                </div>-->
<!--                <div class="user-info-panel">-->

<!--                    <div class="op-btn">-->
<!--                        <el-button type="primary">发帖-->
<!--                            <span class="iconfont icon-jia" style="padding-left: 3px">-->
<!--                </span>-->
<!--                        </el-button>-->
<!--                        <el-button type="primary" :style="{'margin-left':'3px'}">搜索-->
<!--                            <span class="iconfont icon-sousuo" style="padding-left: 3px">-->
<!--                </span>-->
<!--                        </el-button>-->
<!--                    </div>-->

<!--                    <template v-if="userInfo.userId">-->
<!--                        <div class="message-info">-->
<!--                            <el-dropdown :style="{'margin-left':'10px'}">-->
<!--                                <el-badge :value="12" class="item">-->
<!--                                    <div class="iconfont icon-Message"></div>-->
<!--                                </el-badge>-->
<!--                                <template #dropdown>-->
<!--                                    <el-dropdown-menu>-->
<!--                                        <el-dropdown-item>-->
<!--                                            回复我的-->
<!--                                        </el-dropdown-item>-->
<!--                                        <el-dropdown-item>-->
<!--                                            赞了我的文章的-->
<!--                                        </el-dropdown-item>-->
<!--                                    </el-dropdown-menu>-->
<!--                                </template>-->
<!--                            </el-dropdown>-->
<!--                        </div>-->
<!--                        <div class="user-info">-->
<!--                            <el-dropdown>-->
<!--                                <Avatar :width="50"></Avatar>-->
<!--                                <template #dropdown>-->
<!--                                    <el-dropdown-menu>-->
<!--                                        <el-dropdown-item>-->
<!--                                            我的主页-->
<!--                                        </el-dropdown-item>-->
<!--                                        <el-dropdown-item>-->
<!--                                            退出-->
<!--                                        </el-dropdown-item>-->
<!--                                    </el-dropdown-menu>-->
<!--                                </template>-->
<!--                            </el-dropdown>-->

<!--                        </div>-->
<!--                    </template>-->


<!--                    <el-button-group :style="{'margin-left':'10px'}" v-else>-->
<!--                        <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>-->
<!--                        <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>-->
<!--                    </el-button-group>-->
<!--                </div>-->

<!--            </div>-->

<!--        </div>-->
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
  margin: 80px auto;
}


</style>