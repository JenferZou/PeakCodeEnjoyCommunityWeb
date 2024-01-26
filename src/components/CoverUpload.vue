<template>
<div class="cover-upload">
    <el-upload
            name="file"
            :show-file-list="false"
            accept=" png,.PNG, jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
            :multiple="false"
            :http-request="uploadImage">
        <div class="cover-upload-btn">
            <template v-if="localFile">
                <img :src="localFile"/>
            </template>
            <template v-else>
                <img :src="(imageUrlPrefix?imageUrlPrefix:proxy.globalInfo.imageUrl)+modelValue.imageUrl"
                     v-if="modelValue && modelValue.imageUrl"/>
                <span class="iconfont icon-add" v-else></span>
            </template>
        </div>
    </el-upload>
</div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick} from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
const {proxy} = getCurrentInstance();
const router = useRouter();
const store = useStore();

const props =defineProps({
    modelValue:{
        type: Object,
        default: null
    },
    imageUrlPrefix:{
        type: String,
    }
})

const emit = defineEmits();

const localFile = ref();

const uploadImage = (file) => {
    file = file.file;
    let img =  new FileReader();
    img.readAsDataURL(file);
    img.onload = ({target})=>{
       localFile.value = target.result;
    }
    emit('update:modelValue',file);
};



</script>

<style scoped lang="scss">
.cover-upload{
    .cover-upload-btn{
        background: rgb(251,251,251);
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont{
            font-size: 50px;
            color: #ddd;
        }
        img{
            width: 100%;
        }
    }
}


</style>
