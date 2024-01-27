<template>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="450px"
        :showCancel="false"
        @close="dialogConfig.show = false">
        <el-form
            :model="formData"
            ref="formDataRef"
            label-width="80px"
        >
            <el-form-item label="日期" >
                <el-date-picker v-model="formData.create_time_range"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD"
                                type="daterange"
                                @change="loadRecord"
                ></el-date-picker>
            </el-form-item>
        </el-form>
        <div class="data-item">
            <div class="record-type">类型</div>
            <div class="integral">积分</div>
            <div class="create_time">时间</div>
        </div>
        <PageDataList
            :loading="loading"
            :dataSource="recordInfo"
            @loadData="loadRecord">
            <template #default="{data}">
                <div class="data-item">
                    <div class="record-type">{{data.operTypeName}}</div>
                    <div :class="['integral',
                    data.integral > 0 ? 'add' : 'reduce'
                    ]">{{data.integral}}</div>
                    <div class="create_time">{{data.create_time}}</div>
                </div>
            </template>
        </PageDataList>
    </Dialog>
</template>

<script setup>
import {nextTick, reactive} from "vue";
import { ref, getCurrentInstance} from "vue";
import {useRouter, useRoute} from "vue-router"
import CoverUpload from "@/components/CoverUpload.vue";
import PageDataList from "@/components/PageDataList.vue";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
const { proxy}= getCurrentInstance();
const router =useRouter();
const route =useRoute();

const api = {
    loadUserIntegralRecord: '/ucenter/loadUserIntegralRecord',
}

const dialogConfig = reactive({
    show: false,
    title: '查看用户积分记录',
    buttons: [
        {
            text: '确定',
            type: 'primary',
            click: () => {
                dialogConfig.show = false;
            }
        }
    ]
})
const formData = ref([]);
const formDataRef = ref();



const loading = ref(false);
const recordInfo = ref({});
const loadRecord = async ()=>{
    loading.value=true;
    let params ={
        pageNo:recordInfo.value.pageNo,
    };
    if (formData.value.create_time_range){
        params.create_time_start = formData.value.create_time_range[0];
        params.create_time_end = formData.value.create_time_range[1];
    }

    let result = await proxy.Request({
        url:api.loadUserIntegralRecord,
        params:params,
        showLoading:false,
    });
    loading.value=false;
    if(!result){
        return;
    }
    recordInfo.value =result.data;


};

const showRecord = ()=>{
    dialogConfig.show = true;
    loadRecord();
};

defineExpose({showRecord});
</script>

<style scoped lang="scss">
.data-item{
    display: flex;
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    .add{
        color: red;
    }
    .reduce{
        color: green;
    }
    .record-type{
        width: 120px;
    }
    .integral{
        width: 120px;
    }
    .create_time{
        text-align: center;
        flex: 1;
    }
}


</style>
