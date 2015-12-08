var path = require('path');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var screenshot_service = require('./service/screenshot');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('capture', function(msg){
        console.log(JSON.stringify(msg));
        if(msg.urls){
            screenshot_service.capture(msg, function(err, id){
                //callback for all complete
                socket.emit('done', {
                    message: id
                });
            }, function(err, data){
                //callback for single image complete
                socket.emit('single', {
                    current: data.current || "unknown",
                    total: data.total || "unknown"
                });
            });
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
    error: err
    });
    });
}

// production error handler stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
    error: {}
    });
});

http.listen(process.env.PORT || '3000', function(){
    console.log('server listening');
});
