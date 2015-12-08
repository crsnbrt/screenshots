var async = require('async');
var data = require('./data');
var utils = require('./utils');
var config = require('../config');
var pkgcloud = require('pkgcloud');
var phantom = require('phantom-render-stream');
var screenshot = {};

//phantom js client
var render = phantom({
  format      : 'jpeg',
  timeout     : 300000,
  width       : 800,
  height      : 600,
  quality     : 10
});

//cloud storage client
var rs = pkgcloud.storage.createClient(config.STORAGE);

//done: all images have finished
//single: called after each image is finsiehd
screenshot.capture = function(options, done, single){
    single = single || (function(){});
    //defaults
    var urls = options.urls || [];
    var width = options.width || 1280;
    var quality = options.quality || 10;
    var current_count = 0;

    //clean url sext and split to array
    urls = options.urls.replace(/ /g, '').replace(/\r/g, '').split('\n');

    //create requsts object to add finished data to
    var results = {
        id: utils.gen_id(),
        started_at: new Date(),
        urls: urls,
        images: []
    };

    //create a queue to push urls to for processing
    var queue = async.queue(function(url, callback) {
        generate_image(url, width, quality, function(err, image_url){
            current_count++;
            callback(err, image_url);
            single(err, {
                current: current_count,
                total: urls.length
            });
        });
    }, 2);

    //when the queue is done processing all items
    queue.drain = function() {
        console.log('All images have been processed');
        data.set(results, function(err, result){
            done(null, results.id);
        })
    }

    //add each url to the queue to be processed
    urls.forEach(function(url){
        queue.push(url, function (err, image_url) {
            if(err){ console.log(err); }
            results.images.push(image_url);
        });
    });
}

function generate_image(url, width, quality, cb){
    var h = (width/3)*2;
    var name = utils.filename_from_url(url);
    var writeStream = rs.upload({
        container: '22squaredCDN',
        remote: '/util/screenshots/'+name
    }).on('error', function(err) {
        cb(err, null);
    }).on('success', function(file) {
        cb(null, config.BASE_DOMAIN+file.name);
    });
    render(url, {width: width, height: h, quality: quality})
        .pipe(writeStream);
}


module.exports = screenshot;
