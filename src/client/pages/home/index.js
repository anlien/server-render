import React from 'react';
import './index.scss';
import money from './assets/money.png';
class Home extends React.Component {
    render(){
        return <div className='wrap'><img src={ money }/>WW W W 这 Q个是 首页 ABC</div>
    }
}
// const appStr = ReactDOMServer.renderToString(<App></App>);

export default Home;