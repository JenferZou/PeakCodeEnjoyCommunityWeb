import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate'
export default createStore({
    state:{
        loginUserInfo:null,
        showLogin:false,
        //板块信息
        boardList:[],
        //当前一级板块
        activePBoardId:0,
        //当前二级板块
        activeBoardId:0,
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
                return item.board_id ==boardId;
            });

            return board?board.children:[];

        },
        getActivePBoardId:(state)=>{
            return state.activePBoardId;
        },
        getActiveBoardId:(state)=>{
            return state.activeBoardId;
        },
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
        },
        setActivePBoardId:(state,value)=>{
            state.activePBoardId = value;
        },
        setActiveBoardId:(state,value)=>{
            state.activeBoardId = value;
        }
    },
    actions:{},
    modules:{},
    plugins:[createPersistedState({
        storage:window.sessionStorage,
        reducer:(state)=>{
            return {
                loginUserInfo:state.loginUserInfo,
            }
        }
    })]

})