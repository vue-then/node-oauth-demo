// Import the express lirbary
// const express = require('express')

// This is the client ID and client secret that you obtained
// while registering the application
const clientID = '7e015d8ce32370079895'
const clientSecret = '2b976af0e6b6ceea2b1554aa31d1fe94ea692cd9'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');

const app = new Koa();

// Import the axios library, to make HTTP requests



// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const main = serve(path.join(__dirname + '/public'));
app.use(main);

const oauth = async ctx => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);
  const tokenResponse = await axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json'
    }
  });
  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.name;

  ctx.response.redirect(`/welcome.html?name=${name}`);
};

app.use(route.get('/oauth/redirect', oauth));

/*
app.get('/oauth/redirect', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code;
  console.log('code:', requestToken);
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token;

    return axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`
      }
    });

    // redirect the user to the welcome page, along with the access token
    // res.redirect(`/welcome.html?access_token=${accessToken}`)
  }).then(response => {
    // console.log(response.data);
    // res.redirect(`/welcome.html`)
  })
})
*/
// Start the server on port 8080
app.listen(8080);
