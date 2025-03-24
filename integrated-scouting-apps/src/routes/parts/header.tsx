import lightBack from '../../public/images/back.png';
import darkBack from '../../public/images/dark_back.png';
import lightLogo from '../../public/images/logo.png';
import darkLogo from '../../public/images/dark_logo.png';
import '../../public/stylesheets/style.css';
import '../../public/stylesheets/header.css';
import React, { useState, useEffect } from 'react';
import {useLocalStorage, } from 'react-use';

/**
 * Delocalised header
 * 
 * props.back = link to previous page
 * props.name = name of current page
 */
function Header(props: any) {
	const isRootPage = props.rootPage || false;
	const name = props.name || "No name set";
	const backLink = props.back || "/";

	const [theme, setTheme] = useLocalStorage<any>('theme', 'dark'); 

	const colors : any = {
		light: {
			'--pc-blue': ' #ffffff',// #32a7dc
			'--font-color': '#000000',
		},
		dark: {
			'--pc-blue': ' #000000',
			'--font-color': '#ffffff'
		},
		pink: {
			'--pc-blue': '#f79ac0',
			'--font-color': 'rgb(255, 241, 248)',
		},
	};
	const icons : any = {
		light: {
			icon: darkLogo,
			back: darkBack,
		},
		dark: {
			icon: lightLogo,
			back: lightBack,
		},
		pink: {
			icon: lightLogo,
			back: lightBack,
		},
	};

	const handleLogoClick = () => {
		if (theme === 'pink') {
			setTheme('light');
		} else if (theme === 'light') {
			setTheme('dark');
		} else if (theme === 'dark') {
			setTheme('light');
		}
	};

	const handleLogoDoubleClick = () => {
		setTheme('pink');
	};

	useEffect(() => {
		const root = document.documentElement;
		for(const [variable, color] of Object.entries(colors[theme])) {
			root.style.setProperty(variable, color as any); 
		}
	}, [theme]);

	return (
		<header className="header">
		{!isRootPage &&
			<a href={backLink}><img className={"backImg"} src={icons[theme].back} alt=''></img></a>}
			<img
				className={"logoImg"}
				src={icons[theme].icon} 
				onClick={handleLogoClick} 
				onDoubleClick={handleLogoDoubleClick} 
				alt="Logo"
			/>
			<h1 className={"pageTitle"}>{name}</h1>
		</header>
	);
}

export default Header;
