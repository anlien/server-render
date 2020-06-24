import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import money from '../assets/money.png';
class Home extends React.Component {
    componentDidMount() {
        // const { history } = this.context;
        // setTimeout(() => {
        //     history.push("/detail?ceshi=12&p=5");
        // }, 3000)
    }
    render() {
        return <div className='wrap'><img src={money} />首页 测试</div>
    }
}

// 获得接口数据
// Home.fetchComponentData = async (req) => {

// }
export default Home;