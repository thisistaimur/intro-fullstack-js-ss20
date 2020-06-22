//Import MongoDB
var MongoClient = require('mongodb').MongoClient;
//URL of the Mongo database
//dbuser1 - username of the database
//dbuser1pass - password for the user
//file-test - name of the database
var url = 'mongodb://dbuser1:dbuser1pass@dsXXXXXX.mlab.com:61022/file-test';

//Function to get a random number, from a minimum to a maximum value
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

//The setInterval function process the content every 1000ms
setInterval(function(){
  //Get a random value, and assign it a new variable
  var randomX = getRandomInt(0, 800);
  var randomY = getRandomInt(0, 600);
  var randomRadius = getRandomInt(10, 80);

  //Format the date and time to use for the value log
  var date = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');

  //Print to the console the date and the random value
  console.log(date +", X: "+ randomX);
  console.log(date +", Y: "+ randomY);
  console.log(date +", Radius: "+ randomRadius);

  //Create a seconds variable to use for minute validation
  var seconds = new Date();

  //If the seconds equal to 0, then store the values to the db
  if(seconds.getSeconds() == 0){
    console.log("Writing to database...");

    //Format the data for mongoDB
    var mongoLog = [{
      time: date,
      x: randomX,
      y: randomY,
      radius: randomRadius
    }];

    //Connect to the client
    MongoClient.connect(url, function (err, db) {
      //Collection1 is the name of the db's collection
      var col = db.collection('Collection1');
      //Insert the results, and close the connection
      col.insert(mongoLog, function(err, result){
        db.close();
      });
      console.log("Data added");
    });
  }
}, 1000);
