/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import * as React from 'react';
import TouchFeedback from '../Feedback/index';

import Flex from '../Flex/index';
import { DataItem, GridPropsType } from './PropsType';
import './style/index.scss';

export interface GridProps extends GridPropsType {
  prefixCls?: string;
  className?: string;
  square?: boolean;
  activeClassName?: string;
  activeStyle?: boolean | React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

export default class Grid extends React.Component<GridProps, any> {
  static defaultProps = {
    data: [],
    hasLine: true,
    columnNum: 4,
    carouselMaxRow: 2,
    prefixCls: 'am-grid',
    square: true,
    itemStyle: {},
  };
  state = {
    initialSlideWidth: 0, // only used in carousel model
  };
  componentDidMount() {
    this.setState({
      initialSlideWidth: document.documentElement.clientWidth,
    });
  }
  renderItem = (dataItem: DataItem | any, index: number, columnNum: number, renderItem: any) => {
    const { prefixCls } = this.props;
    let itemEl: any = null;
    if (renderItem) {
      itemEl = renderItem(dataItem, index);
    } else {
      if (dataItem) {
        const { icon, text } = dataItem;
        itemEl = (
          <div className={`${prefixCls}-item-inner-content column-num-${columnNum}`}>
            {React.isValidElement(icon) ? icon : <img className={`${prefixCls}-icon`} src={icon} />}
            <div className={`${prefixCls}-text`}>{text}</div>
          </div>
        );
      }
    }
    return <div className={`${prefixCls}-item-content`}>{itemEl}</div>;
  };
  getRows = (rowCount: number, dataLength: number) => {
    // tslint:disable:prefer-const
    let {
      columnNum,
      data,
      renderItem,
      prefixCls,
      onClick,
      activeStyle,
      activeClassName,
      itemStyle,
    } = this.props;
    const rowsArr: any[] = [];

    columnNum = columnNum!;

    const rowWidth = `${100 / columnNum}%`;
    const colStyle = {
      width: rowWidth,
      ...itemStyle,
    };

    for (let i = 0; i < rowCount; i++) {
      const rowArr: any[] = [];
      for (let j = 0; j < columnNum; j++) {
        const dataIndex = i * columnNum + j;
        let itemEl;
        if (dataIndex < dataLength) {
          const el = data && data[dataIndex];
          itemEl = (
            <TouchFeedback
              key={`griditem-${dataIndex}`}
              activeClassName={activeClassName ? activeClassName : `${prefixCls}-item-active`}
              activeStyle={activeStyle}
            >
              <Flex.Item
                className={`${prefixCls}-item`}
                onClick={() => onClick && onClick(el, dataIndex)}
                style={colStyle}
              >
                {this.renderItem(el, dataIndex, columnNum, renderItem)}
              </Flex.Item>
            </TouchFeedback>
          );
        } else {
          itemEl = (
            <Flex.Item
              key={`griditem-${dataIndex}`}
              className={`${prefixCls}-item ${prefixCls}-null-item`}
              style={colStyle}
            />
          );
        }
        rowArr.push(itemEl);
      }
      rowsArr.push(
        <Flex justify="center" align="stretch" key={`gridline-${i}`}>
          {rowArr}
        </Flex>,
      );
    }
    return rowsArr;
  };
  render() {
    const { prefixCls, className, data, hasLine, isCarousel, square, ...restProps } = this.props;

    let { columnNum = 1 } = restProps;
    const dataLength = (data && data.length) || 0;

    let rowCount = Math.ceil(dataLength / columnNum);

    let rowsArr;
    let renderEl;

    rowsArr = this.getRows(rowCount, dataLength);
    renderEl = rowsArr;

    const cls = classnames(prefixCls, className, {
      [`${prefixCls}-square`]: square,
      [`${prefixCls}-line`]: hasLine,
      [`${prefixCls}-carousel`]: isCarousel,
    });
    return <div className={cls}>{renderEl}</div>;
  }
}
