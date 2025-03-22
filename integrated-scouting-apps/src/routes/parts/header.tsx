import back from '../../public/images/back.png';
import darkback from '../../public/images/dark_back.png';
import logo from '../../public/images/logo.png';
import darklogo from '../../public/images/dark_logo.png';
import '../../public/stylesheets/style.css';
import '../../public/stylesheets/header.css';
import React, { useState, useEffect } from 'react';

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

  const [theme, setTheme] = useState<'light' | 'dark' | 'pink'>('light'); 
  const root2 = () => {
    const root = document.documentElement;
    root.style.setProperty('--pc-blue', ' #ffffff');// #32a7dc
    root.style.setProperty('--font-color', '#000000');
  };

  const root3 = () => {
    const root = document.documentElement;
    root.style.setProperty('--pc-blue', ' #000000'); 
    root.style.setProperty('--font-color', '#ffffff');
  };

  const root4 = () => {
    const root = document.documentElement;
    root.style.setProperty('--pc-blue', '#f79ac0'); 
    root.style.setProperty('--font-color', ' #f1f3ffff');
  };

  const handleLogoClick = () => {
	if (theme === 'pink') {
		setTheme('light');
	  } else {
		if (theme === 'light') {
		  setTheme('dark');
		} else if (theme === 'dark') {
		  setTheme('light');
		}
	  }
	};

  const handleLogoDoubleClick = () => {
    setTheme('pink');
  };

  useEffect(() => {
    if (theme === 'light') {
      root2();
    } else if (theme === 'dark') {
      root3();
    } else if (theme === 'pink') {
      root4();
    }
  }, [theme]);

  return (
    <header className="header">
      {!isRootPage && <a href={backLink}><img className={"backImg"} src={theme === 'dark' ? back : darkback} alt=''></img></a>}
      <img
        className={"logoImg"}
		src={theme === 'pink' ? logo : theme === 'dark' ? logo : darklogo}
        onClick={handleLogoClick} 
        onDoubleClick={handleLogoDoubleClick} 
        alt="Logo"
      />
      <h1 className={"pageTitle"}>{name}</h1>
    </header>
  );
}

export default Header;
