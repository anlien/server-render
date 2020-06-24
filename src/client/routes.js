//若使用 Loadable Components 可能会将代码更加复杂化
const routes = [
    {
        path: "/",
        name: "home",//页面的名字 ==> './pages/detail'
        getComponent: () => import(/* webpackChunkName: 'home' */'./pages/home')// 此处可以优化
    },
    {
        path: "/detail",
        name: "detail",
        getComponent: () => import(/* webpackChunkName: 'detail' */'./pages/detail')
    }
];

export default routes.map(item => {
    item.exact = true;
    item.strict = true;//严格匹配 /detail/ 与 /detail是两个路由
    return item
});

// const routes = [
//     {
//         path: "/shoelaces",
//         sidebar: () => <div>shoelaces!</div>,
//         main: () => <h2>Shoelaces</h2>
//     }
// ];
// https://reacttraining.com/react-router/web/example/sidebar
