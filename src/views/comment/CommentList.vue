<template>
<div class="comment-body">
    <div class="comment-title">
        <div class="title">
            评论<span class="count">{{commentListInfo.commentCount}}</span>
        </div>
        <div class="tab">
            <span @click="orderChange(0)" :class="['tab-item',orderType==0?'active':'']">热榜</span>
            <el-divider direction="vertical"></el-divider>
            <span @click="orderChange(1)" :class="['tab-item',orderType==1?'active':'']">最新</span>
        </div>
    </div>
    <!--发送评论 -->
    <div class="comment-form-panel">
       <PostComment  :avatarWidth="50"
                     :pCommentId="0"
                     :articleId="articleId"
                     :userId="currentUserInfo?.userId"
                     :showInserImg="currentUserInfo?.userId!=null"
                     @postCommentFinish="postCommentFinish"
       ></PostComment>
    </div>
    <div class="comment-list">
        <PageDataList
            :dataSource="commentListInfo"
            :loading="loading"
            @loadData="loadComment">
            <template #default="{ data }">
                <CommentListItem
                    :commentData="data"
                    :articleUserId="articleUserId"
                    :currentUserId="currentUserInfo?.userId"
                    @hiddenAllReplay="hiddenAllReplyHandle"
                    @updateSubCommentCount="updateSubCommentCount"
                    :articleId="articleId"
                    @reloadData="loadComment"
                ></CommentListItem>
            </template>
        </PageDataList>
    </div>
</div>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";
import store from "@/store";
import CommentListItem from "@/views/comment/CommentListItem.vue";
import PostComment from "@/views/comment/PostComment.vue";
const {proxy} = getCurrentInstance();

const props = defineProps({
    articleId:{
        type:String,
    },
    articleUserId:{
        type:String,
    }
});

const api = {
    loadComment:"/comment/loadComment",
}
//排序
const orderType =ref(0)
const orderChange = (type)=>{
    orderType.value = type;
    loadComment();
}


//评论列表
const commentListInfo = ref({});
const loading =ref(null);

const loadComment =async ()=>{
    let params = {
        pageNo:commentListInfo.value.pageNo,
        articleId:props.articleId,
        orderType:orderType.value,

    }
    let result = await proxy.Request({
        url:api.loadComment,
        params,
    });
    loading.value = false;
    if(!result){
        result;
    }
    commentListInfo.value=result.data;
}
loadComment();

//隐藏所有回复框
const hiddenAllReplyHandle = ()=>{
    commentListInfo.value.list.forEach((element)=>{
        element.showReply = false;
    });
};

const emit = defineEmits(["updateCommentCount"]);
const postCommentFinish = (resultData)=>{
    commentListInfo.value.list.unshift(resultData)
    const commentCount = commentListInfo.value.commentCount +1;
    commentListInfo.value.commentCount = commentCount;
    emit("updateCommentCount",commentCount);
}

//更新全部评论数量
const updateSubCommentCount = ()=>{
    const commentCount = commentListInfo.value.commentCount +1;
    commentListInfo.value.commentCount = commentCount;
    emit("updateCommentCount",commentCount);
}


//当前用户
const currentUserInfo = ref({});
watch(()=>store.state.loginUserInfo,(newval,oldval)=>{
    currentUserInfo.value = newval || null;
},{immediate:true,deep:true})


</script>

<style scoped lang="scss">
.comment-body{
    .comment-title{
        display: flex;
        .title{
            font-size: 20px;
            align-items: center;
            .count{
                font-size: 14px;
                padding: 0px 10px;
            }
        }
        .tab{
            .tab-item{
                cursor: pointer;
            }
            .active{
                color: var(--link);
            }
        }
    }
    .comment-form-panel{
        margin-top: 20px;
    }
}

</style>

<style>
.el-textarea__inner{
    height: 60px;
}
</style>
