export const componentMap = {
    "./components/profile/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/general/components/profile/index.vue"),
    "./components/apparence/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/general/components/apparence/index.vue"),
    "./components/notifications/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/general/components/notifications/index.vue"), 
    "./components/security/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/general/components/security/index.vue"),
    "./components/general/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/event/components/general/index.vue"),
    "./components/category/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/event/components/category/index.vue"),
    "./components/department/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/event/components/department/index.vue"),
    "./components/reports/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/event/components/reports/index.vue"),
    // "./components/history/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/event/components/history/index.vue"),
    // "./components/settings/index.vue": () => import(/* webpackChunkName: "setting" */ "@/views/setting/event/components/settings/index.vue"),    
};