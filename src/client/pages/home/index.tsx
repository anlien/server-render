import React from 'react';
import Timeline from '../../components/Timeline/index';
import NoticeBar from '../../components/NoticeBar/index';
import Grid from '../../components/Grid/index';

type Props = { age: number } & typeof defaultProps;
const defaultProps = {};
const data = Array.from(new Array(7)).map((_val, i) => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `name${i}`,
}));

const Greet = (props: Props) => {
  return (
    <div>
      <NoticeBar marqueeProps={{ loop: false, style: { padding: '0 7.5px' } }} mode="closable">
        Notice: The arrival time of incomes and transfers of Yu &#39;E Bao will be delayed during
        National Day.
      </NoticeBar>
      <Grid data={data} columnNum={3} />
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
    </div>
  );
};
Greet.defaultProps = defaultProps;

export default Greet;
