<template>
<div class="container-body search-body"
     :style="{width:proxy.globalInfo.articleListWidth+'px'}"

>
    <div class="search-pannel" >
        <el-form
            :model=" formData"
            :rules="rules"
            ref="formDataRef">

            <el-form-item prop="keyword" >
                <el-input
                    clearable
                    size="large"
                    placeholder="请输入要查找的关键词"
                    v-model="formData.keyword"
                    @keydown.enter="searchOnEnter"
                    @change="changeInput"
                >
                    <template #suffix>
        <span
            class="iconfont icon-sousuo"
            @click="handleSearchClick"
        ></span>
                    </template>
                </el-input>

            </el-form-item>

        </el-form>

    </div>
    <div class="article-list">
        <!--    <div v-if="articleListInfo.list.length === 0">暂无数据</div>-->
        <PageDataList
            :loading="loading"
            :dataSource="articleListInfo"
            @loadData="search">
            <template #default="{data}">
                <ArticleListItem :data="data" :show-comment="showComment"></ArticleListItem>
            </template>
        </PageDataList>

    </div>
</div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import PageDataList from "@/components/PageDataList.vue";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import {useStore} from "vuex";
const {proxy} = getCurrentInstance();
const router = useRouter();
const store = useStore();


const api={
    loadArticle:"/forum/search",
};


const formData = ref({});
const formDataRef = ref();
const rules = {
    keyword: [{ required: true, message: '请输入要查找的关键词' }],
};



const articleListInfo = ref({
    list: [] // 初始化为一个空数组
});//获取文章列表

const loading = ref(false);

const showComment =ref(false);
watch(()=>store.state.sysSetting,(newVal,oldVal)=>{
    if(newVal){
        showComment.value = newVal.commentOpen;
    }
},{immediate:true,deep:true});

const handleSearchClick = () => {
    const trimmedKeyword = formData.value.keyword.trim();
    if (trimmedKeyword !== "") {
        formData.value.keyword = trimmedKeyword; // 移除空格
        search();
    } else {
        // 如果关键词为空，不执行搜索操作
    }
};


const changeInput = () => {
    if (formData.value.keyword.trim() === "") {
        // 如果关键词为空，不执行搜索操作
        articleListInfo.value = { list: [] }; // 设置为一个空数组
    }
};

const search = async () => {
    if (formData.value.keyword.trim() !== "") {
        loading.value = true;
        let params = {
            pageNo: articleListInfo.value.pageNo,
            keyword: formData.value.keyword,
        };

        let result = await proxy.Request({
            url: api.loadArticle,
            params: params,
        });

        loading.value = false;
        if (result && result.data) {
            articleListInfo.value = result.data;
        }
    }
};

const searchOnEnter = (event) => {
    event.preventDefault();  // 阻止默认的提交表单行为

    // 执行搜索操作
    search();
};

</script>

<style scoped lang="scss">
.container-body{
    margin-top: 10px;
}
.search-body{
    margin-top: 10px;
    background: #fff;
    padding: 10px;
    min-height: calc(100vh - 100px);
    .search-pannel{
        display: flex;
        justify-content: center;
        .el-input{
            width: 700px;
        }
    }
}



</style>
