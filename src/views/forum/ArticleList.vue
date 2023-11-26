<template>
<div class="container-body article-list-body"
:style="{width:proxy.globalInfo.contentwidth+'px'}">
<div class="article-panel">
    <div class="top-tab">
        <div :class="['tab',orderType==0?'active':'']" @click="changeOrderType(0)">热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div :class="['tab',orderType==1?'active':'']" @click="changeOrderType(1)">发布时间</div>
        <el-divider direction="vertical"></el-divider>
        <div :class="['tab',orderType==2?'active':'']" @click="changeOrderType(2)">最新</div>
    </div>
    <div class="article-list">
<!--    <div v-if="articleListInfo.list.length === 0">暂无数据</div>-->
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

</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick} from "vue";
import {useRouter,useRoute} from "vue-router";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import PageDataList from "@/components/PageDataList.vue";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api={
    loadArticle:"/forum/loadArticle",
};
//一级模块
const pBoardId = ref(0);
//二级模块
const boardId  = ref(0);

const articleListInfo = ref({
    list: [] // 初始化为一个空数组
});//获取文章列表

const loading = ref(false);
const orderType = ref(0);
const loadArticle = async ()=>{
    loading.value=true;
    let params ={
        pageNo:articleListInfo.value.pageNo,
        pBoardId:pBoardId.value,
        boardId:boardId.value,
        orderType:orderType.value,
    };


    let result = await proxy.Request({
        url:api.loadArticle,
        params:params
    });
    loading.value=false;
    if(!result){
        return;
    }
    articleListInfo.value =result.data;

};
loadArticle();
//切换热榜、最新信息
const changeOrderType = (type)=>{
    orderType.value = type;
    loadArticle();
};



//监听路由变化
watch(()=>route.params,
    (newval,oldval)=>{
    pBoardId.value = newval.pBoardId;
    boardId.value = newval.boardId;
    loadArticle();
    },
    {immediate:true,deep:true});



</script>

<style lang="scss" scoped>
.article-list-body{
  .article-panel{
    background: #fff;
    .top-tab{
      display: flex;
      align-items: center;
      padding:15px;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
        .tab{
            cursor: pointer;
        }
        .active{
            color: var(--link);
        }
    }
  }
}
</style>