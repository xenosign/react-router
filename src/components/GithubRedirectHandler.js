import axios from 'axios';
import { useEffect } from 'react';

export default function GithubRedirectHandler() {
  useEffect(() => {
    const CODE = new URL(window.location.href).searchParams.get('code');
    const GITHUB_CLIENT_ID = 'Iv1.1b017e86d5470be6';
    const GITHUB_REDIRECT_URI = 'http://localhost:3000/oauth/callback/github';
    const GITHUB_CLIENT_SECRET = 'e25c64ba00ab596c8e9ee2e639bc2fa06e189a8e';
    const ACCESS_TOKEN_URL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${CODE}`;
    const HEROKU_ACCESS_TOKEN_URL = `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${CODE}`;
    console.log(CODE);

    const gitHubLogin = async () => {
      // var req = new XMLHttpRequest();
      // req.open(
      //   'POST',
      //   'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',
      //   true,
      // );
      // req.setRequestHeader('Accept', 'application/json');
      // req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // req.send(
      //   'code=' +
      //     encodeURIComponent(CODE) +
      //     `&client_id=${GITHUB_CLIENT_ID}` +
      //     `&client_secret=${GITHUB_CLIENT_SECRET}`,
      // );
      // const resToken = await fetch(HEROKU_ACCESS_TOKEN_URL, {
      //   method: 'POST',
      //   // headers: {
      //   //   'Content-Type': 'application/x-www-form-urlencoded',
      //   //   Accept: 'application/json',
      //   // },
      // });
      //   axios({
      //     method: 'post',
      //     url: ACCESS_TOKEN_URL,
      //     data: {
      //       client_id: GITHUB_CLIENT_ID,
      //       client_secret: GITHUB_CLIENT_SECRET,
      //       code: CODE,
      //     },
      //   })
      //     .then(function (res) {
      //       console.log('Success ' + res);
      //     })
      //     .catch(function (err) {
      //       console.error('Error ' + err.message);
      //     });
      // const resToken = await fetch(
      //   `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${CODE}`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       Accept: 'application/json',
      //     },
      //   },
      // );
      // console.log(resToken);
    };

    gitHubLogin();
  }, []);

  // useEffect(() => {
  //   async function loginFetch() {
  //     const tokenResponse = await axios.post(
  //       `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${CODE}`,
  //     );
  //     console.log(tokenResponse);
  //   }
  //   loginFetch();
  // });
}
