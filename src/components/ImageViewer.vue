<template>
<div class="image-view">
    <el-image-viewer
        :initial-index="previewImgIndex"
        hide-on-click-modal
        :url-list="imageList"
        @close="closeImgViewer"
        v-if="previewImgIndex!=null"

    >

    </el-image-viewer>
</div>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
    imageList:{
        type:Array,
    },
})

const show = (index)=>{
    stopScroll();
    previewImgIndex.value = index;
};
defineExpose({show});
const previewImgIndex = ref(null);
const closeImgViewer = ()=>{
    startScroll();
    previewImgIndex.value = null;
}
//打开图片预览后滚动条静止滚动
const stopScroll=()=>{
    document.body.style.overflow="hidden";
}
//关闭图片预览后进展滚动开始滚动
const startScroll=()=>{
    document.body.style.overflow="auto";
}
</script>

<style scoped lang="scss">

</style>