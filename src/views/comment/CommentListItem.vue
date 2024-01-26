<template>
<div class="comment-item">
    <Avatar :user-id="commentData.user_id" :width="50"></Avatar>
    <div class="comment-info">
        <div class="nick-name">
            <span class="name" @click="gotoUcenter(commentData.user_id)" >{{commentData.nick_name}}</span>
            <span v-if="commentData.user_id==articleUserId" class="tag-author">
                作者
            </span>
        </div>
        <div class="comment-content">
            <div>
                <span class="tag tag-topping" v-if="commentData.top_type==1">置顶</span>
                <span class="tag no-audit" v-if="commentData.status==0">待审核</span>
                <span v-html="commentData.content"></span>
            </div>
            <CommentImage :style="{'margin-top':'10px'}"
                          v-if="commentData.img_path"
                          :imageList="[proxy.globalInfo.imageUrl+commentData.img_path]"
                          :src="proxy.globalInfo.imageUrl+commentData.img_path.replace('.','_.')" />
        </div>

        <div class="op-panel">
            <div class="time">
                <span>{{commentData.post_time}}</span>
                <span class="address">&nbsp;·&nbsp;{{commentData.user_ip_address}}</span>
            </div>
            <div :class="['iconfont icon-dianzan',
                             commentData.likeType==1?'active':'',
                             ]"
                 @click="doLike(commentData)">
                {{commentData.good_count>0?commentData.good_count:"点赞"}}
            </div>
            <div class="iconfont icon-pinglun"
                 @click="showReplyPanel(commentData,0)">
                回复
            </div>
            <el-dropdown v-if="articleUserId==currentUserId">
                <div class="iconfont icon-more" style="outline: none"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="doTop(commentData)">
                            {{commentData.top_type==0?"设为置顶":"取消置顶"}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="comment-sub-list"  v-if="commentData.sub_forumComment_list">
            <div class="comment-sub-item" v-for="sub in commentData.sub_forumComment_list">
                <Avatar :user-id="sub.user_id" :width="30"></Avatar>
                <div class="comment-sub-info">
                    <div class="nick-name">
                        <span class="name" @click="gotoUcenter(sub.user_id)">{{sub.nick_name}}</span>
                        <span v-if="sub.user_id==articleUserId" class="tag-author">
                            作者
                        </span>
                        <span class="reply-name">
                            回复
                        </span>
                        <span @click="gotoUcenter(sub.reply_user_id)"
                        class="a-link">@{{sub.reply_nick_name}}</span>
                        <span>:</span>
                        <span class="sub-content" v-html="sub.content"></span>
                    </div>
                    <div class="op-panel">
                        <div class="time">
                            <span>{{sub.post_time}}</span>
                            <span class="address">&nbsp;·&nbsp;{{sub.user_ip_address}}</span>
                        </div>
                        <div
                             :class="['iconfont icon-dianzan',
                             sub.likeType==1 ? 'active':'']"
                             @click="doLike(sub)">
                            {{sub.good_count>0?sub.good_count:"点赞"}}
                        </div>
                        <div class="iconfont icon-pinglun"
                             @click="showReplyPanel(sub,1)">
                            回复
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="reply-info">
            <PostComment  v-if="commentData.showReply"
                          :avatarWidth="30"
                          :placeholderInfo="placeholderInfo"
                          :articleId="articleId"
                          :userId="currentUserId"
                          :pCommentId="pCommentId"
                          :replyUserId="replyUserId"
                          @postCommentFinish="postCommentFinish"
                         :showInserImg="false"></PostComment>
        </div>
    </div>
</div>
</template>

<script setup>
import Avatar from "@/components/Avatar.vue";
import PostComment from "@/views/comment/PostComment.vue";
import {getCurrentInstance, ref} from "vue";
import router from "@/router";
import CommentImage from "@/views/comment/CommentImage.vue";
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
//显示评论框,更新评论数
const emit = defineEmits(["hiddenAllReplay","updateSubCommentCount","reloadData"]);
const api = {
    doLike:"/comment/doLike",
    changeTopType:"/comment/changeTopType"

}

const pCommentId = ref(0);
const replyUserId = ref(null);
const placeholderInfo = ref(null);
const showReplyPanel = (curData,type)=>{
    const haveShow = props.commentData.showReply == undefined?false:props.commentData.showReply;
    emit("hiddenAllReplay")
    if(type==0){
        //一级评论
        props.commentData.showReply=!haveShow;
    }else{
        //二级评论
        props.commentData.showReply=true
    }
    pCommentId.value =  props.commentData.comment_id;
    replyUserId.value = curData.user_id;
    placeholderInfo.value = "回复 @"+curData.nick_name
};

const postCommentFinish = (resultData)=>{
    props.commentData.sub_forumComment_list = resultData;
    placeholderInfo.value = undefined;
    emit("updateSubCommentCount");
}

//隐藏所有回复框
const hiddenAllReplyHandle = ()=>{
    commentListInfo.value.list.forEach((element)=>{
        element.showReply = false;
    });
};

const gotoUcenter = (userId)=>{
    router.push(`/user/${userId}`);
}

//点赞
const doLike = async (data)=>{
    let result = await proxy.Request({
        url: api.doLike,
        params: {
           commentId : data.comment_id,
        },
    });
    if (!result){
        return;
    }
    data.good_count = result.data.good_count;
    data.likeType = result.data.likeType;

}

//置顶
const doTop = async (data)=>{
    let result = await proxy.Request({
        url: api.changeTopType,
        params: {
            commentId : data.comment_id,
            topType: data.top_type==0?1:0,
        },
    });
    if (!result){
        return;
    }
    emit("reloadData");
}

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
                padding: 0px 3px;
            }
        }
        .comment-content{
            margin-top: 5px;
            font-size: 15px;
            line-height: 22px;
            .tag-topping{
                color: var(--pink);
                border: 1px solid var(--pink);
            }
            .tag{
                margin-right: 5px;
                font-size: 12px;
                border-radius: 3px;
                padding: 0px 5px;
            }
            .no-audit{
                color: var(--test2);
                border: 1px solid var(--test2);
            }
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
            .active{
                color:var(--pink);
            }
        }
        .comment-sub-list{
            margin-top: 10px;
            .comment-sub-item{
                display: flex;
                margin:8px 0px;
                font-size: 14px;
                .comment-sub-info{
                    margin-left: 5px;
                    .nick-name{
                        .reply-name{
                            margin: 0px 4px;
                        }
                        .sub-content{
                            margin-left: 8px;
                            font-size: 14px;

                        }
                    }
                }
            }

        }
        .reply-info{
            margin-top: 15px;
        }
    }
}
</style>
