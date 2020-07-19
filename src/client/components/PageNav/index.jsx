import React from 'react';
import TabBar from '../TabBar';
import { withRouter } from 'react-router';
class Nav extends React.Component {
  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      pathname: location.pathname,
      hidden: false,
      fullScreen: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    const { location } = props;
    if (location.pathname !== state.pathname) {
      state.pathname = location.pathname;
      return state;
    }
    return state;
  }
  upState = path => {
    if (this.state.pathname === path) return;
    const { history } = this.props;
    this.setState(
      {
        pathname: path,
      },
      () => {
        history.push(path);
      },
    );
  };
  render() {
    const { location } = this.props;
    console.log('location.pathname', location.pathname);
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        hidden={this.state.hidden}
      >
        <TabBar.Item
          title="首页"
          key="Life"
          icon={
            <div
              style={{
                width: '22px',
                height: '22px',
                background:
                  'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat',
              }}
            />
          }
          selectedIcon={
            <div
              style={{
                width: '22px',
                height: '22px',
                background:
                  'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat',
              }}
            />
          }
          selected={this.state.pathname === '/'}
          onPress={() => {
            this.upState('/');
          }}
        ></TabBar.Item>
        <TabBar.Item
          icon={
            <div
              style={{
                width: '22px',
                height: '22px',
                background:
                  'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat',
              }}
            />
          }
          selectedIcon={
            <div
              style={{
                width: '22px',
                height: '22px',
                background:
                  'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat',
              }}
            />
          }
          title="详情"
          key="Koubei"
          // badge={'new'}
          selected={this.state.pathname === '/detail'}
          onPress={() => {
            this.upState('/detail');
          }}
          data-seed="logId1"
        ></TabBar.Item>
        <TabBar.Item
          icon={
            <div
              style={{
                width: '22px',
                height: '22px',
                background:
                  'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat',
              }}
            />
          }
          selectedIcon={
            <div
              style={{
                width: '22px',
                height: '22px',
                background:
                  'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat',
              }}
            />
          }
          title="联系人"
          key="Friend"
          selected={this.state.pathname === '/friend'}
          onPress={() => {
            this.upState('/friend');
          }}
        ></TabBar.Item>
        <TabBar.Item
          icon={{ uri: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg' }}
          selectedIcon={{ uri: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg' }}
          title="设置"
          key="my"
          selected={this.state.pathname === '/settings'}
          onPress={() => {
            this.upState('/settings');
          }}
        ></TabBar.Item>
      </TabBar>
    );
  }
}

export default withRouter(Nav);

{
  /* <Link
  to={{
    pathname: "/courses",
    search: "?sort=name",
    hash: "#the-hash",
    state: { fromDashboard: true }
  }}
/> */
}
