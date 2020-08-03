import { Models, PropsType } from 'rmc-tabs';

export interface TabsProps extends PropsType {
  /** render for replace the tab of tabbar. */
  renderTab?: (tab: Models.TabData) => React.ReactNode;
}
