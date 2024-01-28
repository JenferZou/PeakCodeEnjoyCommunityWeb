<template>
    <div class="container-body messageCenter" :style="{width:proxy.globalInfo.userCenterWidth+'px'}">
        <div class="user-nav">
            <router-link to="/" class="a-link">首页</router-link>
            <span class="iconfont icon-icon_right">消息中心</span>
        </div>
        <div class="message-panel">
            <div class="tab-list">
                <el-tabs :model-value="activeTabName" @tab-change="tabChange">
                    <el-tab-pane name="reply">
                        <template #label>
                            <div class="tab-item">
                                <span>回复我的</span>
                                <span class="count-tag"
                                      v-if="messageCountInfo.reply>0"
                                >{{messageCountInfo.reply>99
                                    ?"99+":messageCountInfo.reply}}</span>
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane name="likePost">
                        <template #label>
                            <div class="tab-item">
                                <span>赞了我的文章</span>
                                <span class="count-tag"
                                      v-if="messageCountInfo.likePost>0"
                                >{{messageCountInfo.likePost>99
                                    ?"99+":messageCountInfo.likePost}}</span>
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane name="downloadAttachment">
                        <template #label>
                            <div class="tab-item">
                                <span>下载了我的附件</span>
                                <span class="count-tag"
                                      v-if="messageCountInfo.downloadAttachment>0"
                                >{{messageCountInfo.downloadAttachment>99
                                    ?"99+":messageCountInfo.downloadAttachment}}</span>
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane name="likeComment">
                        <template #label>
                            <div class="tab-item">
                                <span>赞了我的评论</span>
                                <span class="count-tag"
                                      v-if="messageCountInfo.likeComment>0"
                                >{{messageCountInfo.likeComment>99
                                    ?"99+":messageCountInfo.likeComment}}</span>
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane name="sys">
                        <template #label>
                            <div class="tab-item">
                                <span>系统信息</span>
                                <span class="count-tag"
                                      v-if="messageCountInfo.sys>0"
                                >{{messageCountInfo.sys>99
                                    ?"99+":messageCountInfo.sys}}</span>
                            </div>
                        </template>
                    </el-tab-pane>
                </el-tabs>
                <router-link :to="`/user/${userId}`"
                             class="a-link gotoUcenter">&lt;&lt;用户中心</router-link>
            </div>

            <div class="message-list">
                <PageDataList
                    :loading="loading"
                    :dataSource="messageListInfo"
                    @loadData="loadMessage">
                    <template #default="{data}">
<!--                        系统消息-->
                        <div class="message-item" v-if="data.message_type==0">
                            <div class="message-content" >
                                <span v-html="data.message_content">
                                </span>
                                <span class="create-time">
                                    {{data.create_time}}
                                </span>
                            </div>
                        </div>
<!--                        回复我的-->
                        <div class="message-item" v-if="data.message_type==1">
                            <Avatar :user-id="data.send_user_id" :width="50"></Avatar>
                            <div class="message-content">
                                <div>
                                    <router-link  class="a-link" :to="`/user/${data.send_user_id}`">
                                        @{{data.send_nick_name}}
                                    </router-link>
                                    对我的文章【 <router-link  class="a-link" :to="`/post/${data.article_id}`">
                                    {{data.article_title}}
                                </router-link>】发表了评论
                                    <span class="create-time">
                                    {{data.create_time}}
                                </span>
                                </div>
                                <div class="reply-content" v-html="data.message_content">

                                </div>
                            </div>
                        </div>
<!--                        赞了我的评论-->
                        <div class="message-item" v-if="data.message_type==3">
                            <Avatar :user-id="data.send_user_id" :width="50"></Avatar>
                            <div class="message-content">
                                <div>
                                    <router-link  class="a-link" :to="`/user/${data.send_user_id}`">
                                        @{{data.send_nick_name}}
                                    </router-link>
                                    在文章【 <router-link  class="a-link" :to="`/post/${data.article_id}`">
                                    {{data.article_title}}
                                </router-link>】中赞了我的评论
                                    <span class="create-time">
                                    {{data.create_time}}
                                </span>
                                </div>
                                <div class="reply-content" v-html="data.message_content">
                                </div>
                            </div>
                        </div>


<!--                        赞了我的文章-->
                        <div class="message-item" v-if="data.message_type==2">
                            <Avatar :user-id="data.send_user_id" :width="50"></Avatar>
                            <div class="message-content">
                                <div>
                                    <router-link  class="a-link" :to="`/user/${data.send_user_id}`">
                                        @{{data.send_nick_name}}
                                    </router-link>
                                    赞了我的文章【 <router-link  class="a-link" :to="`/post/${data.article_id}`">
                                    {{data.article_title}}
                                </router-link>】
                                    <span class="create-time">
                                    {{data.create_time}}
                                </span>
                                </div>
                            </div>
                        </div>


<!--                        下载了我的附件-->
                        <div class="message-item" v-if="data.message_type==4">
                            <Avatar :user-id="data.send_user_id" :width="50"></Avatar>
                            <div class="message-content">
                                <div>
                                    <router-link  class="a-link" :to="`/user/${data.send_user_id}`">
                                        @{{data.send_nick_name}}
                                    </router-link>
                                    在文章【 <router-link  class="a-link" :to="`/post/${data.article_id}`">
                                    {{data.article_title}}
                                </router-link>】中下载了我的附件
                                    <span class="create-time">
                                    {{data.create_time}}
                                </span>
                                </div>
                            </div>
                        </div>

                    </template>
                </PageDataList>
            </div>
        </div>
    </div>

</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick, onUnmounted} from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
import PageDataList from "@/components/PageDataList.vue";
import Avatar from "@/components/Avatar.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
    loadMessageList:"/ucenter/loadMessageList"
}

const activeTabName = ref("reply");
const messageCountInfo = ref({});
const messageListInfo = ref({
    list: [] // 初始化为一个空数组
});//获取文章列表


const loading = ref(false);
const orderType = ref(0);
const loadMessage = async ()=>{
    loading.value=true;
    let params ={
        pageNo:messageListInfo.value.pageNo,
        code:activeTabName.value,
    };


    let result = await proxy.Request({
        url:api.loadMessageList,
        params:params
    });
    loading.value=false;
    if(!result){
        return;
    }
    messageListInfo.value =result.data;
    store.commit("readMessage",activeTabName.value)

};


watch(()=>store.state.messageCountInfo,
    (newVal,oldVal)=>{
        messageCountInfo.value = newVal || {};

    },{immediate:true,deep:true}
);

watch(()=>route.params.type,
    (newVal,oldVal)=>{
    if(newVal){
        activeTabName.value = newVal;
        loadMessage();
    }
    },{immediate:true,deep:true});

const userId = ref(null);
watch(()=>store.state.loginUserInfo,(newVal,oldVal)=>{
    if(newVal){
        userId.value = newVal.userId;
    }
},{immediate:true,deep:true})
const tabChange =(type)=>{
    router.push(`/user/message/${type}`);
};




</script>

<style scoped lang="scss">
.messageCenter {
  .user-nav {
    color: #616161;
    margin-bottom: 10px;
      line-height: 35px;
    .icon-icon_right {
      padding: 0px 5px;
    }
  }
  .message-panel{
      background: #fff;
      padding: 10px;
      margin-top: 5px;
      .tab-list{
          position: relative;
          .tab-item{
              position: relative;
              padding:0px 10px;
              .count-tag{
                  position: absolute;
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
                  right: -12px;
              }
          }
          .gotoUcenter{
              position: absolute;
              right: 10px;
              top: 0px;
              font-size: 14px;
          }
      }
      .message-list{
          .message-item{
              display: flex;
              justify-content: flex-start;
              font-size: 14px;
              align-items: center;
              border-bottom: 1px solid #ddd;
              padding: 10px;
              .message-content{
                  margin-left: 5px;
                  .create-time{
                      color: #9ba7b9;
                      margin-left: 10px;
                  }
                  .reply-content{
                      border-left: 2px solid #11a8f4;
                      padding:5px;
                      margin-top: 5px;
                  }
              }
          }
      }
  }
}
</style>
