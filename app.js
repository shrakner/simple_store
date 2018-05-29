const sqlite = require('sqlite');
const http = require('http');
const loadJsonFile = require( 'load-json-file' );

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  var html = buildHtml(req);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var json_settings_string = '';
var json_settings_obj;
var settings_db_string = '';


loadJsonFile( 'settings.json' ).then( json => {
    console.log(json);

    if( json ) {
        try {
            json_settings_string = JSON.stringify( json );
        } catch(e) {
            json_settings_string = "parse failure";
        }
    }

    if( json ) {
        try {
            //json_settings_obj = JSON.parse( json );
            settings_db_string = "./"+json.DbName;
        } catch(e) {
            settings_db_string = "parse failure";
        }
    }
});

const dbPromise = sqlite.open( json_settings_string, { Promise });

function buildHtml(req) {
    var head = `
        <title>Image DB Project</title>

        <style type="text/css">
            sub, sup {
                font-size: 0.5em;
            }
        </style>
    `;

    var body = `
        <h1>
            En taro Adun
            <sub>(Hello world is boring)</sub>
        </h1>
    `;

    body += `
        <main>
    `;

    body += '<p>Settings string:<br />'+json_settings_string+'</p><p>Database: '+settings_db_string+'</p>';

    body += `
        </main>
    `;

  // concatenate header string
  // concatenate body string

  return '<!DOCTYPE html>'
       + '<html><head>' + head + '</head><body>' + body + '</body></html>';
};