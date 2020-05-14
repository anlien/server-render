import React from 'react';
import tupImg from './assets/tup.png';

class Home extends React.Component {
    onClickHandle(){
        console.log('点击事件点击事件');
    }
    render(){
        return <div className='wrap'>
             <img src={ tupImg }/>这是详情页 C<span onClick={ this.onClickHandle }>可以点击的</span>
        </div>
    }
}

export default Home;