import {createStore} from "vuex";

export default createStore({
    state:{
        loginUserInfo:null,
        showLogin:false,
        //板块信息
        boardList:[],
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo;
        },
        getBoardList:(state)=>{
            return state.boardList;
        },
        getSubBoardList:(state)=>(boardId)=>{
            let board = state.boardList.find(item=>{
                return item.boardId == boardId;
            })
            return board?board.children:[];
        }
    },
    mutations:{
        updateLoginUserInfo(state,value){
            state.loginUserInfo = value;
        },
        showLogin(state,value){
            state.showLogin = value;
        },
        saveBoardList(state,value){
            state.boardList=value;
        }
    },
    actions:{},
    modules:{}

})