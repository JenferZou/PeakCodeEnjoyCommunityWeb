import {createStore} from "vuex";

export default createStore({
    state:{
        loginUserInfo:null,
        showLogin:false,
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo;
        }
    },
    mutations:{
        updateLoginUserInfo(state,value){
            state.loginUserInfo = value;
        },
        showLogin(state,value){
            state.showLogin = value;
        }
    },
    actions:{},
    modules:{}

})