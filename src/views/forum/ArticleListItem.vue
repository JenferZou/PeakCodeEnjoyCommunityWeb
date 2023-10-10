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
                <router-link :to="'/'"  class="link-info">
                    {{data.p_board_name}}
                </router-link>
                <template v-if="data.board_name">
                    <span>&nbsp;/&nbsp;</span>
                    <router-link :to="'/'"  class="link-info">
                        {{data.board_name}}
                    </router-link>
                </template>
            </div>
            <router-link to="" class="title"> {{data.title}}</router-link>
            <div class="summary">{{data.summary}}</div>
            <div class="article-info">
                <span class="iconfont icon-yanjing_xianshi">
                    {{data.readCount==0?"阅读":data.read_count}}
                </span>
                <span class="iconfont icon-dianzan">
                    {{data.goodCount==0?"点赞":data.good_count}}
                </span>
                <span class="iconfont icon-xinjian">
                    {{data.commentCount==0?"评论":data.comment_count}}
                </span>
            </div>

        </div>

        <div class="cover" v-if="data.cover">
            <img src="'/api/file/getImage/'+ data.cover"/>
        </div>

    </div>
</div>
</template>

<script setup>
const props = defineProps({
    data:{
        type:Object,
        required:true,
    },



})
</script>

<style lang="scss">
.article-item {
    padding: 5px 10px 0px 10px;

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
                    margin-left: 5px;
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
                color: #4a4a4a;
                font-size: 14px;
                display: inline-block;
                max-resolution: 10px 0px;
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