import React from 'react';
import ReactDOMServer from 'react-dom/server';
//
class App extends React.Component {
    render(){
        return <div className='wrap'>使用node跑 koa 和 组件编译 支持import</div>
    }
}
const appStr = ReactDOMServer.renderToString(<App></App>);

export default appStr;