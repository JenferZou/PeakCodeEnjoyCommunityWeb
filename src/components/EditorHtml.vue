<template>
  <div class="editor-html" style="z-index: 2000">
      <Toolbar style="border-bottom: 1px solid #ccc"
               :editor="editorRef"
               :defaultConfig="toolbarConfig"
               :mode="mode"
      />

      <Editor
          :style="{height: height + 'px','overflow-y': 'hidden' }"
          :model-value="modelValue"
          :defaultConfig="editorConfig"
           @onCreated="handleCreated"
           @onChange="onChange"
      />


  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import {ref,onBeforeUnmount,shallowRef} from "vue";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {getCurrentInstance} from "vue";
import store from "@/store";
const {proxy} = getCurrentInstance();

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    height: {
        type: Number,
        default: 500,
    },
});

const editorRef = shallowRef();
const mode = ref("default");
const toolbarConfig = {
    excludeKeys:["uploadVideo",],
}
const editorConfig = {
    placeholder:"请输入内容...",
    excludeKeys:["uploadVideo"],
    MENU_CONF:{
        uploadImage:{
            maxFileSize:3*1024*1024,
            server:"/api/file/uploadImage",
            filedName:"file",
            customInsert(responseData,insertFn){
                if (responseData.code==200){
                    insertFn(
                        proxy.globalInfo.imageUrl+responseData.data.fileName,
                        "",
                        ""
                    );
                    return;
                }else if(responseData.code==901){
                    //登陆超时
                    store.commit("showLogin",true);
                    store.commit("updateLoginUserInfo",null);
                    return;
                }
                proxy.Message.error(responseData.info);
            }
        }
    }
};
const emit =defineEmits();
const onChange = (editor)=>{
    emit("update:modelValue",editor.getHtml());
};

onBeforeUnmount(()=>{
    const editor = editorRef.value;
    if (editor==null){
        return;
    }
    editor.destroy();
});

const handleCreated = (editor)=>{
    editorRef.value =editor;
};


</script>

<style scoped lang="scss">

</style>
