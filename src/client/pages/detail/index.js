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
    constructor(props){
        super(props);
        this.state = {
            pageData: props.pageData
        }
    }
    static fetchComponentData() {
        //使用 Promise 來处理ajax请求
        return new Promise((resolve, reject) => {
            resolve({
                name: 'detail',
                api: '/detail'
            })
        });
    }
    componentDidMount(){
        const data = Detail.fetchComponentData();
    }
    onClickHandle = () => {
        const { history } = this.context;
        history.push("/");
        console.log('点击事件点击事件');
    }
    render() {
        const pageData = this.state.pageData;
        return <div className='wrap'>
            <img src={tupImg} />{ pageData.name } C<span onClick={this.onClickHandle}>可以点击的 { pageData.api }</span>
        </div>
    }
}


export default Detail;