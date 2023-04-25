/*
 * @Author: yehuozhili
 * @Date: 2021-02-27 21:33:36
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-29 23:35:58
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\index.tsx
 */

import { InitConfig, LeftDataPannel } from 'dooringx-lib';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';
import { ContainerOutlined, PlayCircleOutlined, HighlightOutlined } from '@ant-design/icons';
import commandModules from './commanderModules';
import { functionMap } from './functionMap';
import { Formmodules } from './formComponentModules';

// 自定义组件
import { createFromIconfontCN } from '@ant-design/icons';
const MyIcon = createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/c/font_4037858_ubprsvj68y.js',
});

// 侧边栏组件配置
const LeftRegistMap: LeftRegistComponentMapItem[] = [
	{
		type: 'basic',
		component: 'div',
		imgCustom: <MyIcon type="icon-demobox" style={{ fontSize: '50px' }} />,
		displayName: '盒子',
	},
	{
		type: 'basic',
		component: 'span',
		imgCustom: <MyIcon type="icon-editor-text" style={{ fontSize: '50px' }} />,
		displayName: '文字',
	},
	{
		type: 'basic',
		component: 'image',
		imgCustom: <MyIcon type="icon-tupian" style={{ fontSize: '50px' }} />,
		displayName: '图片',
		urlFn: () => import('./registComponents/basic/image'),
	},
	{
		type: 'basic',
		component: 'button',
		img: 'icon-anniu',
		imgCustom: <MyIcon type="icon-anniu" style={{ fontSize: '50px' }} />,
		displayName: '按钮',
		urlFn: () => import('./registComponents/basic/button'),
	},
	{
		type: 'basic',
		component: 'input',
		imgCustom: <MyIcon type="icon-shurukuang" style={{ fontSize: '50px' }} />,
		displayName: '输入框',
		urlFn: () => import('./registComponents/basic/inputCo'),
	},
];

//  侧边栏样式配置
export const defaultConfig: Partial<InitConfig> = {
	leftAllRegistMap: LeftRegistMap,
	leftRenderListCategory: [
		{
			type: 'basic',
			icon: <HighlightOutlined />,
			displayName: '基础',
		},
		{
			type: 'media',
			icon: <PlayCircleOutlined />,
			displayName: '媒体组件',
		},
		{
			type: 'datax',
			icon: <ContainerOutlined />,
			custom: true,
			displayName: '数据源',
			customRender: (config) => <LeftDataPannel config={config}></LeftDataPannel>,
		},
		{
			type: 'xxc',
			icon: <ContainerOutlined />,
			custom: true,
			displayName: '自定义',
			customRender: () => <div>我是自定义渲染</div>,
		},
	],
	initComponentCache: {
		// input: { component: InputCo },
	},
	rightRenderListCategory: [
		{
			type: 'style',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					外观
				</div>
			),
		},
		{
			type: 'animate',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					动画
				</div>
			),
		},
		{
			type: 'fn',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					函数
				</div>
			),
		},
		{
			type: 'actions',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					事件
				</div>
			),
		},
	],
	initFunctionMap: functionMap,
	initCommandModule: commandModules,
	initFormComponents: Formmodules,
};

export default defaultConfig;
