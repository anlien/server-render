import React from 'react';
import Skeleton from '../Skeleton/index';
//加载组件的场景动画
export default function Loading() {
  return (
    <React.Fragment>
      <Skeleton active />
      <Skeleton active rtl />
      <Skeleton active />
      <Skeleton active rtl />
      <Skeleton active />
      <Skeleton active rtl />
      <Skeleton active />
      <Skeleton active rtl />
      <Skeleton active />
    </React.Fragment>
  );
}
