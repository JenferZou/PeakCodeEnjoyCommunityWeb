<template>
    <div>
                <Head></Head>

                    <div class="container-body article-detail-body"
                         :style="{width:proxy.globalInfo.articleWidth+'px'}"
                         v-if="Object.keys(articleInfo).length>0"
                    >
<!--                        板块信息-->
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
<!--                        文章详情-->
                        <div class="detail-container" :style="{width:proxy.globalInfo.contentwidth +'px'}">
                            <div class="article-detail">
                                <!--文章标题-->
                                <div class="title">
                                    {{articleInfo.title}}
                                    <el-tag v-if="articleInfo.status==0" type="danger">待审核</el-tag>
                                </div>
                                <!--用户信息-->
                                <div class="user-info">
                                    <!--
                                    ToDo
                                    头像
                                    -->
                                    <div class="user-info-details">
                                        <router-link
                                            class="nick-name" :to="`/user/${articleInfo.user_id}`">
                                            {{articleInfo.nick_name}}
                                        </router-link>
                                        <div class="time-info">
                                            <span class="post-time">{{articleInfo.post_time}}</span>
                                            <span class="address">&nbsp;·&nbsp;{{articleInfo.user_ip_address}}</span>
                                            <span class="iconfont icon-yanjing_xianshi">
                                            {{articleInfo.read_count==0?"阅读":articleInfo.read_count}}
                                        </span>
                                            <router-link :to="`/editArticle/${articleInfo.article_id}`"
                                                         v-if="articleInfo.user_id==currentUserInfo.userId"
                                                         class="a-link">
                                                <span class="iconfont icon-bianji1">编辑</span>
                                            </router-link>
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
                            <div class="comment-panel" id="view-comment" v-if="showComment">
                                <CommentList
                                    v-if="articleInfo.article_id"
                                    :article-id="articleInfo.article_id"
                                    :article-user-id="articleInfo.user_id"
                                    @updateCommentCount="updateCommentCount"
                                >
                                </CommentList>
                            </div>

                        </div>

                        <!--                        目录-->
                        <div class="toc-pannel">
                            <div class="toc-containner">
                                <div class="toc-title">
                                    目录
                                </div>
                                <div class="toc-list">
                                    <template v-if="tocArray.length==0">
                                        <div class="no-toc">
                                            暂无目录
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div v-for="toc in tocArray">
                                            <span :class="['toc-item',toc.id==curAnchorId?'active':'']"
                                                  :style="{'padding-left':toc.level * 15 + 'px'}"
                                                   @click="gotoAnchor(toc.id)"
                                            >{{toc.title}}</span>
                                        </div>
                                    </template>
                                </div>
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
                                      v-if="showComment"
                                      type="info" :hidden="!articleInfo.comment_count>0"
                            >
                                <div class="quick-item"
                                     @click="goToPosition('view-comment')"
                                     v-if="showComment"
                                >
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
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick, onUnmounted} from "vue";
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


const currentUserInfo =ref({});

//附件
const attachment = ref({});
//下载附件
const downloadAttachment = async (fileId)=>{

    if(Object.keys(currentUserInfo.value).length === 0){
        store.commit("showLogin",true);
        return;
    }
    //不需要积分或者是本人的文章直接下载
    if(attachment.value.integral ==0 ||currentUserInfo.value.user_id!=articleInfo.value.user_id){
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
    store.commit("setActivePBoardId",result.data.forumArticleVo.p_board_id);
    store.commit("setActiveBoardId",result.data.forumArticleVo.board_id);
    //图片预览
    imagePreview();
    //代码高亮
    highlightCode();

    //生成目录
    makeToc();


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

watch(()=>store.state.loginUserInfo,
    (newVal,oldVal)=>{
    currentUserInfo.value = newVal||{};
},
{immediate:true,deep:true});

onMounted(()=>{
    getArticleDetail(route.params.articleId);
})

//快捷操作
const leftquickPanel = (window.innerWidth-proxy.globalInfo.articleWidth)/2-130;
//跳转到对应模块
const goToPosition = (domId)=>{
    document.querySelector("#"+domId).scrollIntoView();
}

//更新评论数量
const updateCommentCount = (commentCount)=>{
    articleInfo.value.comment_count = commentCount;
}

//获取目录
const tocArray =ref([]);

const makeToc =()=>{
    nextTick(()=>{
        const tocTags =["H1","H2","H3","H4","H5","H6"];
        //获取所有H标签
        const contentDom = document.querySelector("#article-content");
        const childNodes = contentDom.childNodes;
        let index = 0;
        childNodes.forEach((item)=>{
            let tagName = item.tagName;
            if(tagName==undefined||!tocTags.includes(tagName.toUpperCase())){
                return true;
            }
            index++;
            let id = "toc"+index;
            item.setAttribute("id",id);
            tocArray.value.push({
                id:id,
                title:item.innerText,
                level:Number.parseInt(tagName.substring(1)),
                offsetTop:item.offsetTop,
            })
        })
    })
};

const curAnchorId = ref(null);
const gotoAnchor = (domId)=>{
    const dom = document.querySelector("#"+domId);
    dom.scrollIntoView({
        behavior:"smooth",
        block:"start",
    })
};


const listenerScroll = ()=>{
    let currentScrollTop = getScrollTop();
    tocArray.value.some((item,index)=>{
        if(index<tocArray.value.length-1&&
        currentScrollTop>=tocArray.value[index].offsetTop&&
            currentScrollTop<tocArray.value[index+1].offsetTop
            ||index==tocArray.value.length-1&&
            currentScrollTop>=tocArray.value[index].offsetTop
        ){
            curAnchorId.value = item.id;
        }
    })
}

//获取滚动条的高度
const getScrollTop = ()=>{
    let scrollTop = document.documentElement.scrollTop ||
        window.pageYOffset || document.body.scrollTop;
    return scrollTop;
};

onMounted(()=>{
    window.addEventListener("scroll",listenerScroll,false);
})

onUnmounted(()=>{
    window.removeEventListener("scroll",listenerScroll,false)
})

const showComment =ref(false);
watch(()=>store.state.sysSetting,(newVal,oldVal)=>{
    if(newVal){
        showComment.value = newVal.commentOpen;
    }
},{immediate:true,deep:true})

</script>

<style lang="scss" >
.article-detail-body{
    position: relative;
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
                line-height: 21px;
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
//目录样式
.toc-pannel{
    position: absolute;
    top: 45px;
    right: 0px;
    width: 80px;
    .toc-containner{
        width: 260px;
        position: fixed;
        background-color: #fff;
        .toc-title{
            border-bottom: 1px solid #ddd;
            padding: 10px;
        }
        .toc-list{
            max-height: calc(100vh - 100px);
            overflow: auto;
            padding: 5px;
            .no-toc{
                text-align: center;
                color: #5f5d5d;
                line-height: 40px;
                font-size: 13px;
            }
            .toc-item{
                cursor: pointer;
                display: block;
                line-height: 35px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: #555666;
                border-radius: 3px;
                font-size: 14px;
                border-left: 2px solid #fff;
            }
            .toc-item:hover{
                background: #eeeded;
            }
            .active{
                color: var(--link);
                background: #eeeded;





                border-left: 2px solid #6ca1f7;
                border-radius: 0px 3px 3px 0px;
            }
        }
    }
}

.el-header{
    padding: 0;
}


</style>

<style>
/*代码高亮*/
pre code.hljs {
    position: relative;
    display: block;
    padding: 30px 10px 2px 10px;
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
