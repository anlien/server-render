import * as React from 'react';
// import omit from 'omit.js';
import classNames from 'classnames';
// import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import Element from './Element';

export interface AvatarProps {
  shape?: 'circle' | 'square';
  className?: string;
  active?: string;
}

const SkeletonAvatar = (props: AvatarProps) => {
  // const renderSkeletonAvatar = () => {
  const { className, active } = props;
  const prefixCls = 'ant-skeleton';
  // const otherProps = omit(props, ['prefixCls']);
  const cls = classNames(prefixCls, className, `${prefixCls}-element`, {
    [`${prefixCls}-active`]: active,
  });
  return (
    <div className={cls}>
      <Element prefixCls={`${prefixCls}-avatar`} />
    </div>
  );
  // };
  // return <ConfigConsumer>{renderSkeletonAvatar}</ConfigConsumer>;
};

SkeletonAvatar.defaultProps = {
  size: 'default',
  shape: 'circle',
};

export default SkeletonAvatar;
