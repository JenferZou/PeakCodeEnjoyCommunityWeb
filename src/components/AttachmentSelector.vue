<template>
<div class="attachment-selector">
    <template v-if="modelValue">
        <div class="file-show">
            <div class="file-name" :title="modelValue.name">
                {{modelValue.name}}
            </div>
            <div class="iconfont icon-remove" @click="removeFile"></div>
        </div>
    </template>
    <el-upload v-else
            name="file"
            :show-file-list="false"
            accept=".zip,.rar"
            :multiple="false"
            :http-request="selectFile">
        <el-button type="primary">
            选择文件
        </el-button>
    </el-upload>
</div>
</template>

<script setup>
import {ref, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
const {proxy} = getCurrentInstance();
const router = useRouter();
const store = useStore();

const props =defineProps({
    modelValue:{
        type: Object,
        default: null
    },
})

const emit = defineEmits();

const localFile = ref();

const selectFile = (file) => {
    emit('update:modelValue',file.file);
};
const removeFile = () => {
    emit('update:modelValue',null);
};


</script>

<style scoped lang="scss">
.attachment-selector{
    width: 100%;
    .file-show{
        display: flex;
        justify-content: space-around;
        .file-name{
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--link);
        }
        .icon-remove{
            width: 20px;
            color: var(--test2);
            cursor: pointer;
            margin-left: 10px;
        }
    }

}


</style>
