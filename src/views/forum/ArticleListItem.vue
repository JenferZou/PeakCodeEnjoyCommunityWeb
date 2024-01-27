<template>
<div class="article-item">
    <div class="article-item-inner">
        <div class="article-body">
            <div class="user-info">
                <router-link :to="'/user/'+data.user_id" class="link-info">
                    {{data.nick_name}}
                </router-link>
                <el-divider direction="vertical"></el-divider>
                <div class="post-time">{{data.post_time}}</div>
                <div class="address">&nbsp;·&nbsp;{{data.user_ip_address}}</div>
                <el-divider direction="vertical"></el-divider>
                <router-link :to="`/forum/${data.p_board_id}`"  class="link-info">
                    {{data.p_board_name}}
                </router-link>
                <template v-if="data.board_name">
                    <span>&nbsp;/&nbsp;</span>
                    <router-link :to="`/forum/${data.p_board_id}/${data.board_id}`"  class="link-info">
                        {{data.board_name}}
                    </router-link>
                </template>
            </div>
            <router-link :to="`/post/${data.article_id}`" class="title">
                <span v-if="data.top_type==1" class="top" >置顶</span>
                <span style="font-weight: bold">{{data.title}}</span>
            </router-link>
            <div class="summary">{{data.summary}}</div>
            <div class="article-info">
                <span class="iconfont icon-yanjing_xianshi">
                    {{data.read_count==0?"阅读":data.read_count}}
                </span>
                <span class="iconfont icon-dianzan">
                    {{data.good_count==0?"点赞":data.good_count}}
                </span>
                <span class="iconfont icon-xinjian">
                    {{data.comment_count==0?"评论":data.comment_count}}
                </span>
            </div>

        </div>

        <router-link :to="`/post/${data.article_id}`">
            <Cover :cover="data.cover" :width="100" v-if="data.cover"></Cover>
        </router-link>

    </div>
</div>
</template>

<script setup>
import Cover from "@/components/Cover.vue";

const props = defineProps({
    data:{
        type:Object,
        required:true,
    },



})
</script>

<style lang="scss" scoped>
.article-item {
    padding: 5px 10px 0px 3px;
    .article-item-inner {
        border-bottom: 1px solid #ddd;
        padding: 10px;
        display: flex;

        .article-body {
            flex: 1;

            .user-info {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #4e5969;

                .link-info {
                    color: #494949;
                    text-decoration: none;
                }

                .link-info:hover {
                    color: var(--link);
                }

                .post-time {
                    font-size: 13px;
                    color: #9a9a9a;
                }
            }

            .title {
                font-weight: bold;
                text-decoration: none;
                color: #337ab7;
                padding: 5px 0px;
                font-size: 15px;
                display: inline-block;
                //max-resolution: 10px 0px;
                .top{
                    //font-weight: bold;
                    font-size: 12px;
                    border-radius: 5px;
                    border: 1px solid var(--pink);
                    color: var(--pink);
                    padding: 0 5px;
                    margin-right: 10px;
                }
            }

            .summary {
                font-size: 14px;
                color: #86909c;
            }

            .article-info {
                margin-top: 10px;
                display: flex;
                align-items: center;
                font-size: 13px;

                .iconfont {
                    color: #86909c;
                    margin-right: 25px;
                    font-size: 14px;
                }

            }
        }
    }

    .article-item:hover {
        background: #fffbfb;
    }
}
</style>
