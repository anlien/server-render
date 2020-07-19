import * as React from 'react';
import classnames from 'classnames';

import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';

import './style/index.scss';

export const ExceptionMap = {
  '404': noFound,
  '500': serverError,
  '403': unauthorized,
};

export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500';

export interface ResultProps {
  icon?: React.ReactNode;
  status?: ExceptionStatusType;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap);

/**
 * render icon
 * if ExceptionStatus includes ,render svg image
 * else render iconNode
 * @param prefixCls
 * @param {status, icon}
 */
const renderIcon = (prefixCls: string, { status, icon }: ResultProps) => {
  const className = classnames(`${prefixCls}-icon`);

  if (ExceptionStatus.includes(`${status}`)) {
    const SVGComponent = ExceptionMap[status as ExceptionStatusType];
    return (
      <div className={`${className} ${prefixCls}-image`}>
        <SVGComponent />
      </div>
    );
  }

  return null;
};

const renderExtra = (prefixCls: string, { extra }: ResultProps) =>
  extra && <div className={`${prefixCls}-extra`}>{extra}</div>;

export interface ResultType extends React.FC<ResultProps> {
  PRESENTED_IMAGE_404: React.ReactNode;
  PRESENTED_IMAGE_403: React.ReactNode;
  PRESENTED_IMAGE_500: React.ReactNode;
}

const Result: ResultType = props => {
  const { className: customizeClassName, subTitle, title, style, children, status } = props;
  const prefixCls = 'ant-result';
  const className = classnames(prefixCls, `${prefixCls}-${status}`, customizeClassName, {
    [`${prefixCls}-rtl`]: true,
  });
  return (
    <div className={className} style={style}>
      {renderIcon(prefixCls, props)}
      <div className={`${prefixCls}-title`}>{title}</div>
      {subTitle && <div className={`${prefixCls}-subtitle`}>{subTitle}</div>}
      {children && <div className={`${prefixCls}-content`}>{children}</div>}
      {renderExtra(prefixCls, props)}
    </div>
  );
};

Result.defaultProps = {
  status: 'info',
};
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];

export default Result;
