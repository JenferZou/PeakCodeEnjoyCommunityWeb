<template>
<div class="container-body article-list-body"
:style="{width:proxy.globalInfo.articleListWidth+'px'}">
    <!--二级板块信息-->
    <div class="sub-board" v-if="pBoardId" >
        <span :class="['board-item',boardId==0?'active':'']">
            <router-link :to="`/forum/${pBoardId}`">全部</router-link>
        </span>
        <span v-for="item in subBoardList" style="height: 20px"
              :class="['board-item',item.board_id==boardId?'active':'']" >
           <router-link :to="`/forum/${item.p_board_id}/${item.board_id}`">{{item.board_name}}</router-link>
        </span>
    </div>
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
                <ArticleListItem :data="data" :show-comment="showComment"></ArticleListItem>
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
import {useStore} from "vuex";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api={
    loadArticle:"/forum/loadArticle",
};
//一级模块
const pBoardId = ref(0);
//二级模块
const boardId  = ref(0);

//二级板块
const subBoardList = ref([]);

const setSubBoard =()=>{
    subBoardList.value=store.getters.getSubBoardList(pBoardId.value);
};

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
//切换热榜、最新信息
const changeOrderType = (type)=>{
    orderType.value = type;
    loadArticle();
};



//监听路由变化
watch(()=>route.params,
    (newval,oldval)=>{
    pBoardId.value = newval.pBoardId;
    boardId.value = newval.boardId || 0;
        setSubBoard();
        loadArticle();
        store.commit("setActivePBoardId",newval.pBoardId);
        store.commit("setActiveBoardId",newval.boardId);

    },
    {immediate:true,deep:true});

watch(
    ()=>store.state.boardList,(newVal,oldValue)=>{
        setSubBoard();
    },
    {immediate:true,deep:true}
);


const showComment =ref(false);
watch(()=>store.state.sysSetting,(newVal,oldVal)=>{
    if(newVal){
        showComment.value = newVal.commentOpen;
    }
},{immediate:true,deep:true})
</script>

<style lang="scss" scoped>
.article-list-body{
    .sub-board{
        margin-top: 5px;
        padding: 5px 0px 10px 0px;
        .board-item{
            background: #fff;
            border-radius: 15px;
            padding: 2px 10px;
            margin-right: 10px;
            color: #909090;
            cursor: pointer;
            font-size: 14px;
            a{
                text-decoration: none;
                color: #909090;
            }
        }
        .active {
            background: var(--link);
            a{
                color: #fff;
            }
        }
    }
  .article-panel{
    background: #fff;
    .top-tab{
        margin-top: 10px;
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
