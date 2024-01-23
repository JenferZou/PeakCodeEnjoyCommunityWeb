<template>
    <div>
        <div class="header" v-if="showHeader">
            <div class="header-content" :style="{width:proxy.globalInfo.headbodywidth+'px'}">
                <div class="logo">
                  <span v-for="item in logoInfo" :style="{color: item.color}">
                      {{item.letter}}
                  </span>
                </div>
                <div class="menu-panel">
                    <router-link :class="['menu-item home',activePBoardId==undefined?'active':'']" to="/">首页</router-link>
                    <template v-for="board in boardList">
                        <el-popover
                                placement="bottom-start"
                                :width="300"
                                trigger="hover"
                                v-if="board.children.length >0"

                        >
                            <template #reference>
                                <span :class="['menu-item',board.board_id==activePBoardId?'active':'']"
                                      @click="boardClickHandler(board)">{{board.board_name}}</span>
                            </template>
                            <div class="sub-board-list">
                        <span :class="['sub-board',subboard.board_id==activeBoardId?'active':'']"
                              v-for="subboard in board.children"
                              @click="subBoardClickHandler(subboard)">
                            {{subboard.board_name}}
                        </span>
                            </div>
                        </el-popover>
                        <span :class="['menu-item',board.board_id==activePBoardId?'active':'']" v-else @click="boardClickHandler(board)">{{board.board_name}}</span>
                    </template>
                </div>
                <div class="user-info-panel">

                    <div class="op-btn">
                        <el-button type="primary">发帖
                            <span class="iconfont icon-jia" style="padding-left: 3px">
                </span>
                        </el-button>
                        <el-button type="primary" :style="{'margin-left':'3px'}">搜索
                            <span class="iconfont icon-sousuo" style="padding-left: 3px">
                </span>
                        </el-button>
                    </div>

                    <template v-if="userInfo.userId">
                        <div class="message-info">
                            <el-dropdown :style="{'margin-left':'10px'}" >
                                <el-badge :value="12" class="item" aria-expanded="false" style="outline: none">
                                    <div class="iconfont icon-Message"></div>
                                </el-badge>

                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            回复我的
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            赞了我的文章的
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <div class="user-info">
                            <el-dropdown>
                                <Avatar :width="50" style="outline: none" :user-id="userInfo.userId"></Avatar>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            我的主页
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            退出
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                        </div>
                    </template>


                    <el-button-group :style="{'margin-left':'10px'}" v-else>
                        <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
                        <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
                    </el-button-group>
                </div>

            </div>

        </div>
    </div>


    <!--    登陆注册-->
    <LoginAndRegister ref="loginRegisterRef">

    </LoginAndRegister>

</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import Dialog from "@/components/Dialog.vue";
import LoginAndRegister from "@/views/LoginAndRegister.vue";
import store from "@/store";
import LeftLayout from "@/views/LeftLayout.vue";
import RightLayout from "@/views/RightLayout.vue";
import {useStore} from "vuex";
import Avatar from "@/components/Avatar.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();



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
    let result = await  proxy.Request({
        url:api.getUserInfo
    });
    if(!result){
        return;
    }
    store.commit("updateLoginUserInfo",result.date)
};

const myPopover = ref(null);
onMounted(()=>{
        initScroll();
        // getUserInfo();

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
    {letter:"S",
        color: "rgb(50, 133, 255)",
    },
    {letter:"h",
        color: "rgb(251, 54, 36)",
    },
    {letter:"a",
        color: "rgb(255, 186, 2)",
    },
    {letter:"r",
        color: "rgb(50, 133, 255)",
    },
    {letter:"e",
        color: "color: rgb(37, 178, 78)",
    },
    {letter:"C",
        color: "rgb(251, 54, 36)",
    },
    {letter:"o",
        color: "rgb(255, 186, 2)",
    },
    {letter:"d",
        color: "rgb(50, 133, 255)",
    },
    {letter:"e",
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

<style scoped lang="scss">
.fade-leave-to {
  display: none;
}


.header{
  top: 0px;
  width: 100%;
  position: fixed;
  background: #ffffff;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1;
  transition: top 1s;

  .header-content {
    margin: 0px auto;
    align-items: center;
    height: 60px;
    display: flex;
    align-items: center;

    .logo {
      display: block;
      margin-right: 5px;

      span {
        font-size: 30px;
      }
    }
    .menu-panel{
      flex: 1;
      .menu-item{
        margin-left: 20px;
        cursor: pointer;
      }
      .home {
        text-decoration: none;
        color: #000;
      }
      .active{
        color: var(--link);
      }
    }


      .user-info-panel{
          width: 300px;
          display: flex;
          align-items: center;
          .icon-Message{
              font-size:28px;
          }
          .user-info{

          }
          .message-info{
              margin-right: 25px;

          }

      }


  }

}
.sub-board-list{
  display: flex;
  flex-wrap: wrap;
  .sub-board{
    padding: 0px 10px;
    border-radius: 20px;
    background-color: rgb(239,239,239);
    border: 1px solid #ddd;
    color: #909090;
    margin-top: 10px;
    cursor: pointer;
  }
  .sub-board:hover{
    color: var(--link);
  }
  .active{
    background: var(--link);
    color: #fff;
  }
  .active:hover{
    color: #fff;
  }
}


</style>
