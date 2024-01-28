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
                        <el-button type="primary" @click="postArticle">发帖
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
                                <el-badge :value="messageCountInfo.total" class="item"
                                          :hidden="messageCountInfo.total==null
                                          ||messageCountInfo.total==0"
                                          aria-expanded="false" style="outline: none">
                                    <div class="iconfont icon-Message"></div>
                                </el-badge>

                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item
                                            class="message-item"
                                            @click="gotoMessage('reply')">
                                            <span class="text">回复我的</span>
                                            <span class="count-tag"
                                            v-if="messageCountInfo.reply>0"
                                            >{{messageCountInfo.reply>99
                                                ?"99+":messageCountInfo.reply}}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            class="message-item"
                                            @click="gotoMessage('likePost')">
                                            <span class="text">赞了我的文章的</span>
                                            <span class="count-tag"
                                            v-if="messageCountInfo.likePost>0"
                                            >{{messageCountInfo.likePost>99
                                                ?"99+":messageCountInfo.likePost}}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            class="message-item"
                                            @click="gotoMessage('downloadAttachment')">
                                            <span class="text">下载了我的附件</span>
                                            <span class="count-tag"
                                            v-if="messageCountInfo.downloadAttachment>0"
                                            >{{messageCountInfo.downloadAttachment>99
                                                ?"99+":messageCountInfo.downloadAttachment}}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            class="message-item"
                                            @click="gotoMessage('likeComment')">
                                            <span class="text">赞了我的评论</span>
                                            <span class="count-tag"
                                            v-if="messageCountInfo.likeComment>0"
                                            >{{messageCountInfo.likeComment>99
                                                ?"99+":messageCountInfo.likeComment}}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            class="message-item"
                                            @click="gotoMessage('sys')"
                                        >
                                            <span class="text">系统信息</span>
                                            <span class="count-tag"
                                            v-if="messageCountInfo.sys>0"
                                            >{{messageCountInfo.sys>99
                                                ?"99+":messageCountInfo.sys}}</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <div class="user-info">
                            <el-dropdown>
                                <Avatar :width="50" style="outline: none"
                                        :add-link="false"
                                        :user-id="userInfo.userId"></Avatar>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoUcenter(userInfo.userId)">
                                            我的主页
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="logout">
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
import LoginAndRegister from "@/views/LoginAndRegister.vue";
import store from "@/store";
import Avatar from "@/components/Avatar.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();



const api ={
    getUserInfo:"/getUserInfo",
    loadBoard:"/board/loadBoard",
    loadMessageCount:"/ucenter/getMessageCount",
    logout:"/logout"
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



const myPopover = ref(null);
onMounted(()=>{
        initScroll();
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
const loginRegisterRef = ref();
//登陆注册功能
const loginAndRegister = (type)=>{
    loginRegisterRef.value.showPanel(type);
}
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
    (newVal,oldVal)=>{
        if(newVal){
            loginAndRegister(1);
            store.commit("showLogin",false)
        }
    },{immediate:true,deep:false});



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

const postArticle = ()=>{
    if(!store.getters.getLoginUserInfo){
        loginAndRegister(1);
    }else {
        router.push("/postArticle");
    }
}

//网站的logo
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

//消息中心
const gotoMessage = (type)=>{
    router.push(`/user/message/${type}`)
};

const messageCountInfo= ref({});
const loadMessageCount = async ()=>{
    let result = await proxy.Request({
        url:api.loadMessageCount
    });
    if(!result){
        return;
    }
    messageCountInfo.value = result.data;
    store.commit("setMessageCountInfo",result.data);
};


watch(()=>store.state.loginUserInfo,
    (newVal,oldVal)=>{
    if(newVal){
        loadMessageCount();
    }
    },{immediate:true,deep:true}
);

watch(()=>store.state.messageCountInfo,
    (newVal,oldVal)=>{
        messageCountInfo.value = newVal || {};

    },{immediate:true,deep:true}
);


//前往用户中心
const gotoUcenter = (userId)=>{
    router.push(`/user/${userId}`)
}

//退出
const logout = ()=>{
    proxy.Confirm("确定要退出么？",async ()=>{
        let result = await proxy.Request({
            url:api.logout
        });
        if (!result){
            return;
        }
        store.commit("updateLoginUserInfo",null);
    })
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
    //box-shadow: 0 0 0 0 transparent,
    //0 0 0 0 transparent,
    //0 1px 4px 0 rgba(0,0,0,.02),
    //0 2px 12px 0 rgba(0,0,0,.04),
    //0 2px 6px 0 rgba(0,0,0,.02);
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
              cursor: pointer;
              .icon-Message{
                  color: rgb(147,147,147);
              }

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

.message-item{
    display: flex;
    justify-content: space-around;
    .text{
        flex: 1;
    }
    .count-tag{
        margin-left: 10px;
        min-width: 20px;
        display: inline-block;
        background: #f56c6c;
        font-size: 13px;
        line-height: 15px;
        height: 15px;
        text-align: center;
        border-radius: 10px;
        color: #fff;
    }
}
</style>
