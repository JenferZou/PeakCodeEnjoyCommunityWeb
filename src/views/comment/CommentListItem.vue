<template>
<div class="comment-item">
    <Avatar :user-id="commentData.user_id" :width="50"></Avatar>
    <div class="comment-info">
        <div class="nick-name">
            <span class="name">{{commentData.nick_name}}</span>
            <span v-if="commentData.user_id==articleUserId" class="tag-author">
                作者
            </span>
        </div>
        <div class="comment-content">
            <span v-html="commentData.content"></span>
        </div>
        <div class="op-panel">
            <div class="time">
                <span>{{commentData.post_time}}</span>
                <span class="address">&nbsp;·&nbsp;{{commentData.user_ip_address}}</span>
            </div>
            <div class="iconfont icon-dianzan">
                {{commentData.good_count>0?commentData.good_count:"点赞"}}
            </div>
            <div class="iconfont icon-pinglun"
                 @click="showReplyPanel(commentData)">
                回复
            </div>
            <el-dropdown v-if="articleUserId==currentUserId">
                <div class="iconfont icon-more"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            {{commentData.top_type==0?"设为置顶":"取消置顶"}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="reply-info">
            <PostComment  v-if="commentData.showReply"
                          :avatarWidth="30"
                          :articleId="articleId"
                          :userId="currentUserId"
                          :pCommentId="pCommentId"
                          :replyUserId="replyUserId"
                          @hiddenAllReplay="hiddenAllReplyHandle"
                         :showInserImg="false"></PostComment>
        </div>
    </div>
</div>
</template>

<script setup>
import Avatar from "@/components/Avatar.vue";
import a from "vuex-persistedstate";
import Dialog from "@/components/Dialog.vue";
import PostComment from "@/views/comment/PostComment.vue";
import {getCurrentInstance, ref} from "vue";
const {proxy} = getCurrentInstance();

const props =defineProps({
articleId:{
    type:String,
},
commentData:{
        type:Object,
    },
    articleUserId:{
        type:String,
    },
    currentUserId:{
        type:String,
    }
})
//显示评论框
const emit = defineEmits(["hiddenAllReplay"]);

const pCommentId = ref(0);
const replyUserId = ref(null);
const showReplyPanel = (curData)=>{
    const haveShow = curData.showReply == undefined?false:curData.showReply;
    emit("hiddenAllReplay")
    curData.showReply = !haveShow;
    pCommentId.value = curData.comment_id;
};

const postCommentFinish = (resultData)=>{
    const children =  props.commentData.sub_forumComment_list || [];
    children.unshift(resultData);
}

//隐藏所有回复框
const hiddenAllReplyHandle = ()=>{
    commentListInfo.value.list.forEach((element)=>{
        element.showReply = false;
    });
};

</script>

<style lang="scss" scoped>
.comment-item{
    display: flex;
    padding-top: 10px;
    .comment-info{
        flex:1;
        margin-left: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 15px;
        .nick-name{
            .name{
                font-size: 14px;
                color: var(--text2);
                margin-right: 10px;
                cursor: pointer;
            }
            .tag-author{
                background: var(--pink);
                color: #fff;
                font-size: 12px;
                border-radius: 2px;

            }

        }
        .comment-content{
            margin-top: 5px;
            font-size: 15px;
            line-height: 22px;
        }
        .op-panel{
            display: flex;
            margin-top: 5px;
            font-size: 13px;
            color: var(--test2);
            .time{
                margin-right: 15px;
            }
            .iconfont{
                margin-right: 13px;
                font-size: 14px;
                cursor: pointer;
            }
            .iconfont::before{
                margin-right: 3px;
            }
        }
        .reply-info{
            margin-top: 15px;
        }
    }
}
</style>
