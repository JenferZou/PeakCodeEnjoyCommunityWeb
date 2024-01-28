import VueCookies from 'vue-cookies'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
//我们使用sass 所以这里将base.css 改成base.scss
import '@/assets/base.scss'
import store from "@/store";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//全局组件
import Dialog from "@/components/Dialog.vue"

//全局方法
import Verify from "@/utils/verify";
import Message from "@/utils/Message"
import Request from "@/utils/Request"
import Confirm from "@/utils/Comfirm";
import FileSizeFormat from "@/utils/FileSizeFormat";
import PageDataList from "@/components/PageDataList.vue"
import Nodata from "@/components/Nodata.vue"
import ImageViewer from "@/components/ImageViewer.vue"
import Avatar from "@/components/Avatar.vue";
import EditorHtml from "@/components/EditorHtml.vue";
import EditorMarkdown from "@/components/EditorMarkdown.vue";
import CoverUpload from "@/components/CoverUpload.vue";
import AttachmentSelector from "@/components/AttachmentSelector.vue";
// import HighLightCode from "@/utils/HighLightCode";
const app = createApp(App)

app.use(ElementPlus);
app.component("Dialog",Dialog);
app.component("PageDataList",PageDataList);
app.component("Nodata",Nodata);
app.component("ImageViewer",ImageViewer);
app.component("Avatar",Avatar);
app.component("EditorHtml",EditorHtml);
app.component("EditorMarkdown",EditorMarkdown);
app.component("CoverUpload",CoverUpload);
app.component("AttachmentSelector",AttachmentSelector);

app.use(store)
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo={
    headbodywidth:1250,
    articleListWidth:1000,
    contentwidth:800,
    articleWidth:900,
    userCenterWidth:1100,
    avatarUrl:"/api/file/getAvatar/",
    imageUrl:"/api/file/getImage/"
};
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;
app.config.globalProperties.FileSizeFormat = FileSizeFormat;
app.config.globalProperties.Confirm = Confirm;
// app.config.globalProperties.HighLightCode = HighLightCode;




app.use(router)
app.mount('#app')
