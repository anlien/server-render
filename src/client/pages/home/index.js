import React from 'react';
import './index.scss';
// import moneyPng from './money.png';
class Detail extends React.Component {
    render(){
        return <div className='wrap'><img src={ require('./assets/money.png') }/>这个是首页 A</div>
    }
}
// const appStr = ReactDOMServer.renderToString(<App></App>);

export default Detail;