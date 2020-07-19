import * as React from 'react';
// import omit from 'omit.js';
import classNames from 'classnames';
import Element from './Element';
// import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export interface SkeletonInputProps {
  size?: 'large' | 'small' | 'default';
  className?: string;
  active?: string;
}

const SkeletonInput = (props: SkeletonInputProps) => {
  const { className, active } = props;
  const prefixCls = 'ant-skeleton';
  // const otherProps = omit(props, ['prefixCls']);
  const cls = classNames(prefixCls, className, `${prefixCls}-element`, {
    [`${prefixCls}-active`]: active,
  });
  return (
    <div className={cls}>
      <Element prefixCls={`${prefixCls}-input`} />
    </div>
  );
};

SkeletonInput.defaultProps = {
  size: 'default',
};

export default SkeletonInput;
