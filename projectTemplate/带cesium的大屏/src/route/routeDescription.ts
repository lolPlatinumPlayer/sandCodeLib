
// 功能性页面
const funcPage = [
  {
    name: "aaaaa",
    path: "/aaaaa",
    component: () => import("@/page/business/aaaaa/aaaaa.vue"),
    meta: {
      showAvatar: true,
      useBanner: true,
      bannerText: "aaaaa",
      bannerBgColor: "white",
      useBottomNav: true,
    },
  },
  {
    name: "bbbb",
    path: "/bbbb",
    component: () => import("@/page/business/bbbb/bbbb.vue"),
    meta: {
      showAvatar: true,
      useBanner: true,
      bannerText: "bbbb",
      bannerBgColor: "white",
      useBottomNav: true,
    },
  },
];

// 系统类页面
const systemPage = [
  {
    name: "yourInfo",
    path: "/yourInfo",
    component: () => import("@/page/system/yourInfo.vue"),
    meta: {
      useBanner: true,
      bannerText: "个人中心",
      bannerBgColor: "white",
    },
  },
  {
    name: "setPsw",
    path: "/setPsw",
    component: () => import("@/page/system/setPsw.vue"),
    meta: {
      useBanner: true,
      bannerText: "修改密码",
      bannerBgColor: "white",
    },
  },
  {
    name: "setUsername",
    path: "/setUsername",
    component: () => import("@/page/system/setUsername.vue"),
    meta: {
      useBanner: true,
      bannerText: "修改用户名",
      bannerBgColor: "white",
    },
  },
];

const routeDescription=[
  ...funcPage,
  ...systemPage,
  { 
    path: '/',
    redirect:{
      name:'aaaaa'
    }
  },
]
export default routeDescription