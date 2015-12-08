var fs = require('fs');
var path = require('path');
var moment = require('moment');
var utils = {};

utils.gen_id = function(){
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

utils.filename_from_url = function(url){
    url = url.replace(/\/$/, "");
    url = url.substr(url.lastIndexOf('/') + 1);
    var now = moment().format('MM-DD-YYYY-h-mm-ss');
    return url + "_" + now + '.jpeg';
}

module.exports = utils
