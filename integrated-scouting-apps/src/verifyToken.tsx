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
    if (cookie === "og") {
      document.body.style.backgroundColor = "#32a7dc";
    }
    else if (cookie.substring(0, 2) === "lg") {
      let red = 0;
      let rdir = true;
      let green = 0;
      let gdir = true;
      let blue = 0;
      let bdir = true;
      setInterval(() => {
        if (red === 50 || red === 0) {
          rdir = !rdir;
        }
        if (Math.round(green) === 167 || Math.round(green) === 0) {
          gdir = !gdir;
        }
        if (Math.round(blue) === 220 || Math.round(blue) === 0) {
          bdir = !bdir;
        }
        if (red < 51 && rdir) {
          red++;
        }

        else if (red > 0 && !rdir) {
          red--;
        }
        if (green < 168 && gdir) {
          green += 3.34;
        }
        else if (green > 0 && !gdir) {
          green -= 3.34;
        }
        if (blue < 221 && bdir) {
          blue += 4.4;
        }
        else if (blue > 0 && !bdir) {
          blue -= 4.4;
        }
        if (document.getElementById("footer")) {
          (document.getElementById("footer") as HTMLElement).style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;  
        }
        document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
      }, Number(cookie.substring(2)));
    }
    else {
      document.body.style.backgroundColor = "#433D3C";
    }
  }
  catch (err) {
  //System.out.println("balls")
  }
}
// eslint-disable-next-line
export default { VerifyLogin, ChangeTheme };
