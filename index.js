'use strict'

const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'))
let podio     = require("./podioHandler")

var   expa    = require('node-gis-wrapper')(config.expa.username, config.expa.password);

let token
async function getToken(){
  await expa.getToken()
    .then(expa_token => token = expa_token)
    .catch(console.log)
  console.log(token);
}
getToken()
//
// for (var i = 0; i < 10; i++) {
//   let request = {
//     "fields": [
//       {
//         "status": "active",
//         "type": "text",
//         "field_id": 180787440,
//         "label": "Nombre",
//         "values": [
//           {
//             "value": `test${i}`
//           }
//         ],
//         "external_id": "titulo"
//       }
//     ]
//   }
//   podio.newItem(21915341, request).then(console.log)
// }
//


var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

app.get('/', (req, res) => {
  res.status(200)
  res.json({"Works":"yes"})
});


if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
// setValues(values)

// setValues(values)
