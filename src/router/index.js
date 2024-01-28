import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[{
    path:'/',
    name:'layout',
    component:()=>import('@/views/Layout.vue'),
    children:[{
      path:'/',
      name:'所有文章',
      component:()=>import('@/views/forum/ArticleList.vue'),
    },
      {
        path:'/forum/:pBoardId',
        name:'一级板块',
        component:()=>import('@/views/forum/ArticleList.vue'),
      },
      {
        path:'/forum/:pBoardId/:boardId',
        name:'二级板块',
        component:()=>import('@/views/forum/ArticleList.vue'),
      },
      {
        path:'/post/:articleId/',
        name:'文章详情',
        component:()=>import('@/views/forum/ArticleDetail.vue'),
      },
      {
        path:'/postArticle',
        name:'发布文章',
        component:()=>import('@/views/forum/EditArticle.vue'),
      },
      {
        path:'/editArticle/:articleId',
        name:'修改文章',
        component:()=>import('@/views/forum/EditArticle.vue'),
      },
      {
        path:'/user/:userId',
        name:'用户中心',
        component:()=>import('@/views/UserCenter/UserCenter.vue'),
      },
      {
        path:'/user/message/:type',
        name:'消息中心',
        component:()=>import('@/views/UserCenter/MessageList.vue'),
      },
    ]

  },
  ]
});

export default router
