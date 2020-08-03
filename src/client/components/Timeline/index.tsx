import * as React from 'react';
import classNames from 'classnames';
import './style/index.scss';
import TimelineItem from './TimelineItem';

export interface TimelineProps {
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending?: React.ReactNode;
  pendingDot?: React.ReactNode;
  style?: React.CSSProperties;
  reverse?: boolean;
  mode?: 'left' | 'alternate' | 'right';
}

const Timeline = (props: TimelineProps) => {
  const { pending = null, pendingDot, children, className, reverse, mode, ...restProps } = props;

  const prefixCls = 'ant-timeline';
  const pendingNode = typeof pending === 'boolean' ? null : pending;

  const pendingItem = pending ? (
    <TimelineItem pending={!!pending} dot={pendingDot}>
      {pendingNode}
    </TimelineItem>
  ) : null;

  const timeLineItems = reverse
    ? [pendingItem, ...React.Children.toArray(children).reverse()]
    : [...React.Children.toArray(children), pendingItem];

  const getPositionCls = (ele: React.ReactElement<any>, idx: number) => {
    if (mode === 'alternate') {
      if (ele.props.position === 'right') return `${prefixCls}-item-right`;
      if (ele.props.position === 'left') return `${prefixCls}-item-left`;
      return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
    }
    if (mode === 'left') return `${prefixCls}-item-left`;
    if (mode === 'right') return `${prefixCls}-item-right`;
    if (ele.props.position === 'right') return `${prefixCls}-item-right`;
    return '';
  };
  // Remove falsy items
  const truthyItems = timeLineItems.filter(item => !!item);
  const itemsCount = React.Children.count(truthyItems);
  const lastCls = `${prefixCls}-item-last`;
  const items = React.Children.map(truthyItems, (ele: React.ReactElement<any>, idx) => {
    const pendingClass = idx === itemsCount - 2 ? lastCls : '';
    const readyClass = idx === itemsCount - 1 ? lastCls : '';
    return React.cloneElement(ele, {
      className: classNames([
        ele.props.className,
        !reverse && !!pending ? pendingClass : readyClass,
        getPositionCls(ele, idx),
      ]),
    });
  });
  const hasLabelItem = timeLineItems.some((item: React.ReactElement<any>) => !!item?.props?.label);

  const classString = classNames(
    prefixCls,
    {
      [`${prefixCls}-pending`]: !!pending,
      [`${prefixCls}-reverse`]: !!reverse,
      [`${prefixCls}-${mode}`]: !!mode && !hasLabelItem,
      [`${prefixCls}-label`]: hasLabelItem,
      [`${prefixCls}-rtl`]: true,
    },
    className,
  );
  return (
    <ul {...restProps} className={classString}>
      {items}
    </ul>
  );
};

Timeline.Item = TimelineItem;

Timeline.defaultProps = {
  reverse: false,
  mode: '' as TimelineProps['mode'],
};

export default Timeline;
