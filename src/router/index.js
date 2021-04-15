import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/user/Users')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles')
const Category = () => import('../components/goods/Category')
const Params = () => import('../components/goods/Params')
const Goods = () => import('../components/goods/Goods')
const Add = () => import('../components/goods/Add')
const Orders = () => import('../components/orders/Orders')
const Report = () => import('../components/report/Report')


Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }, {
        path: '/rights',
        component: Rights
      }, {
        path: '/roles',
        component: Roles
      }, {
        path: '/categories',
        component: Category
      }, {
        path: '/params',
        component: Params
      }, {
        path: '/goods',
        component: Goods
      }, {
        path: '/goods/add',
        component: Add
      }, {
        path: '/orders',
        component: Orders
      }, {
        path: '/reports',
        component: Report
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
// to：将要访问的路径
// from：代表从哪个路径跳转而来
// next：函数，表示放行    next() 放行；next('/login') 强制跳转
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next();
  } else {
    // 获取 token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
  }
})

export default router
