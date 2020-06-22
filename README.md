# Visualizing the Database

## Introduction
This project demonstrates how to develop a distributed communication and visualization system with Node.js, mongoDB, and P5.js. The system uses a Node.js client to generate data entries, which are then logged in a MongoDB library to our online database in mlab. Using an API (Application Programming Interface), we are able to visualize these entries on our client application with the use of P5.js.

---

## Database with mlab

For this work, [mongoDB](https://www.mongodb.com/what-is-mongodb) and [mlab](https://mlab.com/home) are used. MongoDB is a JSON-like database system, which makes it easy to work with many applications and frameworks (especially those developed with JavaScript). mlab is a database-as-a-service with a range of features for quicker and efficient development. Here is a [tutorial](https://docs.mlab.com) to get started with mongoDB and mlab.

After setting up your free account with mlab, create a new database, a new collection, and a new user. For the database, select the Sandbox mode, AWS, and Germany as a region, if available (lets keep our data as close to us as possible). After the deployment process finishes, create a new collection (under the **Collections** tab), and a new database user (under **Users**, as image below). Finally, you need to get an API Key and activate the Data API. To access this, click your **user** name on the top right corner of the window.

<p align="center">
<img alt="mLabCreateNewDeployment" src="assets/mLabCreateNewDeployment.png" width="480" />
</p>

<p align="center">
<img alt="settings" src="assets/mLab_new_deployment_database_details.png" width="480" />
</p>

<p align="center">
<img alt="apikey" src="assets/apikey.png" width="480" />
</p>

Screenshots taken from [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose)

---

## Node.js Client

To send new data to the database, Node.js will be used here as a client. Make sure you have Node.js on your system - use Terminal (or Command Prompt) and the following command; this will return the current version of Node.js that is on your system. If your system does not have it, download it from [here](https://nodejs.org/en/). If you are not familiar with Node.js, check [this](https://codeburst.io/getting-started-with-node-js-a-beginners-guide-b03e25bca71b) for a getting started tutorial.

```Terminal
node -v
```
All dependencies for the Node.js project are include in the **node_modules** folder (in NodeJs-Timelog-MongoDB on GitHub), or they can be installed using the **package.json** file. Download the project from the GitHub, and use Terminal to navigate to this directory with cd (check [this link](https://macpaw.com/how-to/use-terminal-on-mac) if you are not familiar with the process). To install them from scratch, run the following in Terminal:

```Terminal
npm install
```

After we make sure that we have the necessary libraries (in this case the mongodb), we import the library into our **main.js** file. To establish communication with our database in mlab, we have to use the mongo shell, provided in mlab (as in photo above: "Database Settings"). The username and user password refer to the new User you added in your mlab database (not the user account).

Following that, the function **getRandomInt()** generates a random number everytime that it is called, within a specified ranged (minimum to maximum). This is used later to generate values for the randomX, randomY, and randomRadius variables.

The last function used here is the **setInterval(function(){ ... }, 1000);** which creates a loop according to a timing value (in ms) that is set at the end of the closing parenthesis - in this case 1000. Thus, every second we generate new random values for the variables randomX, randomY, and randomRadius (when calling the getRandomInt function and assigning the returned value to each separate variable), and also we create a new variable that contains current time and date.


While the loop of this function is every second, the data are sent to the database just once for every minute. When the current second of the system equals to "0", the **mongoLog** variable will create a JSON object that contains our four values, and pass them on to the **MongoClient** object. Here, make sure that the **db.collection** has the name of the Collection that you set in your mlab database. If everything is set properly, then the code will return the message "Data added", and then repeat the same process after one minute.

```JavaScript
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
```

To execute the code above, make sure that you set in Terminal (or Command Prompt) the current directory (cd) for this **NodeJS** folder. Use the following command to start.

```Terminal
node main.js
```

If everything is properly set in your code, you will see on your Terminal the data values as below. The data entries will also appear in mlab - inside the Collection that you used.

```Terminal
2019-01-02_13:33:58, X: 43
2019-01-02_13:33:58, Y: 261
2019-01-02_13:33:58, Radius: 77
2019-01-02_13:33:59, X: 280
2019-01-02_13:33:59, Y: 145
2019-01-02_13:33:59, Radius: 102
2019-01-02_13:34:00, X: 667
2019-01-02_13:34:00, Y: 501
2019-01-02_13:34:00, Radius: 57
Writing to database...
Data added
2019-01-02_13:34:01, X: 577
2019-01-02_13:34:01, Y: 523
2019-01-02_13:34:01, Radius: 84
```

<p align="center">
<img alt="collection" src="assets/mlabCollectionData.png" width="480" />
</p>

---

## Visualizing in P5.js

P5.js is used here to create a simple visualization of the database values that we created. [P5.js](https://p5js.org) is a JavaScript library used by artists and designers in creating interactive media content for the web - here is a [getting started](https://p5js.org/get-started/) guide if you are not familiar with the library.

For this work, we use the values of the database entries to generate properties for the visualization - corresponding to position and size of the shapes that appear on the screen. To accomplish this, we make use of mlab's **API**, which returns a JSON object with all database entries. By creating a **for loop** in the drawData function, we access all values individually, and assign them to the drawing settings of the shape - i.e. x and y define the location of the shape, and the radius the size. Color is generated for each shape - size of the array depends on the database.

The code also works dynamically (in real-time). As the database grows, a new entry is visualized on the screen, with the new shape responding to the location and size values of the database - color is also dynamically generated with random values for RGB.

```JavaScript
//Define global variables
var url; //Variable to store the URL of the database's API
var col = []; //Color array
var counter = 0; //Counter variable used for reloading database

function setup() {
  createCanvas(800, 600);
  frameRate(1); //Framerate is limited to 1 frame per second

  //The URL of the API from mlab needs to have:
  // - The name of the database (i.e. file-test)
  // - the name of the collection (i.e. Collection1)
  // - The API key
  url = 'https://api.mlab.com/api/1/databases/file-test/collections/Collection1?apiKey=XXXXXXXXXXXXXXXXX'
  loadDatabase(); //call the loadDatabase function
}

function loadDatabase(){
  //Use the loadJSON to get from the API the stored JSON object
  //Return the results to the drawData function
  loadJSON(url, drawData);
}

function drawData(data) {
  //The JSON is given back to us from the data variable here.
  //By accessing this, we can retrieve all database entries
  console.log(data); //Inspect the JSON
  background(0);

  //Run all elements of the database and visualize them
  //Use the x and y values for the shape's position, and the radius for the size.
  //Color for each shape is assigned by the col array
  for (var i = 0; i < data.length; i++) {
    //For every item, generate a new random color, and push it in the array
    col[i].push(color(random(255), random(255), random(255), random(255)));

    noStroke();
    //Access the color array element, and use its value for the color of the shape
    fill(col[i]);
    //Access the JSON values using the dot notation and the name of entry
    //(i.e. x, y or radius)
    ellipse(data[i].x, data[i].y, data[i].radius, data[i].radius);

    //Create also a line that connects one shape with the next,
    //using the same col array values
    strokeWeight(1);
    stroke(col[i]);
    if (i>0){
      line(data[i].x, data[i].y, data[i-1].x, data[i-1].y);
    }
  }
}

function draw(){
  //For each loop (defined by frameRate(1), which means one loop per second),
  //add 1 to the counter.
  counter++;
  //When the counter reaches 30 (i.e. half a minute), load the database again,
  //and reset counter to 0
  if (counter>30){
    loadDatabase();
    counter = 0;
  }
}
```
To execute this code, open the **index.html** file in Chrome (recommended), or use the Atom Live Server (instructions how to install and use it, [here](https://webdesign.tutsplus.com/tutorials/quick-tip-setup-local-previews-with-atom--cms-24348)).

Image from the P5 database visualization:

<p align="center">
<img alt="visualize" src="assets/screen-mongoVisualize.png" width="480" />
</p>
