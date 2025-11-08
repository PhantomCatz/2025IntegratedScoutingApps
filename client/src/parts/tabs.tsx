import React, { useState, useRef, useEffect, } from 'react';
import '../public/stylesheets/tabs.css';

function Tabs(props: any) {
	const items = props.items ?? [];
	const onChange = props.onChange ?? (() => {});

	const defaultActiveKey = props.defaultActiveKey ??
		(items?.length ?
			items[0].key :
			""
		);

	const activeKey = props.activeKey;

	const [currentKey, _setCurrentKey] = useState<string>(defaultActiveKey);

	function setCurrentKey(key) {
		_setCurrentKey(key);
		onChange(key);
	}

	useEffect(() => {
		if(activeKey && activeKey !== currentKey) {
			setCurrentKey(activeKey);
		}
	}, [activeKey, currentKey]);

	const navigationItems = items.map((item, index) => {
		return (
			<nav-label
				key={item.key}
				{...(item.key === currentKey ? {selected: true} : {})}
				onClick={function(event) {
					setCurrentKey(item.key);
				}}
			>
				{ item.label }
			</nav-label>
		);
	});

	const tabItems = items.map((item, index) => {
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
