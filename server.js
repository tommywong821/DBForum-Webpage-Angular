// function requireHTTPS(req, res, next) {
//   console.log('requireHTTPS');
//   // The 'x-forwarded-proto' check is for Heroku
//   if (!req.secure) {
//     console.log('redirect: ' + 'https://' + req.headers.host + req.url);
//     return res.redirect('https://' + req.headers.host + req.url);
//   }
//   console.log('next');
//   next();
// }

const express = require('express');
const path = require('path');

const app = express();
const port = 4200;

// app.use(requireHTTPS);
app.use(express.static(__dirname + '/dist/ustdboat-forum'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/ustdboat-forum/index.html'));
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})
