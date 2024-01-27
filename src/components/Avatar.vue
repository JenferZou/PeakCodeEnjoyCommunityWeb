<template>
<div class="avatar" :style="{width:width+'px',height:width+'px','border-radius':width/2+'px'}" >
<el-image v-if="userId" :style="{width:width+'px',height:width+'px','border-radius':width/2+'px'}"
:src="proxy.globalInfo.avatarUrl+userId"
          :zoom-rate="1.2" fit="scale-down"
          loading="lazy" @click="goToUcenter"
>

</el-image>
<!--    <el-image v-else :style="{width:width+'px',height:width+'px','border-radius':width/2+'px'}"-->
<!--          :src="proxy.globalInfo.avatarUrl"-->
<!--          :zoom-rate="1.2" fit="scale-down"-->
<!--          loading="lazy" @click="goToUcenter"-->
<!--&gt;-->
<!--</el-image>-->
</div>
</template>

<script setup>
import {getCurrentInstance} from "vue";
const {proxy} = getCurrentInstance();
import router from "@/router";

const props = defineProps({
    userId: {
        type: String,
    },
    width:{
        type:Number,
        default:60
    },
    addLink:{
        type:Boolean,
        default:true
    }
});

const goToUcenter = ()=>{
    if(props.addLink){
        router.push("/user"+"/"+props.userId);
    }
}
</script>

<style  lang="scss">
//.iconfont{
//    font-size: 50px;
//}
</style>
