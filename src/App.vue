<template>
    <el-config-provider :locale="locale" message="config">
        <RouterView/>
    </el-config-provider>
</template>

<script setup>
import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

const toggle = () => {
    language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}

</script>

<style scoped>


</style>
