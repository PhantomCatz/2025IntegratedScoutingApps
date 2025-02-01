import { jwtVerify, base64url } from "jose";

async function VerifyLogin(cookie: any) {
  try {
    const hash = base64url.decode(process.env.REACT_APP_HASH as string);
    const payload = await jwtVerify(cookie, hash);
    if (payload && window.location.pathname === "/") {
      window.location.href = "/home";
    }
    else if (!payload && window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }
  catch (err) {
    if (window.location.pathname === "/") {

    }
    else {
      window.location.href = "/";
    }
  }
}
async function ChangeTheme(cookie: any) {
  try {
    document.body.style.backgroundColor = "#32a7dc";
  }
  catch (err) {
  //System.out.println("balls")
  }
}
// eslint-disable-next-line
export default { VerifyLogin, ChangeTheme };
