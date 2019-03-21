import Vue from 'vue'
import Store from '../store/index'
import Router from 'vue-router'

const index = resolve => require(['@/components/font/index.vue'],resolve)
const AboutMe = resolve => require(['@/components/font/AboutMe'],resolve)
const Home = resolve => require(['@/components/font/Home.vue'], resolve)
const Articles = resolve => require(['@/components/font/Articles'], resolve)
const contact = resolve => require(['@/components/font/contact'], resolve)
const login = resolve => require(['@/components/back/login'], resolve)
const admin = resolve => require(['@/components/back/admin'], resolve)
const posts = resolve => require(['@/components/back/posts'], resolve)
const editor = resolve => require(['@/components/back/editor'], resolve)
const drafts = resolve => require(['@/components/back/drafts'], resolve)
const search = resolve => require(['@/components/back/search'], resolve)
const article = resolve => require(['@/components/font/article'], resolve)
const account = resolve => require(['@/components/back/account'], resolve)
const SearchResult = resolve => require(['@/components/font/SearchResult'],resolve)

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'home',
      component: index,
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
          meta: {title: '博客首页'}
        },
        {
          path: 'about',
          name: 'about',
          component: AboutMe,
          meta: {title: '关于我'}
        },
        {
          path: 'articles',
          name: 'articles',
          component: Articles,
          meta: {title: '学习笔记分享'}
        },
        {
          path: 'articles/:id',
          name: 'article',
          component: article
        },
        {
          path: 'contact',
          name: 'contact',
          component: contact,
          meta: {title: '联系站长'}
        },
        {
          path: 'search/:text',
          name: 'SearchResult',
          component: SearchResult,
          meta: {title: '搜索结果'}
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {title: '登录页面'}
    },
    {
      path: '/admin',
      redirect: '/admin/posts',
      component: admin,
      children: [
        {
          path: 'posts',
          name: 'posts',
          component: posts,
          meta: {requireAuth: true, title: '博客文章'}
        },
        {
          path: 'editor',
          name: 'editor',
          component: editor,
          meta: {requireAuth: true, title: '编辑文章'}
        },
        {
          path: 'drafts',
          name: 'drafts',
          component: drafts,
          meta: {requireAuth: true, title: '博客草稿'}
        },
        {
          path: 'search',
          name: 'search',
          component: search,
          meta: {requireAuth: true, title: '搜索结果'}
        },
        {
          path: 'account',
          name: 'account',
          component: account,
          meta: {requireAuth: true, title: '修改账户'}
        }
      ]
    }
  ]
})

/*当一个导航触发时，全局前置守卫按照创建顺序调用*/
router.beforeEach((to, from, next) => {
  if(Store.state.user.token && to.name === 'login'){
    next({name: 'posts'});
  }else if(!Store.state.user.token && to.meta.requireAuth) {
    next({name: 'login'});
  }else {
    next();
  }
})

export default router;
