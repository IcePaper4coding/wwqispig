import Vue from 'vue'
import Router from 'vue-router'
// import wangye from '../view/wangye.vue'
// import VueResource from 'vue-resource'
// Vue.use(VueResource);
Vue.use(Router)

export default new Router({
    
  routes: [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/test',
        meta: { requireAuth: false,title: '登录页' },
        component: resolve => require.ensure([], () => resolve(require('../view/test/test.vue')), 'test')
    },
    {
        path: '/login',
        meta: { requireAuth: false,title: '登录页' },
        component: resolve => require.ensure([], () => resolve(require('../view/home/login.vue')), 'login')
    },
    {
        path: '/award',
        meta: { requireAuth: false,title: '抽奖页' },
        component: resolve => require.ensure([], () => resolve(require('../view/drawaward/draw.vue')), 'draw')
    },
  {
        path: '/main',
        meta: { requireAuth: false,title: 'main' },
        component: resolve => require.ensure([], () => resolve(require('../view/home/main.vue')), 'main'),
        meta: { requireAuth: false, title: "首页", keepAlive: true },
        children: [
            {
                path: "/lunpan",
                name: "wangye",
                component: resolve => require.ensure([], () => resolve(require('../view/home/wangye.vue')), 'wangye'),
                meta: { requireAuth: false, title: "我的轮盘", keepAlive: true }
            },
            {
                path: "/home",
                name: "home",
                component: resolve => require.ensure([], () => resolve(require('../view/home/home.vue')), 'home'),
                meta: { requireAuth: false, title: "首页主页", keepAlive: true }
            },
            {
                path: "/publish",
                name: "publish",
                component: resolve => require.ensure([], () => resolve(require('../view/home/add.vue')), 'publish'),
                meta: { requireAuth: false, title: "发布动态", keepAlive: true }
            },
            {
                path: "/pyq",
                name: "pyq",
                component: resolve => require.ensure([], () => resolve(require('../view/home/pyq.vue')), 'pyq'),
                meta: { requireAuth: false, title: "动态圈", keepAlive: true }
            },
            {
                path: "/my",
                name: "my",
                component: resolve => require.ensure([], () => resolve(require('../view/home/my.vue')), 'my'),
                meta: { requireAuth: false, title: "我的", keepAlive: true }
            },
            {
                path: "/del",
                name: "del",
                component: resolve => require.ensure([], () => resolve(require('../view/home/delpage.vue')), 'del'),
                meta: { requireAuth: false, title: "隐藏页", keepAlive: true }
            },
        ]
    },
    {
        path: "/myinfo",
        name: "myinfo",
        component: resolve => require.ensure([], () => resolve(require('../view/home/myinfo.vue')), 'myinfo'),
        meta: { requireAuth: false, title: "我的信息", keepAlive: true }
    },
    {
        path: "/messagetalk",
        name: "talk",
        component: resolve => require.ensure([], () => resolve(require('../view/functionvue/talk.vue')), 'myinfo'),
        meta: { requireAuth: false, title: "对话框", keepAlive: true }
    },
    {
        path: "/mymusic",
        name: "mymusic",
        component: resolve => require.ensure([], () => resolve(require('../view/music/musichome.vue')), 'myinfo'),
        meta: { requireAuth: false, title: "我的音乐", keepAlive: true }
    }, 
    {
        path: "/mygame",
        name: "mygame",
        component: resolve => require.ensure([], () => resolve(require('../view/mygame/mygame.vue')), 'mygame'),
        meta: { requireAuth: false, title: "我的游戏", keepAlive: true },
    }, 
    {
        path: "/pengpengball",
        name: "pengpengball",
        component: resolve => require.ensure([], () => resolve(require('../view/mygame/pengpengball.vue')), 'pengpengball'),
        meta: { requireAuth: false, title: "碰碰球", keepAlive: true }
    },
  ],

})