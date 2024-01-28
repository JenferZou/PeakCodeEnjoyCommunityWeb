<template>
<div class="footer">
<div class="footer-content"
     :style="{width:proxy.globalInfo.headbodywidth+'px'}"
>
<el-row>
    <el-col :span="6" class="item">
        <div class="logo">

        </div>
        <div class="info">一个精简的编程社区</div>
    </el-col>
    <el-col :span="6" class="item">
        <div class="title">网站相关</div>
    </el-col>
    <el-col :span="6" class="item">
        <div class="title">网站相关</div>

    </el-col>
    <el-col :span="6" class="item">
        <div class="title">网站相关</div>

    </el-col>

</el-row>
</div>
</div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter,useRoute} from "vue-router";

const {proxy} = getCurrentInstance();
const router = useRouter();

</script>

<style scoped lang="scss">
.footer{
  background: #e6f4ff;
  height: 140px;
  margin-top: 10px;
  .footer-content{
      margin: 0px auto;
      .item{
          text-align: left;

      }
  }
}
</style>
