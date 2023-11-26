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
import PageDataList from "@/components/PageDataList.vue"
import Nodata from "@/components/Nodata.vue"

const app = createApp(App)

app.use(ElementPlus);
app.component("Dialog",Dialog);
app.component("PageDataList",PageDataList);
app.component("Nodata",Nodata);


app.use(store)
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo={
    headbodywidth:1250,
    contentwidth:1100,
    avataUrl:"/api/file/getAvatar/",
    imageUrl:"/api/file/getImage/"
};
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;


app.use(router)
app.mount('#app')
