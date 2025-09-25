import lightBack from '../public/images/light-back.png';
import darkBack from '../public/images/dark-back.png';
import lightLogo from '../public/images/light-logo.png';
import darkLogo from '../public/images/dark-logo.png';
import '../public/stylesheets/header.css';
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
			'--background-color': ' #ffffff',// #32a7dc
			'--font-color': '#000000',
		}),
		dark: () => ({
			'--background-color': ' #000000',
			'--font-color': '#ffffff'
		}),
		random: () => ({
			'--background-color': `#${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}${getRandomHex()}`,
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
		setBackground(color["--background-color"]);
		setFontColor(color["--font-color"]);

		setTheme(newTheme);
	}

	useEffect(() => {
		const rootElement = document.querySelector(":root") as any;
		rootElement.style.setProperty('--background-color', background);
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
	const vals = "0123456789ABCDEF";
	const randVal = Math.floor(Math.random() * vals.length);

	return vals[randVal];
}

export default Header;

/*
[localStorage.background, localStorage.fontColor]
Array [ '"#F6C586"', '"#357856"' ]

[localStorage.background, localStorage.fontColor]
Array [ '"#460372"', '"#70D880"' ]

[localStorage.background, localStorage.fontColor]
Array [ '"#350009"', '"#F76E46"' ]

[localStorage.background, localStorage.fontColor]
Array [ '"#29595C"', '"#BCE6BD"' ]

[localStorage.background, localStorage.fontColor]
Array [ '"#1E0F09"', '"#DE607D"' ]

[localStorage.background, localStorage.fontColor]
Array [ '"#0B7642"', '"#6EB907"' ]

​
*/
