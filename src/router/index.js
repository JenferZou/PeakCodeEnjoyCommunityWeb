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

    ]

  },
    {
      path:'/post/:articleId/',
      name:'文章详情',
      component:()=>import('@/views/forum/ArticleDetail.vue'),
    },]
});

export default router
