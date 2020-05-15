import React from 'react';
import tupImg from './assets/tup.png';
import PropTypes from 'prop-types';
class Detail extends React.Component {
    onClickHandle = () => {
        const { history } = this.context;
        history.push("/");
        console.log('点击事件点击事件');
    }
    render() {
        return <div className='wrap'>
            <img src={tupImg} />这是出 UP 了错了？详 情页 C<span onClick={this.onClickHandle}>可以点击的</span>
        </div>
    }
}

Detail.contextTypes = {
    history: PropTypes.object
};

export default Detail;