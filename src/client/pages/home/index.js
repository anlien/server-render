import React from 'react';
import './index.scss';
import money from './assets/money.png';
class Home extends React.Component {
    render(){
        return <div className='wrap'><img src={ money }/>首页 测试</div>
    }
}
export default Home;