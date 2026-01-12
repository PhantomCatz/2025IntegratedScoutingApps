import React, { useState, useEffect, } from 'react';
import '../public/stylesheets/tabs.css';

type Props = {
	items?: TabItems,
	onChange?: (key: string) => void,
	defaultActiveKey?: string,
	activeKey?: string,
};

function Tabs(props: Props): React.ReactElement {
	const items = props.items ?? [];
	const onChange = props.onChange ?? (() => {});

	const defaultActiveKey = props.defaultActiveKey ??
		(items.length ?

			items[0].key :
			""
		);

	const activeKey = props.activeKey;

	const [currentKey, _setCurrentKey] = useState<string>(defaultActiveKey);

	function setCurrentKey(key: string): void {
		_setCurrentKey(key);
		onChange(key);
	}

	useEffect(() => {
		if(activeKey && activeKey !== currentKey) {
			setCurrentKey(activeKey);
		}
	}, [activeKey, currentKey]);

	const navigationItems = items.map((item) => {
		return (
			<nav-label
				key={item.key}
				{...(item.key === currentKey ? {selected: true} : {})}
				onClick={function(_) {
					setCurrentKey(item.key);
				}}
			>
				{ item.label }
			</nav-label>
		);
	});

	const tabItems = items.map((item) => {
		return (
			<tab-page
				key={item.key}
				{...(item.key === currentKey ? {activetab: true} : {})}
			>
				{item.children}
			</tab-page>
		);
	});

	return (
		<tabs-container>
			<tabs-nav-container>
				{...navigationItems}
				<tab-ink-bar></tab-ink-bar>
			</tabs-nav-container>
			{...tabItems}
		</tabs-container>
	);
}

export { Tabs };

export type TabItem = { label: string, key: string, children: React.ReactElement };
export type TabItems = { label: string, key: string, children: React.ReactElement }[];
