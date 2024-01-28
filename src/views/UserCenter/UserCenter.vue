<template>
<div class="container-body userCenter" :style="{width:proxy.globalInfo.userCenterWidth+'px'}">
    <div class="user-nav">
        <router-link to="/" class="a-link">首页</router-link>
        <span class="iconfont icon-icon_right">用户中心</span>
    </div>
    <div class="userCenter-panel">
        <div class="user-side">
<!--            头像信息-->
            <div class="avatar-panel">
                <div class="edit-btn a-link"
                v-if="isCurrentUser" @click="updateUserInfo"
                >修改资料</div>
                <div class="avatar-inner">
                    <Avatar :userId="userInfo.user_id" width="120"></Avatar>
                </div>
                <div class="nick-name">
                    <span>{{userInfo.nick_name}}</span>
                    <span v-if="userInfo.sex==0"
                          style="color: var(--link)"
                          class="iconfont icon-man"
                    ></span>
                    <span v-if="userInfo.sex==1"
                          class="iconfont icon-nvxing"
                          style="color: var(--pink)"
                    ></span>
                </div>
                <div class="desc">
                    {{userInfo.person_description}}
                </div>
            </div>
            <div class="user-extend-panel">
                <div class="info-item">
                    <div class="label iconfont icon-jifen">
                        积分
                    </div>
                    <div class="value a-link" v-if="isCurrentUser" @click="showIntegralRecord">
                        {{userInfo.current_integral}}
                    </div>
                    <div class="value" v-else>
                        {{userInfo.current_integral}}
                    </div>
                </div>
                <div class="info-item">
                    <div class="label iconfont icon-dianzan">
                        获赞
                    </div>
                    <div class="value">
                        {{userInfo.like_count}}
                    </div>
                </div>
                <div class="info-item">
                    <div class="label iconfont icon-bianji">
                        发帖
                    </div>
                    <div class="value">
                        {{userInfo.post_count}}
                    </div>
                </div>
                <div class="info-item">
                    <div class="label iconfont icon-register">
                        加入
                    </div>
                    <div class="value">
                        {{userInfo.join_time}}
                    </div>
                </div>
                <div class="info-item">
                    <div class="label iconfont icon-login">
                        最后登录
                    </div>
                    <div class="value">
                        {{userInfo.last_login_time}}
                    </div>
                </div>
            </div>
        </div>
        <div class="article-panel">
            <el-tabs :model-value="activeTableName" @tab-change="changeTab">
                <el-tab-pane label="发帖" :name="0"></el-tab-pane>
                <el-tab-pane label="评论" :name="1"></el-tab-pane>
                <el-tab-pane label="点赞" :name="2"></el-tab-pane>
            </el-tabs>
            <div class="article-list">
                <PageDataList
                    :loading="loading"
                    :dataSource="articleListInfo"
                    @loadData="loadArticle">
                    <template #default="{data}">
                        <ArticleListItem :data="data"></ArticleListItem>
                    </template>
                </PageDataList>
            </div>
        </div>
    </div>
<!--    修改用户信息-->
    <UserInfoEdit ref="userInfoEditRef" @resetUserInfo="resetUserInfoHandler"></UserInfoEdit>
<!--    获取用户积分记录-->
    <UserIntegralRecord ref="ucenterIntegralRecordRef"></UserIntegralRecord>
</div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick, onUnmounted} from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
import Avatar from "@/components/Avatar.vue";
import PageDataList from "@/components/PageDataList.vue";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import UserInfoEdit from "@/views/UserCenter/UserInfoEdit.vue";
import UserIntegralRecord from "@/views/UserCenter/UserIntegralRecord.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const userId = ref(null);
const userInfo = ref({});
const api ={
    getUserInfo : "/ucenter/getUserInfo",
    loadUserArticle:"/ucenter/loadUserArticle",
};


//右侧文章
const activeTableName = ref(0);
const changeTab = (type)=>{
    activeTableName.value = type;
    loadArticle();
};
const articleListInfo = ref({
    list: [] // 初始化为一个空数组
});//获取文章列表

const loading = ref(false);
const loadArticle = async ()=>{
    loading.value=true;
    let params ={
        pageNo:articleListInfo.value.pageNo,
        type:activeTableName.value,
        userId :userId.value,
    };


    let result = await proxy.Request({
        url:api.loadUserArticle,
        params:params
    });
    loading.value=false;
    if(!result){
        return;
    }
    articleListInfo.value =result.data;


};
const loadUserInfo = async ()=>{
    let result = await proxy.Request({
        url:api.getUserInfo,
        params:{userId:userId.value,},
        errorCallBack:()=>{
            setTimeout(()=>{
                router.push("/");
            },1500)
        },
    });
    if(!result){
        return;
    };
    userInfo.value=result.data;
}

const isCurrentUser = ref(false);

const resetCurrentUser =()=>{
    const loginUserInfo = store.getters.getLoginUserInfo;
    if(loginUserInfo&&loginUserInfo.userId==userId.value){
        isCurrentUser.value = true;
    }else {
        isCurrentUser.value = false;
    }
}

watch(()=>store.state.loginUserInfo,(newVal,oldVal)=>{
  resetCurrentUser();
},{immediate:true,deep:true});

watch(()=>route.params.userId,(newVal,oldVal)=>{
    if(newVal){
        userId.value = newVal;
        resetCurrentUser();
        loadUserInfo();
        loadArticle();
    }
},{immediate:true,deep:true});


const userInfoEditRef = ref(null);
//修改用户信息
const updateUserInfo =  ()=>{
    userInfoEditRef.value.showEditUserInfoDialog(userInfo.value);
}
const resetUserInfoHandler = (data)=>{
    userInfo.value = data;
}


//获取用户积分记录
const ucenterIntegralRecordRef = ref(null);
const showIntegralRecord = ()=>{
    ucenterIntegralRecordRef.value.showRecord();
}
</script>

<style scoped lang="scss">
.userCenter{
    .user-nav{
        color: #616161;
        margin-bottom: 10px;
        line-height: 35px;
        .icon-icon_right{
            padding: 0px 5px;
        }
    }
    .userCenter-panel{
        display: flex;
        .user-side{
            width: 300px;
            margin-right: 10px;
            .avatar-panel{
                background: #fff;
                padding :10px;
                text-align: center;
                .edit-btn{
                    text-align: right;
                    font-size: 14px;
                }
                .avatar-inner{
                    display: flex;
                    justify-content: center;
                }
                .nick-name{
                    .iconfont{
                        margin-left: 5px;
                    }
                }
                .desc{
                    text-align: center;
                    font-size: 14px;
                    margin-top: 5px;
                    color: #929393;
                }
            }
          .user-extend-panel{
            margin-top: 10px;
            background: #fff;
            padding :10px;
            .info-item{
              display: flex;
              justify-content: space-between;
                line-height: 30px;
              .label{
                font-size: 13px;
              }
              .label::before{
                font-size: 22px;
                color: #888888;
                padding-right: 5px;
            }
                .value{
                    font-size: 14px;
                }
            }
          }
        }
    }
    .article-panel{
        flex: 1;
        background: #fff;
        padding: 0px 10px 10px 10px;
    }
}



</style>
