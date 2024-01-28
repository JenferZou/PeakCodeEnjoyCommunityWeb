<template>
<div>
    <el-dialog
            :model-value="show"
            :title="title"
             class="cust-dialog"
            :show-close="showClose"
            :draggable="true"
            :close-on-click-modal="false"
            @close="close"
            :width="width"
            :top="top"
    >
        <div class="dialog-body">
            <slot></slot>
        </div>

        <template v-if="(buttons&&buttons.length>0)||showCancle">
            <div class="dialog-footer">
                <el-button link @click="close" v-if="showCancle">取消</el-button>
                <el-button v-for="btn in buttons" :type="btn.type" @click="btn.click" > {{btn.text}}
                </el-button>
            </div>
        </template>
    </el-dialog>
</div>
</template>

<script setup>
const props = defineProps({
    show:{
        type:Boolean,
        default:true,
    },
    title:{
        type:String,
        default:"标题",
    },
    showClose:{
        type:Boolean,
        default:true,
    },
    width:{
        type:String,
        default:"30%",
    },
    top:{
        type:String,
        default:"30px",
    },
    buttons:{
        type:Array,
    },
    showCancle:{
        type:Boolean,
        default:true,
    }

});


//关闭dialog
const emit = defineEmits();
const close = ()=>{
emit("close");
};
</script>

<style lang="scss">
.cust-dialog{
    .el-dialog_body{
        padding: 0px;
    }
    .dialog-body{
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 15px;
        min-height: 15px;
        max-height: calc(100vh - 200px);
        overflow: auto;
    }
    .dialog-footer{
        text-align: right;
        padding: 10px 20px;
    }
}
</style>
