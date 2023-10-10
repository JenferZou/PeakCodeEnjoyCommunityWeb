<template>
<div class="container-body article-list-body"
:style="{width:proxy.globalInfo.contentwidth+'px'}">
<div class="article-panel">
    <div class="top-tab">
        <div>热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div>发布时间</div>
        <el-divider direction="vertical"></el-divider>
        <div>最新</div>
    </div>
    <div class="article-list">
<!--    <div v-if="articleListInfo.list.length === 0">暂无数据</div>-->
    <div v-for="item in articleListInfo.list">
        <ArticleListItem :data="item"></ArticleListItem>
    </div>
</div>

</div>

</div>

</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api={
    loadArticle:"/forum/loadArticle",
};

const articleListInfo = ref({
    list: [] // 初始化为一个空数组
});//获取文章列表
const loadArticle = async ()=>{
    let result = await proxy.Request({
        url:api.loadArticle,
        params:{
            boardId:0,
        },
    });
    if(!result){
        return;
    }
    articleListInfo.value =result.data;

};
onMounted(()=>{
    loadArticle();

})



</script>

<style lang="scss">
.article-list-body{
  .article-panel{
    background: #fff;
    .top-tab{
      display: flex;
      align-items: center;
      padding:15px;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>