/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:35:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-27 22:24:23
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\registComponents\button.tsx
 */

import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
	changeUserValue,
	ComponentItemFactory,
	createPannelOptions,
	useDynamicAddEventCenter,
	useRegistFunc,
} from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';
function DivTemp(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	const eventCenter = useMemo(() => {
		return pr.config.getEventCenter();
	}, [pr.config]);

	useDynamicAddEventCenter(pr, `${pr.data.id}-init`, '初始渲染时机'); //注册名必须带id 约定！
	useDynamicAddEventCenter(pr, `${pr.data.id}-click`, '点击执行时机');
	useEffect(() => {
		// 模拟抛出事件
		if (pr.context === 'preview') {
			eventCenter.runEventQueue(`${pr.data.id}-init`, pr.config);
		}
	}, [eventCenter, pr.config, pr.context, pr.data.id]);

	const [text, setText] = useState('');
	const op1 = props.op1;

	//  useMemo 主要用来解决使用React hooks产生的无用渲染的性能问题，用来做缓存用。
	const fn = useMemo(() => {
		const functionCenter = eventCenter.getFunctionCenter();
		return functionCenter.register({
			id: `${pr.data.id}+changeText`,
			fn: async (ctx, next, config, args: any, _eventList, iname) => {
				const userSelect = iname.data;
				const ctxVal = changeUserValue(
					userSelect['改变文本数据源'],
					args,
					'_changeval',
					config,
					ctx
				);
				const text = ctxVal[0];
				setText(text);
				next();
			},
			config: [
				{
					name: '改变文本数据源',
					data: ['ctx', 'input', 'dataSource'],
					options: {
						receive: '_changeval',
						multi: false,
					},
				},
			],
			name: `${pr.data.id}+改变文本函数`,
			componentId: pr.data.id,
		});
	}, []);

	useRegistFunc(op1, pr.context, fn);

	return (
		<div
			style={{
				width: pr.data.width ? pr.data.width : props.sizeData[0],
				height: pr.data.height ? pr.data.height : props.sizeData[1],
				borderRadius: props.borderRadius + 'px',
				border: props.border,
				boxShadow: props.boxShadow,
				// border: `${props.borderData.borderWidth}px ${props.borderData.borderStyle} ${props.borderData.borderColor}`,
				// background: props.backgroundColor,
				// color: props.textColor,
				// fontSize: props.fontData.fontSize,
				// fontWeight: props.fontData.fontWeight,
				// fontStyle: props.fontData.fontStyle,
				// textDecoration: props.fontData.textDecoration,
				// lineHeight: props.lineHeight,
			}}
			onClick={() => {
				eventCenter.runEventQueue(`${pr.data.id}-click`, pr.config);
			}}
		></div>
	);
}

const Mdemo = new ComponentItemFactory(
	'div',
	'盒子',
	{
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'border',
				label: '边框',
			}),
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'borderRadius',
				label: '圆角',
			}),
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'boxShadow',
				label: '盒子阴影',
			}),
		],

		fn: [
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '改变文本函数',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	{
		props: {
			sizeData: [100, 30],
			borderRadius: 0,
			border: '1px solid #333333',
			op1: false,
			textColor: 'rgba(255,255,255,1)', // 文字颜色
			boxShadow: '2px 2px 5px #333333', // 盒子阴影
		},
		width: 100, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		height: 30, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		rotate: {
			canRotate: true,
			value: 0,
		},
		canDrag: true, // false就不能拖
	},
	(data, context, store, config) => {
		console.log('data', data);
		console.log('context', context);
		console.log('store', store);
		console.log('config', config);
		return <DivTemp data={data} store={store} context={context} config={config}></DivTemp>;
	},
	true
);

export default Mdemo;
