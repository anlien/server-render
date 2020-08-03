import * as React from 'react';
import * as classNames from 'classnames';
import { ITouchProps, ITouchState } from './PropTypes';

export default class TouchFeedback extends React.Component<ITouchProps, ITouchState> {
  static defaultProps = {
    disabled: false,
  };

  state = {
    active: false,
  };

  componentDidUpdate() {
    if (this.props.disabled && this.state.active) {
      this.setState({
        active: false,
      });
    }
  }

  triggerEvent(type: string, isActive: boolean, ev: any) {
    const eventType = `on${type}`;
    const { children } = this.props;

    if (children.props[eventType]) {
      children.props[eventType](ev);
    }
    if (isActive !== this.state.active) {
      this.setState({
        active: isActive,
      });
    }
  }

  onTouchStart = (e: any) => {
    this.triggerEvent('TouchStart', true, e);
  };

  onTouchMove = (e: any) => {
    this.triggerEvent('TouchMove', false, e);
  };

  onTouchEnd = (e: any) => {
    this.triggerEvent('TouchEnd', false, e);
  };

  onTouchCancel = (e: any) => {
    this.triggerEvent('TouchCancel', false, e);
  };

  onMouseDown = (e: any) => {
    // pc simulate mobile
    this.triggerEvent('MouseDown', true, e);
  };

  onMouseUp = (e: any) => {
    this.triggerEvent('MouseUp', false, e);
  };

  onMouseLeave = (e: any) => {
    this.triggerEvent('MouseLeave', false, e);
  };

  render() {
    const { children, disabled, activeClassName, activeStyle } = this.props;

    const events = disabled
      ? undefined
      : {
          onTouchStart: this.onTouchStart,
          onTouchMove: this.onTouchMove,
          onTouchEnd: this.onTouchEnd,
          onTouchCancel: this.onTouchCancel,
          onMouseDown: this.onMouseDown,
          onMouseUp: this.onMouseUp,
          onMouseLeave: this.onMouseLeave,
        };

    const child = React.Children.only(children);

    if (!disabled && this.state.active) {
      let { style, className } = child.props;

      if (activeStyle !== false) {
        if (activeStyle) {
          style = { ...style, ...activeStyle };
        }
        className = classNames(className, activeClassName);
      }

      return React.cloneElement(child, {
        className,
        style,
        ...events,
      });
    }

    return React.cloneElement(child, events);
  }
}
