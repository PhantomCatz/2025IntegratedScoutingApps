import lightBack from '../../public/images/back.png';
import darkBack from '../../public/images/dark_back.png';
import lightLogo from '../../public/images/logo.png';
import darkLogo from '../../public/images/dark_logo.png';
import '../../public/stylesheets/style.css';
import '../../public/stylesheets/header.css';
import React, { useEffect } from 'react';
import {useLocalStorage, } from 'react-use';

const DEFAULT_THEME = "dark";

/**
 * Header Component
 *
 * props.back = link to previous page
 * props.name = name of current page
 */
function Header(props: any) {
	const isRootPage = props.rootPage || false;
	const name = props.name || "No name set";
	const backLink = props.back || "/";

	const [theme, setTheme] = useLocalStorage<any>('theme', DEFAULT_THEME); 
	const [background, setBackground] = useLocalStorage<any>('background', '#000000'); 
	const [fontColor, setFontColor] = useLocalStorage<any>('fontColor', '#ffffff'); 

	const colors : any = {
		light: () => ({
			'--pc-blue': ' #ffffff',// #32a7dc
			'--font-color': '#000000',
		}),
		dark: () => ({
			'--pc-blue': ' #000000',
			'--font-color': '#ffffff'
		}),
		random: () => ({
			'--pc-blue': `#${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}`,
			'--font-color': `#${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}`,
		}),
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
		random: {
			icon: lightLogo,
			back: lightBack,
		},
	};

	function handleLogoClick() {
		if (theme === 'random') {
			updateTheme('light');
		} else if (theme === 'light') {
			updateTheme('dark');
		} else if (theme === 'dark') {
			updateTheme('light');
		}
	}

	function handleLogoDoubleClick() {
		updateTheme('random');
	}

	function updateTheme(newTheme : string) {
		if(!colors[newTheme]) {
			newTheme = DEFAULT_THEME;
			console.log(`newTheme=`, newTheme);
		}
		const themeColors = colors[newTheme];
		const color = themeColors();
		setBackground(color["--pc-blue"]);
		setFontColor(color["--font-color"]);

		setTheme(newTheme);
	}

	useEffect(() => {
		const rootElement = document.querySelector(":root") as any;
		rootElement.style.setProperty('--pc-blue', background); 
		rootElement.style.setProperty('--font-color', fontColor); 
	}, [theme]);

	const iconSet = icons[theme] ?? icons[DEFAULT_THEME];

	return (
		<header className="header">
		{!isRootPage &&
			<a href={backLink}><img className={"backImg"} src={iconSet.back} alt=''></img></a>}
			<img
				className={"logoImg"}
				src={iconSet.icon} 
				onClick={handleLogoClick} 
				onDoubleClick={handleLogoDoubleClick} 
				alt="Logo"
			/>
			<h1 className={"pageTitle"}>{name}</h1>
		</header>
	);
}


function getRandomHex() {
	const randVal = Math.floor(Math.random() * 16);
	const vals = "0123456789ABCDEF";

	return vals[randVal];
}

export default Header;
