const fs      = require('fs')
const config  = JSON.parse(fs.readFileSync('./config.json'))
var   expa    = require('node-gis-wrapper')(config.expa.username, config.expa.password);
const podio     = require("./podioHandler")

let newPodio = {}

let lcsId = {
  "AIESEC in UTP": 1,
  "AIESEC in VIRTUAL EXPANSIONS PANAMA": 2,
  "AIESEC in VERAGUAS": 3,
  "AIESEC in COCLE": 4,
  "AIESEC in CHIRIQUI": 5,
  "AIESEC in USMA": 6,
  "AIESEC in UP (University of Panama)": 7
}

async function getArray( fromDate ){
  let opps = []
  return new Promise(function(resolve, reject) {
    let token = ""
    expa.getToken()
    .then( expaToken => {
      token = expaToken
      return {
        "access_token": token,
        "filters[created][from]": fromDate
      }
    })
    .then( request => {
      return expa.get('/opportunities', request)
    })
    .then(async function( response ) {
      let pages = response.paging.total_pages
      for (let i = 1; i <= pages; i++) {
        let req = {
          "access_token": token,
          "filters[created][from]": fromDate,
          "page": i
        }
        await expa.get('/opportunities', req)
        .then(res => {
          for (var dat in res.data) {
            opps.push(res.data[dat])
          }
        })
      }
      resolve(opps)
    })
  });
}

async function sendPodio( item ){
  let request = {
    "fields": [
      {
        "status": "active",
        "type": "text",
        "field_id": 180790418,
        "label": "Opportunity Name",
        "values": [
          {
            "value": item.opName
          }
        ],
        "external_id": "titulo"
      },
      {
        "status": "active",
        "type": "text",
        "field_id": 180790467,
        "label": "Opportunity ID",
        "values": [
          {
            "value": item.opId
          }
        ],
        "external_id": "opportunity-id"
      },
      {
        "status": "active",
        "type": "text",
        "field_id": 180790468,
        "label": "Opportunity URL",
        "values": [
          {
            "value": item.opURL
          }
        ],
        "external_id": "opportunity-url"
      },
      {
        "status": "active",
        "type": "number",
        "field_id": 180790469,
        "label": "Applicants",
        "values": [
          {
            "value": item.numAps
          }
        ],
        "external_id": "applicants"
      },
      {
        "status": "active",
        "type": "date",
        "field_id": 180790470,
        "label": "Applications Close Date",
        "values": [
          {
            "start": "2018-11-22 00:00:00",
            "start_date_utc": "2018-11-22",
            "start_time_utc": null,
            "start_time": null,
            "start_utc": "2018-11-22",
            "start_date": "2018-11-22"
          }
        ],
        "external_id": "applications-close-date"
      },
      // {
      //   "status": "active",
      //   "type": "category",
      //   "field_id": 180790471,
      //   "label": "LC",
      //   "values": [
      //     {
      //       "value": {
      //         "status": "active",
      //         "text": item.LC,
      //         "id": lcsId[item.LC],
      //         "color": "DCEBD8"
      //         }
      //     }
      //   ]
      // }
    ]
  }

  podio.newItem(21915653, request).then(console.log)

}


function getOpportunities( fromDate ){
  getArray( fromDate )
  .then( opps => {
    let count = 0
    for (var i = 0; i < opps.length; i++) {
      let op = opps[i]
      if( op.programmes.short_name == "GV"){
        count += 1
        let strArr   = op.title.split(" ")
        strArr = strArr.map(str => { return str.toLowerCase() })
        console.log(strArr);

        let project = "-"
        if (strArr.includes('improve')){
          project = "Improve"
        }else if( strArr.includes('impulse') ){
          project = "Impulse"
        }

        newPodio.opName = op.title
        newPodio.numAps = op.applications_count
        newPodio.opId   = op.id.toString()
        newPodio.opURL  = "https://aiesec.org/opportunity/" + op.id
        newPodio.LC     = "AIESEC in " + op.office.name
        newPodio.status = op.status
        newPodio.openDate   = op.created_at
        newPodio.closeDate  = op.applications_close_date
        newPodio.startDate  = op.earliest_start_date
        newPodio.finishDate = op.latest_end_date
        newPodio.project    = project

        console.log(newPodio);
      }
      // sendPodio(newPodio)
    }
    console.log(count);
  })
}

let date = new Date("2018-08-01T00:00:00.000Z")

getOpportunities( date )
