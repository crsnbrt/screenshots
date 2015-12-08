var fs = require('fs');
var path = require('path');
var Datastore = require('nedb');
var db_file = path.join(__dirname, "../data/screenshots");
var db = new Datastore({ filename: db_file, autoload: true });
data = {};

data.get = function(id, cb){
    db.findOne({ id: id }, function (err, doc) {
        if(err){cb(err, null);}
        cb(null, doc);
    });
};

data.getRecent = function(cb){
    db.find({}).sort({'started_at': -1}).limit(10).exec(function (err, docs) {
        if(err){cb(err, null);}
        cb(null, docs);
    });
};

data.set = function(doc, cb){
    db.insert(doc, function (err, newDoc) {
        if(err){ cb(err, null) }
        cb(null, {message: "done"});
    });
};

module.exports = data;
