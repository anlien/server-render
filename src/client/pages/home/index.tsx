import React from 'react';
import Skeleton from '../../components_common/Skeleton/index';
import Timeline from '../../components_common/Timeline/index';
import Switch from '../../components_common/Switch/index';
import TabBar from '../../TabBar';

type Props = { age: number } & typeof defaultProps;
const defaultProps = {};

const Greet = (props: Props) => {
  return (
    <div>
      <TabBar></TabBar>
      <Switch></Switch>
      <Skeleton></Skeleton>
      <Skeleton></Skeleton>
      <Skeleton></Skeleton>
      <Timeline mode="alternate">
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item color="green">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo.
        </Timeline.Item>
        <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color="green">Technical testing 2015-09-01</Timeline.Item>
      </Timeline>
      ,
    </div>
  );
};
Greet.defaultProps = defaultProps;

export default Greet;
