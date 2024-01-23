<template>
   <el-image
        :src="src"
        class="comment-img"
        :preview-src-list="imageList ? imageList : [src]"
        :zoom-rate="1.2"
        :initial-index="0"
        fit="scale-down"
        loading="lazy"
        hide-on-click-modal


    ></el-image>
</template>

<script setup>
const props = defineProps({
    src: {
        type: String,
    },
    imageList: {
        type: Array,
    },
})


</script>

<style scoped lang="scss">
.comment-img{
  width: 80px;
  height: 80px;
  background: #eee;
}



</style>
