<template>

    <div v-if="!loading&&dataSource.list!=null&&dataSource.list.length==0">
        <Nodata></Nodata>
    </div>
    <div class="skeleton" v-if="loading">
        <el-skeleton :row="3" animated></el-skeleton>
    </div>

  <div v-for="item in dataSource.list" v-if="!loading">
      <slot :data="item"></slot>
  </div>
  <div class="pagination">
      <el-pagination
              :page-size="dataSource.pageSize"
              background
              :current-page.syn="dataSource.pageNo"
              :pager-count="11"
              layout="prev, pager, next"
              :total="dataSource.totalCount"
              @current-change="handlePageNoChange"
              style="text-align: right"
      />
  </div>
</template>

<script setup>
const props = defineProps({
    dataSource:{
        type:Object,
    },
    loading:{
        type:Boolean,
    }
});

const emit = defineEmits(["loadData"])
const handlePageNoChange = (pageNo)=>{
    props.dataSource.pageNo = pageNo;
    emit("loadData");

};

</script>

<style lang="scss">
.skeleton{
  padding: 15px;
}
</style>
