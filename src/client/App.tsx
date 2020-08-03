import React from 'react';
import Nav from './components/PageNav/index';
import './styles/index.scss';
import { hot } from 'react-hot-loader/root';
interface AppProps {
  status?: string;
}

class App extends React.Component<AppProps, any> {
  render() {
    return (
      <div className="app-container">
        {this.props.children}
        <div className="app-nav-wrap">
          <Nav />
        </div>
      </div>
    );
  }
}
export default hot(App);
