const express = require('express')
const path = require('path')

const app = express()

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// const express = require('express')
// const app = express()
// const path = require('path')

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '0df1bf96cc5344d9b3535e7d0cc13689',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')
// // include and initialize the rollbar library with your access token
// var Rollbar = require("rollbar");
// var rollbar = new Rollbar({
//   accessToken: 'e52add0a647d4556a072c2b6b52cbf86',
//   captureUncaught: true,
//   captureUnhandledRejections: true
// });

// record a generic message and send it to Rollbar
// rollbar.log("Hello world!");

app.use(express.json());

// student data
const students = [ 'jimmy', 'timothy', 'jimothy']

// endpoints
app.get('/traceability11.herokuapp.com/', function(req, res) {
    console.log('Hello World I made it')
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/traceability11.herokuapp.com/api/students', (req, res) => {
    rollbar.info('Someone got the list of students on page load')
    res.status(200).send(students)
})

app.post('/traceability11.herokuapp.com/api/students', function(req, res) {
    let { name } = req.body;
    
    const index = students.findIndex((student) => {
        return student === name
    })

    try {
        if (index === -1 && name !== "") {
          students.push(name);
          rollbar.info('Someone added a student')
          res.status(200).send(students);
        } else if (name === "") {
            rollbar.error('Someone tried to enter a blank student')

            res.status(400).send("must provide a name");
        } else {
            rollbar.error('Someone tried to enter a duplicate student name')
          res.status(400).send("that student already exists");
        }
      } catch (err) {
        console.log(err)
        rollbar.error(err)
      }
})

app.delete('/traceability11.herokuapp.com/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index

    students.splice(targetIndex, 1);

    rollbar.info('Someone deleted a student')
    res.status(200).send(students)
})

// const port = process.env.PORT || 5050;

// app.listen(port, function() {
//     console.log(`Server rocking out on ${port}`)
// })

const port = process.env.PORT || 4005

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})


//https://traceability11.herokuapp.com/