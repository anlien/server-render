---
category: Components
type: Navigation
title: Tabs
subtitle: 标签页
---

用于让用户在不同的视图中进行切换。

### 规则

- 标签数量，一般 2-4 个；其中，标签中的文案需要精简，一般 2-4 个字。
- 在 iOS 端的次级页面中，不建议使用左右滑动来切换 Tab，这个和 iOS 的左滑返回存在冲突，eg：详情页中 Tabs。

## API

### Tabs

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| --- | --- | --- | --- | --- |
| prefixCls | 样式前缀 | string | rmc-tabs | false |
| tabs | tab 数据 | Models.TabData[] |  | true |
| tabBarPosition | TabBar 位置 | 'top' \| 'bottom' \| 'left' \| 'right' | top | false |
| renderTabBar | 替换 TabBar | ((props: TabBarPropsType) => React.ReactNode) \| false |  | false |
| initialPage | 初始化 Tab, index or key | number \| string |  | false |
| page | 当前 Tab, index or key | number \| string |  | false |
| swipeable | 是否可以滑动内容切换 | boolean | true | false |
| useOnPan | 使用跟手滚动 | boolean | true | false |
| prerenderingSiblingsNumber | 预加载两侧 Tab 数量 | number | 1 | false |
| animated | 是否开启切换动画 | boolean | true | false |
| onChange | tab 变化时触发 | (tab: Models.TabData, index: number) => void |  | false |
| onTabClick | tab 被点击的回调 | (tab: Models.TabData, index: number) => void |  | false |
| destroyInactiveTab | 销毁超出范围 Tab | boolean | false | false |
| distanceToChangeTab | 滑动切换阈值(宽度比例) | number | 0.3 | false |
| usePaged | 是否启用分页模式 | boolean | true | false |
| tabDirection | Tab 方向 | 'horizontal' \| 'vertical' | horizontal | false |
| tabBarUnderlineStyle | tabBar 下划线样式 | React.CSSProperties \| any |  | false |
| tabBarBackgroundColor | tabBar 背景色 | string |  | false |
| tabBarActiveTextColor | tabBar 激活 Tab 文字颜色 | string |  | false |
| tabBarInactiveTextColor | tabBar 非激活 Tab 文字颜色 | string |  | false |
| tabBarTextStyle | tabBar 文字样式 | React.CSSProperties \| any |  | false |
| renderTab | 替换 TabBar 的 Tab | (tab: Models.TabData) => React.ReactNode |  | false |

### Tabs.DefaultTabBar

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| --- | --- | --- | --- | --- |
| goToTab | 跳转 Tab | (index: number) => boolean |  | true |
| tabs | tab 数据 | Models.TabData[] |  | true |
| activeTab | 当前激活 Tab 索引 | number |  | true |
| animated | 是否使用动画 | boolean |  | true |
| prefixCls | 样式前缀 | string | am-tabs-default-bar | false |
| renderTab | 替换 TabBar 的 Tab | (tab: Models.TabData) => React.ReactNode |  | false |
| page | Tab 分页尺寸 | number | 5 | false |
| onTabClick | tab 被点击的回调 | (tab: Models.TabData, index: number) => void |  | false |
