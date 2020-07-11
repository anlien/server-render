import React from 'react';
import Loading from './components_common/Loading/index';
import { withRouter } from 'react-router';
import ErrorBoundary from './components_common/ErrorBoundary/index';

class RouteComponent extends React.Component {
  constructor(props) {
    super(props);
    const { MachComponent = null } = props;
    let isloading = !MachComponent; //
    this.MachComponent = MachComponent || Loading;
    this.totalData = props.totalData;
    this.state = {
      isloading,
    };
  }

  componentDidMount() {
    const { getComponent } = this.props;
    if (this.state.isloading) {
      getComponent().then(data => {
        this.MachComponent = data.default;
        this.setState({
          isloading: false,
        });
      });
    }
  }
  //配置router
  render() {
    const { MachComponent, totalData } = this;
    const { pageData, commonData } = totalData;
    let WithRouterApp = withRouter(MachComponent);
    return (
      <ErrorBoundary>
        <WithRouterApp pageData={pageData} commonData={commonData} />
      </ErrorBoundary>
    );
  }
}
//
// RouteComponent.propTypes = {
//     MachComponent: PropTypes.func,
//     getComponent: PropTypes.func,
//     totalData: PropTypes.shape({
//         pageData: PropTypes.object, //页面数据
//         commonData: PropTypes.object, //共享数据
//     }),
// };
export default RouteComponent;
