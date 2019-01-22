const express = require('express');
const router = express.Router();
const DB = require('../db/db_basic');
const mail = require('../email')
const ObjectID = require('mongodb').ObjectID;
const md5 = require('md5-node');
const crypto = require('crypto'); //node自带的加密模块

const emailForm = (title, name, otherName, message, content, url) => {
  let string = `
<div style="width: 90%; border: 2px solid lightgreen; margin: 1rem auto; padding: 1rem; text-align: center;">
        <p style="border-bottom: 1px dashed lightgreen; margin: 0;padding-bottom: 1rem; color: lightgreen; font-size: 1.25rem;">${title}</p>
        <p style="margin: 1rem 0 0;">hello,${name} &#x1f608</p>
        <p style="margin: 0 0 1rem;">${otherName}${message}</p>
        <p style="width: 70%; border-left: 4px solid lightgreen; padding: 1rem; margin: 0 auto 2rem; text-align: left;white-space: pre-line;">${content}</p>
    <a href= ${url} style="text-decoration: none; background: lightgreen;color: #fff; height: 2rem; line-height: 2rem; padding: 0 1rem; display: inline-block; border-radius: 0.2rem;">前往查看</a>
        </div>
    `
  return string
}

//发送邮件通知站长
router.post('/mail',(req,res) => {
  //const address = 'blog_wjm@126.com';
  const address = req.body.address;
  const address1 = req.body.address1;
  const content = `
<div style="width: 90%; border: 2px solid lightgreen; margin: 1rem auto; padding: 1rem; text-align: center;">
    <p style="border-bottom: 1px dashed lightgreen;margin: 0;padding-bottom: 1rem; color: lightgreen; font-size: 1.25rem;">MyBlog Message</p>
<p style="margin: 1rem 0 0;">hello,站长</p>
<p sytle="margin: 0 0 1rem;">你有一条新留言</p>
<p style="width: 70%; border-left: 4px solid lightgreen; padding: 1rem; margin: 0 auto 2rem; text-align: left;white-space: pre-line;">主题: ${req.body.subject}
内容: ${req.body.content}
邮箱: ${address}
    </p>
    <a href="http://localhost:8080/home" style="text-decoration: none; background: lightgreen;color: #fff; height: 2rem; line-height: 2rem; padding: 0 1rem; display: inline-block; border-radius: 0.2rem;">回到博客</a>
    </div>
    `
  mail.send(address1,'您的博客有一条新留言',content,res);
  res.status(200).send('send email successfully');
})
//获取tags
router.get('/tags',(req,res) => {
  DB.__connectDb(function (db) {
    db.collection('articles').distinct('tags',(err, doc) => {
      if (err) {
        console.log(err)
      } else if (doc) {
        //console.log(doc);
        res.send(doc);
      }
    });
  })
  /*DB.find('articles',{isPublish: true},function (err,tags) {
    var tagsResult = [];
    console.log(tags);
    /!*for(var i=0; i<tags.length; i++) {
      tagsResult.push([...new Set(tags[i].tags)]);
    }
    console.log(tagsResult);*!/
    //res.send(tags);
  })*/
});
//获取某篇文章
router.get('/article/:aid',(req,res) => {
  //var id = Number(req.params.aid)
  var id = req.params.aid;
  //console.log(typeof id);
  DB.__connectDb(function (db) {
    db.collection('articles').findOne({"aid": ObjectID(id)},(err,doc) => {
      if(err) {
        console.log(err);
      }else {
        //console.log(doc);
        res.status(200).send(doc);
      }
    });
  })
})
//获取很多文章
router.get('/articles',(req,res) => {
  const page = JSON.parse(req.query.payload).page;
  const value = JSON.parse(req.query.payload).value;
  const limit = JSON.parse(req.query.payload).limit - 0 || 4;
  const skip = limit * (page-1);
  if(value && value !== '全部') {
    DB.__connectDb(function (db) {
      var result = db.collection('articles').find({tags: value,isPublish:true}).sort({date: -1}).limit(limit).skip(skip);
      result.toArray(function (error,articles) {
        //console.log(articles);
        res.send(articles);
      })
    })
  }else {
    DB.__connectDb(function (db) {
      var result = db.collection('articles').find({isPublish:true}).sort({date: -1}).limit(limit).skip(skip);
      result.toArray(function (error,articles) {
        //console.log(articles);
        res.send(articles);
      })
    })
    /*DB.find('articles',{isPublish: true},function (err,articles) {
      res.send(articles);
    },limit,skip)*/
  }
})
//搜索一些文章
router.get('/someArticles',(req,res) => {
  //console.log('成功');
  //console.log(req);
  //console.log(typeof JSON.parse(req.query.payload));
  const key = JSON.parse(req.query.payload).key;
  //console.log(key);
  const value = JSON.parse(req.query.payload).value;
  //console.log(value);
  //const page = req.query.payload.page || 1;
  //const skip = 4 * (page-1);
  const re = new RegExp(value,'i');
  //console.log(re);
  if(key === 'title') {
    DB.__connectDb(function (db) {
      var result = db.collection('articles').find({title:re,isPublish: true});
      result.toArray(function (error,articles) {
        //console.log(articles);
        res.send(articles);
      })
    })
  }
  if(key === 'tags') {
    const arr = value.split(' ');
    DB.__connectDb(function (db) {
      var result = db.collection('articles').find({tags: {$all: arr}}).sort({date: -1}).limit(4);
      result.toArray(function (error,articles) {
        res.send(articles);
      })
    })
  }
  if(key === 'date') {
    const nextDay = value + 'T24:00:00';
    DB.__connectDb(function (db) {
      var result = db.collection('articles').find({date: {$gte: new Date(value), $lt: new Date(nextDay)}}).sort({date: -1}).limit(4);
      result.toArray(function (error,articles) {
        res.send(articles);
      })
    })
  }
})
//获取某一篇文章的所有评论
/*router.get('/comments',(req,res) => {
  const articleId = JSON.parse(req.query.payload).id;
  if(req.query.payload.sort === 'date') {
    DB.__connectDb(function (db) {
      var result = db.collection('comments').find({articleId: articleId}).sort({date: -1});
      result.toArray(function (error,comments) {
        console.log(comments);
        res.send(comments);
      })
    })
  }else if(req.query.payload.sort === 'like') {
    DB.__connectDb(function (db) {
      var result = db.collection('comments').find({articleId: articleId}).sort({date: -1});
      result.toArray(function (error,comments) {
        console.log(comments);
        res.send(comments);
      })
    })
  }else {
    DB.__connectDb(function (db) {
      var result = db.collection('comments').find({articleId: articleId});
      result.toArray(function (error,comments) {
        console.log(comments);
        res.send(comments);
      })
    })
  }
})*/
//发布评论并通知站长和评论者
router.post('/comment',(req,res) => {
  /*DB.__connectDb(function (db) {
      db.collection('comments').findOne({name: req.body.name, articleId: req.body.articleId},(err,doc) => {
          console.log(doc);
        if(doc && doc.address !== req.body.address) {
          res.status(403).end('用户名已存在')
        }else if(!doc || doc.address === req.body.address) {
          const comment = {
            imgName: req.body.imgName,
            name: req.body.name,
            address: req.body.address,
            date: Date(),
            content: req.body.content,
            articleId: req.body.articleId,
            like: 0
          }
          /!*if (/^@(.*):/.test(req.body.content)) {
            const reviewer = /^@(.*):/.exec(req.body.content)[1]                // 评论者的名字
            db.collection('comments').findOne({name: reviewer, articleId: req.body.articleId},(err,doc) => {
              console.log('req.body.curPath: '+ req.body.curPath);
              const url = 'https://localhost:8080' + req.body.curPath;
              const replyEmail = doc.address
              const content =  emailForm('欢迎常来我的博客', reviewer, req.body.name, '回复了你的评论',req.body.content, url)
              mail.send(replyEmail, '您在FatDong的博客有一条新评论', content, res)
            })
          }*!/
          db.collection('comments').insertOne(comment).then(
            db.collection('articles').updateOne({aid: ObjectID(req.body.articleId),},{$inc: {comment_n: 1}},(err) => {
              if(err) {
                console.log(err);
              }else {
                console.log('succeed in updating ---');
                res.status(200).send('succeed in updating ---');
              }
            })
        ).catch((err) => {console.log(err)});
/!*
          db.collection('articles').updateOne({aid: ObjectID(req.body.articleId),},{$inc: {comment_n: 1}},(err) => {
            if(err) {
              console.log(err);
            }else {
              console.log('succeed in updating ---');
              res.status(200).send('succeed in updating ---');
            }
          });
*!/
        }
      });
    })*/
  DB.__connectDb(function (db) {
    const comment = {
      imgName: req.body.imgName,
      name: req.body.name,
      address: req.body.address,
      date: Date(),
      content: req.body.content,
      articleId: req.body.articleId,
      like: 0
    }
    db.collection('comments').insertOne(comment, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send('succeed in saving new passage.')
      }
    });
    /*
            db.collection('articles').updateOne({aid: ObjectID(req.body.articleId),},{$inc: {comment_n: 1}},(err) => {
              if(err) {
                console.log(err);
              }else {
                console.log('succeed in updating ---');
                res.status(200).send('succeed in updating ---');
              }
            });
    */
    /*DB.__connectDb(function (db) {
      db.collection('comments').findOne({name: req.body.name, articleId: req.body.articleId},(err,doc) => {
          console.log(doc);
        if(doc && doc.address !== req.body.address) {
          res.status(403).end('用户名已存在')
        }else if(!doc || doc.address === req.body.address) {
          const comment = {
            imgName: req.body.imgName,
            name: req.body.name,
            address: req.body.address,
            date: Date(),
            content: req.body.content,
            articleId: req.body.articleId,
            like: 0
          }
          if (/^@(.*):/.test(req.body.content)) {
            const reviewer = /^@(.*):/.exec(req.body.content)[1]                // 评论者的名字
            db.collection('comments').findOne({name: reviewer, articleId: req.body.articleId},(err,doc) => {
              console.log('req.body.curPath: '+ req.body.curPath);
              const url = 'https://localhost:8080' + req.body.curPath;
              const replyEmail = doc.address
              const content =  emailForm('欢迎常来我的博客', reviewer, req.body.name, '回复了你的评论',req.body.content, url)
              mail.send(replyEmail, '您在FatDong的博客有一条新评论', content, res)
            })
          }
          db.collection('comments').insertOne(comment).then(() => {
            const url = 'https://www.xxx.cn' + req.body.curPath
            const content = emailForm('MyBlog Message', '站长', req.body.name, '评论了你的文章',req.body.content, url)
            mail.send('2672666735@qq.com', '您的博客有一条新评论', content, res)
            res.status(200).send('send email successfully')
          }).catch(err => { console.log(err) })
          db.collection('articles').updateOne({aid: ObjectID(req.body.articleId),},{$inc: {comment_n: 1}},(err) => {
            if(err) {
              console.log(err);
            }else {
              console.log('succeed in updating ---');
              res.status(200).send('succeed in updating ---');
            }
          });
        }
      });
    })*/
  })
})
//获取某一篇文章的所有评论
router.get('/comments',(req,res) => {
  const articleId = JSON.parse(req.query.payload).id;
  //console.log('articleId: '+articleId);
  if (req.query.payload.sort === 'date') {                              // 根据时间排序评论
    DB.__connectDb(function (db) {
      var result = db.collection('comments').find({articleId: articleId}).sort({date: -1});
      result.toArray(function (error,comments) {
        //console.log('comments:'+comments);
        res.send(comments);
      })
    })
  } else if (req.query.payload.sort === 'like') {                         // 根据点赞数量排序评论
    DB.__connectDb(function (db) {
      var result = db.collection('comments').find({articleId: articleId}).sort({like: -1});
      result.toArray(function (error,comments) {
        //console.log('comments:'+comments);
        res.send(comments);
      })
    })
  } else {                                                                // 根据文章的aid获取所有评论
    DB.__connectDb(function (db) {
      var result = db.collection('comments').find({articleId: articleId});
      console.log('result: '+ result);
      result.toArray(function (error,comments) {
        //console.log('comments:'+comments);
        res.send(comments);
      })
    })
  }
})
//更新评论的点赞数
router.patch('/comments/:id',(req,res) => {
  const id = req.params.id;
  //console.log('id: '+id);
  //console.log(req.body.option);
  if (req.body.option === 'add') {
    DB.__connectDb(function (db) {
      db.collection('comments').updateOne({_id: ObjectID(id)}, {$inc: {like: 1}}, (err) => {
        if (err) {
          console.log(err);
        } else {
          //console.log('succeed in updating ---');
          res.status(200).send('succeed in updating ---');
        }
      });
    })
  } else if(req.body.option === 'drop') {
    DB.__connectDb(function (db) {
      db.collection('comments').updateOne({_id: ObjectID(id)}, {$inc: {like: -1}}, (err) => {
        if (err) {
          console.log(err);
        } else {
          //console.log('succeed in updating ---');
          res.status(200).send('succeed in updating ---');
        }
      });
    })
  }
})
//后台
//登录
router.post('/login',(req,res) => {
  var name = req.body.name;
  var password = req.body.password;
  let md5 = crypto.createHash('md5');
  let secretPassword = md5.update(password).digest('hex');
  DB.__connectDb(function (db) {
    db.collection('users').findOne({name: name,password: secretPassword},(err,doc) => {
      if(err) {
        console.log(err);
      }else {
        //console.log(doc);
        res.status(200).send({
          name: doc.name,
          token: doc._id
        });
      }
    });
  })
})
//修改账户
router.post('/user',(req,res) => {
  let password = req.body.password;
  let md5 = crypto.createHash('md5');
  let secretPassword = md5.update(password).digest('hex');
  const user = {
    name: req.body.name,
    password: secretPassword
  }
  DB.__connectDb(function (db) {
    db.collection('users').updateOne({id: req.body.id},{$set:user},(err) => {
      if(err) {
        console.log(err);
      }else {
        res.status(200).send('update successfully');
      }
    });
  })
})
//删除文章
router.delete('/article/:aid',(req,res) => {
  const aid = req.params.aid;
  /*DB.__connectDb(function (db) {
    db.collection('articles').deleteOne({aid: req.params.aid},(err,data) => {
      if(err) {
        console.log(err);
      }else {
        /!*db.collection('comments').deleteOne({articleId: req.params.aid},(err,data) => {
          if(err) {
            console.log(err);
          }else {
            console.log('succeed in deleting ---' + data);
            res.status(200).send('succeed in deleting ---' + data)
          }
        })*!/
        console.log('succeed in deleting ---' + data);
        res.status(200).send('succeed in deleting ---' + data)
      }
    });
  })*/
  DB.__connectDb(function (db) {
    db.collection('articles').deleteOne({"aid": ObjectID(aid)}).then((data) => {
      /*db.collection('comments').deleteOne({"articleId": aid}).then((data) => {
        console.log('succeed in deleting ---' + data);
        res.status(200).send('succeed in deleting ---' + data)
      },(err) => {console.log(err)})*/
      /*db.collection('comments').deleteOne({articleId: req.params.aid},(err,data) => {
        if(err) {
          console.log(err);
        }else {
          console.log('succeed in deleting ---' + data);
          res.status(200).send('succeed in deleting ---' + data)
        }
      })*/
      //console.log('succeed in deleting ---' + data);
      res.status(200).send('succeed in deleting ---' + data)
    },(err) => {console.log(err)});
  })
})
//发布文章
router.post('/article',(req,res) => {
  const article = {
    comment_n: 0,
    title: req.body.title,
    content: req.body.content,
    date: new Date(),
    aid: ObjectID(),
    tags: req.body.tags,
    isPublish: true
  }
  DB.__connectDb(function (db) {
    db.collection('articles').insertOne(article,(err) => {
      if(err) {
        console.log(err);
      }else {
        res.status(200).send('succeed in saving new passage.')
      }
    });
  })
})
//更新文章
router.patch('/article/:aid',(req,res) => {
  const aid = req.params.aid;
  //console.log(aid);
  const article = {
    title: req.body.title,
    tags: req.body.tags,
    date: Date(),
    content: req.body.content,
    isPublish: true
  }
  DB.__connectDb(function (db) {
    db.collection('articles').updateOne({aid: ObjectID(aid)},{$set:article},(err) => {
      if(err) {
        console.log(err);
      }else {
        //console.log('succeed in updating ---');
        res.status(200).send('succeed in updating ---');
      }
    });
  })
})
//获取所有的草稿
router.get('/drafts',(req,res) => {
  const page = req.query.payload.page;
  const limit = req.query.payload.limit - 0 || 8;
  const skip = limit * (page - 1);
  DB.__connectDb(function (db) {
    var result = db.collection('articles').find({isPublish:false}).sort({date: -1}).limit(limit).skip(skip);
    result.toArray(function (error,articles) {
      //console.log('草稿: '+ articles);
      res.send(articles);
    })
  })
})
//更新草稿
router.patch('/draft/:aid',(req,res) => {
  const aid = req.params.aid;
  /*console.log('tags: ' + req.body.tags);
  console.log('日期: ' + Date());*/
  const article = {
    title: req.body.title,
    tags: req.body.tags,
    date: Date(),
    content: req.body.content,
    isPublish: false
  }
  DB.__connectDb(function (db) {
    db.collection('articles').updateOne({aid: ObjectID(aid)},{$set:article},(err) => {
      if(err) {
        console.log(err);
      }else {
        //console.log('succeed in updating ---');
        res.status(200).send('succeed in updating ---');
      }
    });
  })
})
//保存草稿
router.post('/draft',(req,res) => {
  const article = {
    title: req.body.title,
    content: req.body.content,
    date: new Date(),
    aid: ObjectID(),
    tags: req.body.tags,
    isPublish: false
  }
  DB.__connectDb(function (db) {
    db.collection('articles').insertOne(article,(err) => {
      if(err) {
        console.log(err);
      }else {
        res.status(200).send('succeed in saving new passage.')
      }
    });
  })
})

module.exports = router;
