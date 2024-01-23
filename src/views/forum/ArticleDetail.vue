<template>
    <div>
            <el-header>
                <Head></Head>
            </el-header>

                    <div class="container-body article-detail-body"
                         :style="{width:proxy.globalInfo.articleWidth+'px'}"
                         v-if="Object.keys(articleInfo).length>0"
                    >
                        <div class="board-info">
                            <router-link :to="`/forum/${articleInfo.p_board_id}`" class="a-link">
                                {{articleInfo.p_board_name}}
                            </router-link>
                            <span class="iconfont icon-icon_right"></span>
                            <template v-if="articleInfo.board_id">
                                <router-link :to="`/forum/${articleInfo.p_board_id}${articleInfo.board_id?'/'+articleInfo.board_id:''}`"
                                             class="a-link">
                                    {{articleInfo.board_name}}
                                </router-link>
                            </template>

                            <span class="iconfont icon-icon_right"></span>
                            <span>{{articleInfo.title}}</span>
                        </div>
                        <div class="detail-container" :style="{width:proxy.globalInfo.articleWidth +'px'}">
                            <div class="article-detail">
                                <!--文章标题-->
                                <div class="title">{{articleInfo.title}}</div>
                                <!--用户信息-->
                                <div class="user-info">
                                    <!--
                                    ToDo
                                    头像
                                    -->
                                    <div class="user-info-details">
                                        <router-link  class="nick-name" :to="`/user/${articleInfo.user_id}`">
                                            {{articleInfo.nick_name}}
                                        </router-link>
                                        <div class="time-info">
                                            <span class="post-time">{{articleInfo.post_time}}</span>
                                            <span class="address">&nbsp;·&nbsp;{{articleInfo.user_ip_address}}</span>
                                            <span class="iconfont icon-yanjing_xianshi">
                                            {{articleInfo.read_count==0?"阅读":articleInfo.read_count}}
                                        </span>
                                        </div>

                                    </div>
                                </div>
                                <!--文章内容详情-->
                                <div class="article-content" id="article-content" v-html="articleInfo.content">
                                </div>

                            </div>
                            <!--附件-->
                            <div class="attachment-panel" v-if="attachment" id="view-attachment">
                                <div class="title">
                                    附件
                                </div>
                                <div class="attachment-info">
                                    <div class="iconfont icon-zip-full item"></div>
                                    <div class="file-name item">{{attachment.file_name}}</div>
                                    <div class="size item">{{proxy.FileSizeFormat.sizeToStr(attachment.file_size)}}</div>
                                    <div class="item">需要
                                        <span class="integral">{{attachment.integral}}</span>
                                        积分
                                    </div>
                                    <div class="download-count item">
                                        已下载{{attachment.download_count}}次
                                    </div>
                                    <div class="download-btn item">
                                        <el-button type="primary" size="small" @click="downloadAttachment(attachment.file_id)">
                                            下载
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                            <!--评论-->
                            <div class="comment-panel" id="view-comment">
                                <CommentList
                                    v-if="articleInfo.article_id"
                                    :article-id="articleInfo.article_id"
                                    :article-user-id="articleInfo.user_id"
                                    @updateCommentCount="updateCommentCount"
                                >
                                </CommentList>
                            </div>

                        </div>
                        <!--快捷操作 -->
                        <div class="quick-panel" :style="{left:leftquickPanel+'px'}">
                            <!-- 点赞 -->
                            <el-badge :value="articleInfo.good_count"
                                      type="info" :hidden="!articleInfo.good_count>0"
                            >
                                <div class="quick-item" @click="doLikeHandler">
                                    <span :class="['iconfont icon-dianzan',haveLike?'have-like':'']"></span>
                                </div>
                            </el-badge>

                            <!-- 评论 -->
                            <el-badge :value="articleInfo.comment_count"
                                      type="info" :hidden="!articleInfo.comment_count>0"
                            >
                                <div class="quick-item"  @click="goToPosition('view-comment')">
                                    <span class="iconfont icon-xinjian"></span>
                                </div>
                            </el-badge>
                            <!-- 附件 -->
                            <div class="quick-item" @click="goToPosition('view-attachment')">
                                <span class="iconfont icon-attachment1"></span>
                            </div>
                            <!-- 图片预览 -->
                            <ImageViewer ref="imageViewerRef" :image-list="previewImgList">
                            </ImageViewer>
                        </div>
                    </div>


    </div>


</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick} from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
import Head from "@/views/Head.vue";
import ImageViewer from "@/components/ImageViewer.vue";
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljs from "highlight.js";
import CommentList from "@/views/comment/CommentList.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api ={
    getArticleDetail:"/forum/getArticleDetail",
    doLike:"/forum/doLike",
    getUserDownloadInfo:"/forum/getUserDownloadInfo",
    attachmentDownload:"/api/forum/attachmentDownload",
    getUserInfo:"/getUserInfo",
}
//附件
const attachment = ref({});
//下载附件
const downloadAttachment = async (fileId)=>{
    const currentUserInfo =store.getters.getLoginUserInfo;
    if(!currentUserInfo){
        store.commit("showLogin",true);
        return;
    }
    //不需要积分或者是本人的文章直接下载
    if(attachment.value.integral ==0 ||currentUserInfo.user_id!=articleInfo.value.user_id){
        downloadDo(fileId);
        return;
    }
    //非本人文章获取用户积分然后判断用户积分是否足够
    let result = await proxy.Request({
        url:api.getUserDownloadInfo,
        params:{
            fileId:fileId,
        }
    })
    if(!result){
        return;
    }
    //判断用户是否已经下载过了
    if(result.data.have_download){
        downloadDo(fileId)
        return;
    }
    //用户积分不足
    if(result.data.user_integral<attachment.value.integral){
        proxy.Message.warning("你的积分不够无法下载");
        return;
    }

    proxy.Confirm(`你还有${result.data.user_integral}积分,当前下载会扣除${attachment.value.integral},确定要下载么`,
        ()=>{
            downloadDo(fileId);
        })


}
//附件下载

const downloadDo = (fileId)=>{
    document.location.href=api.attachmentDownload+"?fileId="+fileId;
    attachment.value.download_count = attachment.value.download_count +1;
}


//文章
const articleInfo = ref({});
const getArticleDetail= async (articleId)=>{
    let result = await proxy.Request({
        url:api.getArticleDetail,
        params:{
            articleId:articleId,
        },
    });
    if (!result){
        return;
    }

    articleInfo.value = result.data.forumArticleVo;
    attachment.value=result.data.forumArticleAttachmentVo;
    haveLike.value = result.data.haveLike;
    //图片预览
    imagePreview();
    //代码高亮
    highlightCode();

    store.commit("setActivePBoardId",result.data.forumArticleVo.p_board_id);
    store.commit("setActiveBoardId",result.data.forumArticleVo.board_id);
}

//点赞
const doLikeHandler = async ()=>{
    if(!store.getters.getLoginUserInfo){
        store.commit("showLogin",true);
        return;
    }
    let result = await proxy.Request({
        url:api.doLike,
        params:{
            articleId:articleInfo.value.article_id,
        }
    })
    if(!result){
        return;
    }
    haveLike.value = !haveLike.value;
    let goodCount = 1;
    if(!haveLike.value){
        goodCount = -1;
    }
    articleInfo.value.good_count = articleInfo.value.good_count+goodCount;
}
//是否点赞
const haveLike = ref(false);


//图片预览
const imagePreview = ()=>{
    nextTick(()=>{
        const imageNodeList = document.querySelector("#article-content").querySelectorAll("img");
        const imageList = [];
        if(imageNodeList){
            imageNodeList.forEach((item,index)=>{
                const src = item.getAttribute("src");
                imageList.push(src);
                item.addEventListener("click",()=>{
                    imageViewerRef.value.show(index);
                })
            });
        }

        previewImgList.value = imageList;
    })
}
//文章图片列表
const previewImgList = ref([]);
const imageViewerRef = ref(null);


//代码高亮
const highlightCode = ()=>{
    nextTick(()=>{
        let blocks = document.querySelectorAll("pre code");
        blocks.forEach(item=>{
            hljs.highlightBlock(item);
             // 添加行号
            // const lines = item.textContent.split('\n').length - 1;
            // let numbers = '';
            // for (let i = 1; i <= lines; i++) {
            //     numbers += `<span class="hljs-line-number">${i}</span>\n`;
            // }
            // const numbersDiv = document.createElement('div');
            // numbersDiv.className = 'hljs-line-numbers';
            // numbersDiv.innerHTML = numbers;
            // item.parentNode.insertBefore(numbersDiv, item);

        })

    })
};
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert('已复制到剪贴板');
    }, (err) => {
        console.error('复制失败: ', err);
    });
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

onMounted(()=>{
    getArticleDetail(route.params.articleId)
})

//快捷操作
const leftquickPanel = (window.innerWidth-proxy.globalInfo.articleWidth)/2-150;
//跳转到对应模块
const goToPosition = (domId)=>{
    document.querySelector("#"+domId).scrollIntoView();
}

//更新评论数量
const updateCommentCount = (commentCount)=>{
    articleInfo.value.comment_count = commentCount;
}



</script>

<style lang="scss" >
.article-detail-body{
    .board-info{
        line-height: 40px;
        .icon-icon_right{
            margin: 0 10px;
        }
    }
    .detail-container{
        //文章内容
        .article-detail{
            background: #fff;
            padding: 15px;
            .title{
                font-weight: bold;
            }
            .user-info{
                margin-top: 15px;
                display: flex;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;

                .user-info-details{
                    margin-left: 10px;
                    .nick-name{
                        text-decoration: none;
                        color: #4e5969;
                        font-size: 14px;
                    }
                    .nick-name:hover{
                        color: var(--link);
                    }
                    .time-info{
                        margin-top: 5px;
                        font-size: 13px;
                        color: var(--test2);
                        .iconfont{
                            margin-left: 10px;
                        }
                        .iconfont::before{
                            padding-left: 3px;
                        }
                    }
                }
            }
            .article-content{

                margin-top: 10px;
                letter-spacing: 1px;
                line-height: 22px;
                a{
                    text-decoration: none;
                    color:var(--link);
                }
                img{
                    max-width: 90%;
                    cursor: pointer;
                }


            }
        }
        //附件
        .attachment-panel{
            background: #fff;
            margin-top: 20px;
            padding: 20px;
            .title{
                font-size: 18px;
            }
            .attachment-info{
                display: flex;
                align-items: center;
                color: #9f9f9f;
                margin-top: 10px;
                .item{
                    margin-right: 10px;
                }
                .icon-zip-full{
                    font-size: 20px;
                    color:var(--link);
                }
                .file-name{
                    color: #6ca1f7;
                }
                .integral{
                    color: red;
                    padding: 0px 3px;
                }
            }
        }
        //评论
        .comment-panel{
            margin-top: 20px;
            background: #fff;
            padding: 20px;
        }


    }

    .quick-panel{
        position: fixed;
        width: 50px;
        top: 200px;
        text-align: center;
        .quick-item{
            display: flex;
            width: 50px;
            height: 50px;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background: #fff;
            margin-bottom: 35px;
            cursor: pointer;
        }
        .iconfont{
            font-size: 22px;
            color: var(--text2);
        }
        .have-like{
            color: red;
        }
    }

}


.el-header{
    padding: 0;
}


</style>

<style>
pre code.hljs {
    position: relative;
    display: block;
    padding: 30px 10px 2px 0;
    overflow-x: auto;
    font-size: 14px;
    line-height: 24px;
    text-align: left;
    background: #21252b;
    box-shadow: 0 10px 30px 0 rgb(0 0 0 / 40%);
}

/** 3个点 */
pre code.hljs::before {
    position: absolute;
    top: 10px;
    left: 5px;
    width: 12px;
    height: 12px;
    overflow: visible;
    font-weight: 700;
    font-size: 16px;
    line-height: 12px;
    white-space: nowrap;
    text-indent: 75px;
    background-color: #fc625d;
    border-radius: 16px;
    box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    content: attr(codetype);
}


pre code.hljs::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
}

pre code.hljs::-webkit-scrollbar-thumb {
    height: 30px !important;
    background: #d1d8e6;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 19px;
    opacity: 0.8;
}

pre code.hljs::-webkit-scrollbar-thumb:hover {
    background: #a5b3cf;
    background-clip: content-box;
    border: 2px solid transparent;
}

pre code.hljs::-webkit-scrollbar-track-piece{
    width: 30px;
    height: 30px;
    background: #333;
}

::-webkit-scrollbar-button {
    display: none;
}


</style>
