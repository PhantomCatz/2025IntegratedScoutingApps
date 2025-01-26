import back from '../public/images/back.png';
import logo from '../public/images/logo.png';
import '../public/stylesheets/style.css';
import '../public/stylesheets/header.css';

/**
 * Delocalised header
 * 
 * props.back = link to previous page
 * props.name = name of current page
 */
function Header(props : any) {
	return (
	<header className="header">
			<a href={props.back}> <img className={"backImg"} src={back} alt=''></img> </a>
			<img className={"logoImg"} src={logo} alt=''></img>
			<h1 className={"pageTitle"}>{props.name}</h1>
	</header>
	);
}

export default Header;
