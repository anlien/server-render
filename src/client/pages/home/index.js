import React from 'react';
import './index.scss';
//
class Detail extends React.Component {
    render(){
        return <div className='wrap'><img src={ require('./money.png') }/>这个是首页 A</div>
    }
}
// const appStr = ReactDOMServer.renderToString(<App></App>);

export default Detail;