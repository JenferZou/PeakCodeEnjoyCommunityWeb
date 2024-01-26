<template>
<div class="edit-post">
<el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        class="post-pannel"
        label-width="60px"
>

    <div class="post-editor">
        <el-card :body-style="{padding:'5px'}">
            <template #header>
                <div class="post-editor-title">
                    <span>正文</span>
                    <div class="change-editor-type">
                    <span class="iconfont icon-change" @click="changeEditor">
                        切换为{{editorType==0?"markdown编辑器":"富文本编辑器"}}
                    </span>
                    </div>
                </div>
            </template>
       <el-form-item prop="content" label-width="0">
           <EditorHtml
               v-if="editorType==0"
               :height="htmlEditorHeight"
               v-model="formData.content"
           ></EditorHtml >
           <EditorMarkdown
               v-if="editorType==1"
               :height="markdownHeight"
                v-model="formData.markdown_content"
                @htmlContent="setHtmlContent"
           ></EditorMarkdown>
       </el-form-item>
        </el-card>
    </div>

    <div class="post-setting">
        <el-card :body-style="{padding:'5px'}">
            <template #header>
                <span>设置</span>
            </template>
            <div class="setting-inner">
                <el-form-item   prop="title" label="标题" >
                    <el-input
                        maxlength="150"
                        clearable
                        placeholder="请输入文章标题"
                        v-model="formData.title">
                    </el-input>
                </el-form-item>
                <el-form-item prop="boardIds" label="板块">
                    <el-cascader
                        placeholder="请选择板块"
                        :options="boardList"
                        :props="boardProps"
                        clearable
                        v-model="formData.boardIds"
                        :style="{ width:'100%'}"
                    />
                </el-form-item>
                <el-form-item prop="cover" label="封面">
                 <CoverUpload v-model="formData.cover"></CoverUpload>
                </el-form-item>
                <el-form-item prop="summary" label="摘要">
                    <el-input
                        clearable
                        type="textarea"
                        :rows="5"
                        maxlength="200"
                        placeholder="请输入文章摘要"
                        resize="none"
                        show-word-limit
                        v-model="formData.summary"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item prop="attachment" label="附件">
                    <AttachmentSelector v-model="formData.forumArticleAttachmentVo"></AttachmentSelector>
                </el-form-item>
                <el-form-item prop="integral" label="积分"  v-if="formData.forumArticleAttachmentVo">
                    <el-input clearable
                              placeholder="请输入积分"
                              v-model="formData.integral">
                    </el-input>
                    <span class="tip">Tip:此处为附件下载积分</span>
                </el-form-item>
                <el-form-item prop="" label="">
                    <el-button type="primary"
                               :style="{width:'100%'}"
                               @click="submitArticle">保存</el-button>
                </el-form-item>
            </div>

        </el-card>

    </div>




</el-form>
</div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, watch, nextTick} from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
import EditorMarkdown from "@/components/EditorMarkdown.vue";
import EditorHtml from "@/components/EditorHtml.vue";
import CoverUpload from "@/components/CoverUpload.vue";
import AttachmentSelector from "@/components/AttachmentSelector.vue";
import {ElMessageBox} from "element-plus";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();


const markdownHeight = window.innerHeight - 140;
const htmlEditorHeight = window.innerHeight - 220;

const formData = ref({});
const formDataRef = ref();
const rules ={
    title: [{required: true, message: '请输入标题'},
        {max:150,message:"标题太长"}],
    boardIds:[{required: true, message: '请选择板块'}],
    content: [{required: true, message: '请输入正文'}],
    integral: [{required: true, message: '请输入下载所需积分'},
        {validator:proxy.Verify.number,message: "积分只能填数字"}],
};
const api ={
    loadBoard: "/forum/loadBoard4Post",
    postArticle: "/forum/postArticle",
    articleDetail4Update: "/forum/articleDetail4Update",
    updateArticle: "/forum/updateArticle",
};

const articleId = ref(null);
const getArticleDetail =  ()=>{
    nextTick(async ()=>{
        formDataRef.value.resetFields();
        if(articleId.value){
            let result = await proxy.Request({
                url : api.articleDetail4Update,
                params : {
                    articleId:articleId.value,
                },
                showError:false,
                errorCallback:(response)=>{
                    ElMessageBox.alert(response.info,"错误",{
                        showClose:false,
                        callback:(action)=>{
                            router.go(-1);
                        }
                    })
                }
            });
            if(!result){
                return;
            }
            let articleInfo = result.data.forumArticleVo;
            //设置编辑器
            editorType.value = articleInfo.editor_type;
            //设置板块信息
            articleInfo.boardIds = [];
            articleInfo.boardIds.push(articleInfo.p_board_id);
            if(articleInfo.board_id!=null && articleInfo.board_id!=0){
                articleInfo.boardIds.push(articleInfo.board_id)
            }
            //设置封面信息
            if(articleInfo.cover){
                articleInfo.cover = {imageUrl:articleInfo.cover};
            }
            //设置附件
            if(articleInfo.forumArticleAttachmentVo){
                articleInfo.attachment = {
                    name:result.data.forumArticleAttachmentVo.file_name,
                };
                articleInfo.integral =result.data.forumArticleAttachmentVo.integral;
            }
            formData.value = articleInfo;
        }else {
            formData.value={};
            editorType.value=proxy.VueCookies.get("editorType")||0
        }
    })

};

const setHtmlContent = (htmlContent)=>{
    formData.value.content = htmlContent;
}


watch(()=>route,(newVal,oldVal)=>{
    if(newVal.path.indexOf("/postArticle")!=-1||
     newVal.path.indexOf("/editArticle")!=-1){
        articleId.value = route.params.articleId;
        getArticleDetail();
    }
},{immediate:true,deep:true})


//提交文章信息
const submitArticle = ()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return;
        }
        let params = {};
        Object.assign(params,formData.value);
        if(params.boardIds.length==1){
            params.p_board_id = params.boardIds[0];
        }else if(params.boardIds.length==2){
            params.p_board_id = params.boardIds[0];
            params.board_id = params.boardIds[1];
        }
        delete params.boardIds;
        //设置编译器类型
        params.editor_type = editorType.value;
        //获取内容
        const contentText = params.content.replace(/<(?!img).*?>/g,"");
        if(contentText==""){
            proxy.message.warning("正文不能为空");
            return;
        }
        if(params.forumArticleAttachmentVo!=null){
            params.attachmentType =1;
        }
        else {
            params.attachmentType =0;
        }
        //封面
        if(!(params.cover instanceof File)){
            delete params.cover;
        }

        //附件不是文件类型设置为空
        if(!(params.forumArticleAttachmentVo instanceof File)){
            delete params.forumArticleAttachmentVo;
        }

        let result  = await proxy.Request({
            url: params.article_id ? api.updateArticle : api.postArticle,
            params:params,
        });
        if(!result){
            return;
        };
        proxy.Message.success("保存成功");
        //跳转到刚刚发布的文章
        router.push(`/post/${result.data}`)
    });
}


//板块信息
const boardProps = {
    multiple:false,
    checkStrictly:true,
    value:"board_id",
    label:"board_name",
}
const boardList = ref([]);
const loadBoardList = async ()=>{
    let result = await proxy.Request({
        url : api.loadBoard,
    })
    if(!result){
        return;
    }
    boardList.value = result.data;
};
loadBoardList();

//编辑器类型 0富文本 1 markdown
const editorType = ref(null);

const changeEditor =()=>{
    proxy.Confirm("切换编辑器将会清空当前正在编辑的内容,确定要切换么？",()=>{
        editorType.value = editorType.value==0?1:0;
        formData.value.content="";
        formData.value.markdown_content="";
        proxy.VueCookies.set("editorType",editorType.value,-1);
    })
};


</script>

<style  lang="scss">

.edit-post{
    margin-top: auto;
    .post-pannel{
        display: flex;
        .post-editor{
            flex: 1;
            .post-editor-title{
                display: flex;
                justify-content: space-between;
                .change-editor-type{
                    .iconfont{
                        cursor: pointer;
                        color: var(--link);
                        font-size: 13px;
                    }

                }
            }
        }
        .post-setting{
            margin-left: 5px;
            width: 450px;
            .setting-inner{
                max-height: calc(100vh - 120px);
                overflow: auto;
                .el-form-item{
                    align-items: flex-start;
                }
            }
            .tip{
                color: #797979;
                font-size: 12px;

            }
        }
    }
}


</style>
