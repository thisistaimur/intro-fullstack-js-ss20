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
  //The JSON is given back to us from the data variable here. By accessing this, we can retrieve all database entries
  console.log(data); //Inspect the JSON
  background(0);

  //Run all elements of the database and visualize them
  //Use the x and y values for the shape's position, and the radius for the size. Color for each shape is assigned by the col array
  for (var i = 0; i < data.length; i++) {
    //For every item, generate a new random color, and push it in the array
    col[i].push(color(random(255), random(255), random(255), random(255)));

    noStroke();
    //Access the color array element, and use its value for the color of the shape
    fill(col[i]);
    //Access the JSON values using the dot notation and the name of entry (i.e. x, y or radius)
    ellipse(data[i].x, data[i].y, data[i].radius, data[i].radius);

    //Create also a line that connects one shape with the next, using the same col array values
    strokeWeight(1);
    stroke(col[i]);
    if (i>0){
      line(data[i].x, data[i].y, data[i-1].x, data[i-1].y);
    }
  }
}

function draw(){
  //For each loop (defined by frameRate(1), which means one loop per second), add 1 to the counter.
  counter++;
  //When the counter reaches 30 (i.e. half a minute), load the database again, and reset counter to 0
  if (counter>30){
    loadDatabase();
    counter = 0;
  }
}
