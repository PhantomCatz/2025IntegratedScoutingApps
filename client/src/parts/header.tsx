import whiteBack from '../public/images/whiteBack.png';
import blackBack from '../public/images/blackBack.png';
import whiteLogo from '../public/images/whiteLogo.png';
import blackLogo from '../public/images/blackLogo.png';
import whiteMenu from '../public/images/whiteMenu.png';
import blackMenu from '../public/images/blackMenu.png';
import '../public/stylesheets/header.css';
import React, { useEffect } from 'react';
import {useLocalStorage, } from 'react-use';
import { getRandomHex, } from "../utils/utils";

const DEFAULT_THEME = "light";

function Header(props: any) {
	const name = props.name || "No name set";
	const backLink = props.back;

	const [theme, setTheme] = useLocalStorage<any>('theme', DEFAULT_THEME);
	const [backgroundColor, setBackgroundColor] = useLocalStorage<any>('backgroundColor', '#ffffff');
	const [fontColor, setFontColor] = useLocalStorage<any>('fontColor', '#000000');

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
			icon: blackLogo,
			back: blackBack,
			menu: blackMenu,

		},
		dark: {
			icon: whiteLogo,
			back: whiteBack,
			menu: whiteMenu,
		},
		random: {
			icon: whiteLogo,
			back: whiteBack,
			menu: whiteMenu,
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

		setBackgroundColor(color["--background-color"]);
		setFontColor(color["--font-color"]);

		setTheme(newTheme);
	}

	useEffect(() => {
		const rootElement = document.querySelector(":root") as any;
		rootElement.style.setProperty('--background-color', backgroundColor);
		rootElement.style.setProperty('--font-color', fontColor);
	}, [theme]);

	const iconSet = icons[theme] ?? icons[DEFAULT_THEME];

	return (
		<header className="header">
			<header-images>
				{backLink &&
					<a href={backLink}><img className={"backImg"} src={iconSet.back} alt='Go back'/></a>
				}

				<img
					className={"logoImg"}
					src={iconSet.icon}
					onClick={handleLogoClick}
					onDoubleClick={handleLogoDoubleClick}
					alt="2637 Logo"
				/>

				{props.settingsPage ?
					<div className="settingsContainer"><img className={"menuImg"} src={iconSet.menu} onClick={() => { history.go(-1) }} alt='Settings'></img></div>
					:
					<a href={"#settings"} className="settingsContainer"><img className={"menuImg"} src={iconSet.menu} alt='' /></a>
				}
			</header-images>
			<h1 className={"pageTitle"}>{name}</h1>
		</header>
	);
}


export default Header;
