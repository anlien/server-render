//若使用 Loadable Components 可能会将代码更加复杂化
const routes = [
    {
        path: "/",
        component: import(/* webpackChunkName: 'home' */'./pages/home')// 此处可以优化
    },
    {
        path: "/detail",
        component: import(/* webpackChunkName: 'detail' */'./pages/detail')
    }
];

export default routes;