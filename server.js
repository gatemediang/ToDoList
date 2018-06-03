


const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://gatedb:olog1000@ds247170.mlab.com:47170/todo', (err, client) => {
  if (err) return console.log(err)
  db = client.db('todo') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))

  //app.get('/', (req, res) => {
  //  res.send('Hello World')
//  })
  // Note: request and response are usually written as req and res respectively.

  //app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html')
    // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
    // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
  //});
 // app.post('/quotes', (req, res) => {
    //console.log(req.body)
  //}); //this displays in console whatever u input
//creating quotes in collection
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})


app.put('/quotes', (req, res) => {
  //Handle put request
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})