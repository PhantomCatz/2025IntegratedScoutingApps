import whiteBack from '../public/images/whiteBack.png';
import blackBack from '../public/images/blackBack.png';
import whiteLogo from '../public/images/whiteLogo.png';
import blackLogo from '../public/images/blackLogo.png';
import whiteMenu from '../public/images/whiteMenu.png';
import blackMenu from '../public/images/blackMenu.png';
import '../public/stylesheets/header.css';
import React, { useEffect } from 'react';
import {useLocalStorage, } from 'react-use';
import { parseHexColor } from "../utils/utils";

type Props = {
	name: string;
	back?: string;
	settingsPage?: boolean;
};

function Header(props: Props): React.ReactElement {
	const name = props.name || "No name set";
	const backLink = props.back;

	const [backgroundColor, _setBackgroundColor] = useLocalStorage<string>('backgroundColor', '#ffffff');
	const [fontColor, _setFontColor] = useLocalStorage<string>('fontColor', '#000000');
	console.log(`backgroundColor=`, backgroundColor);
	console.log(`fontColor=`, fontColor);

	const icons = {
		light: {
			icon: blackLogo,
			back: blackBack,
			menu: blackMenu,

		},
		dark: {
			icon: whiteLogo,
			back: whiteBack,
			menu: whiteMenu,
		}
	};

	useEffect(() => {
		const rootElement = document.querySelector(":root") as HTMLHtmlElement;
		rootElement.style.setProperty('--background-color', backgroundColor ?? "");
		rootElement.style.setProperty('--font-color', fontColor ?? "");
	}, [backgroundColor, fontColor]);


	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const [r, g, b] = parseHexColor(backgroundColor?.substring(1) ?? "").map((c) => c >= 0.0031308 ? 1.055 * (c ** (1 / 2.4)) - 0.055 : 12.92 * c);

	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const l = Math.cbrt(r * 0.4122214708 + g * 0.5363325363 + b * 0.0514459929);
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const m = Math.cbrt(r * 0.2119034982 + g * 0.6806995451 + b * 0.1073969566);
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const s = Math.cbrt(r * 0.0883024619 + g * 0.2817188376 + b * 0.6299787005);
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const lightness = l * 0.2104542553 + m * 0.7936177850 + s * -0.0040720468;
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const isLight = lightness >= 0.5;

	console.log(`lightness=`, lightness);

	const theme = isLight ? "light" : "dark";
	const iconSet = icons[theme];

	return (
		<header className="header">
			{backLink &&
				<a href={backLink}><img className={"backImg"} src={iconSet.back} alt='Go back'/></a>
			}

			<img
				className={"logoImg"}
				src={iconSet.icon}
				alt="2637 Logo"
			/>

			<h1 className={"pageTitle"}>{name}</h1>

			{props.settingsPage ?
				<div className="settingsContainer"><img className={"menuImg"} src={iconSet.menu} onClick={() => { history.go(-1) }} alt='Settings'></img></div>
				:
				<a href={"#settings"} className="settingsContainer"><img className={"menuImg"} src={iconSet.menu} alt='' /></a>
			}
		</header>
	);
}


export default Header;
