const config = require('config');

let app = require('./app');
// let port = process.env.PORT || config.get( 'server.port' );

// let server = app.listen( port, function () {
let server = app.listen(42001, function () {
    console.log('Express server listening on port ' + 42001);
});
