//References
//var $sampleInfoPanel = document.querySelector("#sample-metadata");
//changed name from $sampleInfoPanel to sampleMetadata
var $sampleMetadata = document.getElementById("#sample-metadata");
var defaultSample = "BB_940";

function init(sample) {
  // sample metadata panel
  //url = "/metadata/" + defaultSample
  console.log("inside init again, current sample:" + defaultSample)
  //url = "/metadata/BB_940"; //hard coded version
  url = "/metadata/" + defaultSample;
  console.log(url)
  Plotly.d3.json(url, function (error, response) {
    if (error) return console.log(error);
    console.log('response' + response);
    // get list of keys from response
    var responseKeys = Object.keys(response);
    console.log(responseKeys);

    // identify correct div
    metadata_info = document.getElementById("#sample-metadata");
    // reset HTML to be nothing
    metadata_info.innerHTML = "";
    // loop through response keys and create a P element for each including
    // response key and value
    for (var i = 0; i < responseKeys.length; i++) {
      var p = document.createElement('p');
      p.innerHTML = responseKeys[i] + ": " + response[responseKeys[i]];
      //$sampleMetadata.appendChild(p);
      metadata_info.appendChild(p);
    }

  });

  //};
  //end init

  //When route = "/samples/BB_940"
  //samples route needs pie chart and bubble chart. 
  //Plotly.d3.json("samples/" + defaultSample, function(error, samp_response){
  samp_url = "/samples/" + defaultSample;
  //Plotly.d3.json('samples/BB_940', function (error, samp_response) {
  Plotly.d3.json(samp_url, function (error, samp_response) {
    if (error) return console.warn(error);
    console.log(samp_response);
    labels = samp_response.otu_ids.slice(0, 10);
    vals = samp_response["sample_values"].slice(0, 10);  //Change to dot notation?

    //Pie Chart needs OTU descriptions as hovertext for chart. Get matching descriptions and create a list
    var bacteriaNamesPie = [];
    for (var i = 0; i < labels.length; i++) {
      bacteriaNamesPie.push(samp_response[labels[i]]);
    }
    console.log(bacteriaNamesPie);
    //set up data for pie chart
    var data = [{
      values: labels,
      labels: vals,
      hovertext: bacteriaNamesPie,
      hoverinfo: {
        bordercolor: 'black'
      },
      type: 'pie'
    }];
    console.log("data: " + data);
    var layout = {
      title: "Samples"
      // showlegend: true,
      // legend: {
      //   x: 100,
      //   y: 1,
      //   traceorder: 'normal',
      //   font: {
      //     family: 'sans-serif',
      //     size: 12,
      //     color: '#000'
      //   },
      //   bgcolor: '#E2E2E2',
      //   bordercolor: '#FFFFFF',
      //   borderwidth: 2
      // }

    };


    var PIE = document.getElementById('pie');
    Plotly.plot(PIE, data, layout);
  });

//names
Plotly.d3.json('/names', function(error, names_response){
  if (error) return console.warn(error);

  console.log("Names Response:" + names_response);
  
  var name_select = document.getElementById('selDataset');
  name_select.innerHTML = "";
  for(i=0; i<names_response.length; i++){
      var elem = document.createElement("option");
      elem.textContent = names_response[i]; //used textContent instead of innerHTML
      elem.value = names_response[i];
      name_select.appendChild(elem);
  }
});


  //Bubble Chart 
  bubl_url = "/samples/" + defaultSample; //eg. '/samples/BB_947'
  //Plotly.d3.json('samples/BB_940', function (error, bubble_response) {
  Plotly.d3.json(bubl_url, function (error, bubble_response) {
    var bubbleDiv = document.getElementById("bubble-chart");
    //if (error) return console.warn(error);
    console.log(bubble_response);
    var trace1 = {
      type: "scatter",
      mode: "markers",
      x: bubble_response.otu_ids, //.slice(0,10),
      y: bubble_response.sample_values, //slice(0,10),
      marker: {
        colorscale: 'Viridis', //Earth
        //color: bubble_response.otu_ids, //.slice(0,10),
        size: bubble_response.sample_values,
        sizemode: 'area' //default is diameter, use area for bubble charts
        //size: bubble_response.sample_values //.slice(0,10) //["sample_values"]
      },
    };
    var bubdata = [trace1];
    var bublayout = {
      title: "Bubble Chart",
      // hovermode: 'closest',
      // showlegend: false,
      // height: 600,
      // margin:
      // {
      //   top: 10,
      //   bottom: 10,
      //   right: 10,
      //   left: 10
      // }
    };
    //};
    Plotly.plot(bubbleDiv, bubdata, bublayout);
  }); //;



} //new end init

//////////////////////////////////
/* update pie and bubble charts */
//////////////////////////////////
function updatePie(newsampleValues, newotuIds, newSample) {
  var pie = document.getElementById("pie");
  Plotly.restyle(pie, "values", [newsampleValues]);
  Plotly.restyle(pie, "labels"[newotuIds]);
};
function updateBubble(newX, newY, newSample) {
  var bubble = document.getElementById("bubble-chart");
  Plotly.restyle(bubble, "x", [newX]);
  Plotly.restyle(bubble, "y", [newY]);
};

/////////////////////////////
/* option changed function for dropdown */
/////////////////////////////
function optionChanged() {  
  const metadataUrl = "/metadata/" + defaultSample;
  const sampleUrl = "/samples/" + defaultSample;
  //console.log(defaultSample);
  
   //get new data from sample route
   Plotly.d3.json(sampleUrl, function (error, newData) {
    if (error) return console.log(error);
    console.log(newData);
    //slice to grab top 10 values from keys
    var newsampleValues = newData[0]["sample_values"].slice(0, 10);
    console.log('newsamplevalues' + newsampleValues)
    var newotuIds = newData[0]["otu_ids"].slice(0, 10);
    console.log('newotuIds' + newotuIds)
    //get values for bubble chart x- and y-axis 
    var newX = newData[0]["otu_ids"]
    var newY = newData[0]["sample_values"]
    updatePie(newsampleValues, newotuIds, newSample);
    updateBubble(newX, newY, newSample);
});
};


init(defaultSample);