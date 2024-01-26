<template>
<v-md-editor
:model-value="modelvalue"
:height="height+'px'"
:disabled-menus="[]"
:include-level="[1,2,3,4,5,6]"
@upload-image="uploadImageHandler"
@change="change"
    ></v-md-editor>
</template>

<script setup>
 import VMdEditor from "@kangc/v-md-editor";
 import"@kangc/v-md-editor/lib/style/base-editor.css";
 import "@kangc/v-md-editor/lib/theme/style/github.css";
 import githubTheme from "@kangc/v-md-editor/lib/theme/github.js"

 import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick} from "vue";
 import {useRouter,useRoute} from "vue-router";
 import {useStore} from "vuex";
 import hljs from "highlight.js";
 const {proxy} = getCurrentInstance();
 const router = useRouter();

 VMdEditor.use(githubTheme,{
     Hljs: hljs
 });

 const emit = defineEmits(["htmlContent"]);
const change = (markdownContent,htmlContent)=>{
    emit("update:modelValue",markdownContent);
    emit("htmlContent",htmlContent);
}
 const props = defineProps({
  modelvalue: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 500,
  },
});

const uploadImageHandler = async (event,insertImage,files) => {
    let result =await proxy.Request({
        url:"file/uploadImage",
        params:{
            file:files[0],
        },
    })
    if(!result){
        return;
    }
    const url = proxy.globalInfo.imageUrl+result.data.fileName;
    insertImage({
        url:url,
        desc:"图片"
    });
};
</script>

<style scoped lang="scss">

</style>
