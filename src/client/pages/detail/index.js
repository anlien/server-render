import React from 'react';
import tupImg from '../assets/tup.png';
// import './index.scss';
class Detail extends React.Component {
    // static propTypes = {
    //     match: PropTypes.object.isRequired,
    //     location: PropTypes.object.isRequired,
    //     history: PropTypes.object.isRequired
    // }
    /**
     * 获得页面数据
     */
    // static async fetchComponentData() {
    //     return {
    //         name: 'detail',
    //         api: '/detail'
    //     }
    // }
    onClickHandle = () => {
        const { history } = this.context;
        history.push("/");
        console.log('点击事件点击事件');
    }
    render() {
        console.log('this.porps', this.props);
        return <div className='wrap'>
            <img src={tupImg} />这是 EE详情页 C<span onClick={this.onClickHandle}>可以点击的</span>
        </div>
    }
}
//获得接口数据
// Detail.fetchComponentData = async (req) => {

// }
//上下文

export default Detail;