var MongoClient = require('mongodb').MongoClient;
var DbUrl = 'mongodb://localhost:27017/';
var ObjectID = require('mongodb').ObjectID;

function __connectDb(callback) {
  MongoClient.connect(DbUrl,{useNewUrlParser: true},function (err,client) {
    if(err) {
      console.log('数据库连接失败');
      return;
    }
    var db = client.db('my-blog');
    //增删改查
    callback(db);
    client.close();
  })
}
//暴露ObjectID
exports.ObjectID = ObjectID;
//查找
exports.find = function (collectionname,json,callback,limit,skip) {
  __connectDb(function (db) {
    var result = db.collection(collectionname).find(json).sort({date: -1}).limit(limit || 0).skip(skip || 0).distinct('tags');
    result.toArray(function (error,data) {
      callback(error,data); //拿到数据执行回调函数
    })
  })
}
//增加
exports.insert = function (collectionname,json,callback) {
  __connectDb(function (db) {
    db.collection(collectionname).insertOne(json,function (error,data) {
      callback(error,data);
    })
  })
}
//更新
exports.update = function (collectionname,json1,json2,callback) {
  __connectDb(function (db) {
    db.collection(collectionname).updateOne(json1,{$set:json2},function (error,data) {
      callback(error,data);
    })
  })
}
//删除
exports.delete = function (collectionname,json,callback) {
  __connectDb(function (db) {
    db.collection(collectionname).deleteOne(json,function (error,data) {
      callback(error,data);
    })
  })
}

