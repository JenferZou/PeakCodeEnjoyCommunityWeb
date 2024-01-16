<template>
<div class="post-comment-panel">
    <Avatar :width="avatarWidth" :userId="userId"></Avatar>
    <div class="comment-form">
        <el-form :model="formData" :rules="rule" ref="formDataRef" >
            <el-form-item prop="content" >
                <el-input v-model="formData.content"
                          clearable
                          type="textarea"
                          :placeholder="placeholderInfo"
                          :maxlength="150"
                          resize="none"
                          show-word-limit
                          :rows="3"

                >

                </el-input>
                                    <div class="insert-img" v-if="showInserImg">
                                        <el-upload name="file"
                                                   :show-file-list="false"
                                                   accept=".jpg,.jpeg,.png,.gif,.gif,.BMP"
                                                   :multiple="false"
                                                   :http-request="selectImg"
                                        >
                                            <span class="iconfont icon-img"></span>
                                        </el-upload>
                                    </div>
            </el-form-item>
        </el-form>
    </div>
    <div class="sent-btn" @click="postCommentDo">
        发表
    </div>
</div>
</template>

<script setup>
import {getCurrentInstance, nextTick, ref, watch} from "vue";
const {proxy} = getCurrentInstance();
const api = {
    postComment:"/comment/postComment",
}
const props = defineProps({
    avatarWidth:{
        type:Number,
    },
    userId:{
        type:String,
    },
    showInserImg:{
        type:Boolean,
    },
    placeholderInfo:{
        type:String,
        default:'请输入评论内容'
    },
    articleId:{
        type:String,
    },
    pCommentId:{
        type:Number,
    },
    replyUserId:{
        type:String,
    }


})

//form信息
const formData = ref({});
const formDataRef = ref();
const rule = {
    content:[
        {required:true,message:'请输入评论内容'}
    ]
};
const emit = defineEmits(["postCommentFinish"])
const postCommentDo = ()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return;
        }
        let params =Object.assign({},formData.value);
        params.articleId = props.articleId;
        params.pCommentId = props.pCommentId;
        params.replyUserId = props.replyUserId;

        let result = await proxy.Request({
            url:api.postComment,
            params
        })
        if(!result){
            return;
        }
        proxy.Message.success('评论发表成功');
        formDataRef.value.resetFields();
        emit("postCommentFinish",result.data);

    });

    };


</script>

<style lang="scss" scoped>
.post-comment-panel{
    display: flex;
        .comment-form {
            flex: 1;
            margin: 0px 10px;

            .insert-img {
                line-height: normal;

                .iconfont {
                    margin-top: 3px;
                    font-size: 20px;
                    color: #3f3f3f;
                }
            }
        }
        .sent-btn{
            width: 60px;
            height: 60px;
            background: var(--link);
            color:#fff;
            text-align: center;
            line-height: 60px;
            border-radius: 5px;
        }
    }

</style>
