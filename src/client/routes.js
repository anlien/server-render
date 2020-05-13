//若使用 Loadable Components 可能会将代码更加复杂化
const routes = [
    {
        path: "/detail",
        name: "detail",//webpackChunkName中的名称
        component: import(/* webpackChunkName: 'detail' */'./pages/detail')
    },
    {
        path: "/",
        name: "home",//webpackChunkName中的名称
        component: import(/* webpackChunkName: 'home' */'./pages/home')// 此处可以优化
    }
];

export default routes;