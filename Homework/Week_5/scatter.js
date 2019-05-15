/* Name: Teska Vaessen
   Student number: 11046341
   This file ......... */

window.onload = function() {

    var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LUX+NLD+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+EST+LVA+SVN+RUS.CWB11/all?startTime=2010&endTime=2016"
    var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LUX+NLD+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+EST+LVA+SVN+RUS.CWB46/all?startTime=2010&endTime=2016"
    var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUT+BEL+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LUX+NLD+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+EST+LVA+SVN+RUS.B1_GE.HCPC/all?startTime=2010&endTime=2016&dimensionAtObservation=allDimensions"

    var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

    Promise.all(requests).then(function(response) {

        teensViolent = transformResponseTeens(response[0]);
        teensPregnant = transformResponseTeens(response[1]);
        countryGDP = transformResponseGDP(response[2]);

        dataset = cleanData(teensViolent, teensPregnant, countryGDP);
        console.log(dataset);


        // Define variables for SVG and create SVG element
        var svgWidth = 750;
        var svgHeight = 500;
        var margin = {top: 50, right: 30, bottom: 30, left: 50};
        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

        // console.log(dataset['2010'][0]['GDP']);
        // console.log(d3.max(dataset['2010'], function(d) { return d['GDP']; }));
        // console.log(d3.min(dataset['2010'], function(d) { return d['GDP']; }))

        //On click, update with new data
		d3.selectAll(".m")
		  .on("click", function() {

			  var date = this.getAttribute("value");
			  var str;
			  if(date == "2010"){
                  dataset = dataset["2010"];
              }else if(date == "2011"){
                  dataset = dataset["2011"];
              }else if(date == "2012"){
                  dataset = dataset["2012"];
              }else if(date == "2013"){
                  dataset = dataset["2013"];
              }else if(date == "2014"){
                  dataset = dataset["2014"];
              }else{
                  dataset = dataset["2015"];
              }

        // Define xScale
        var xScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset['2010'], function(d) { return d['GDP']; })])
                       .range([margin.left, svgWidth - margin.right]);

        // Define yScale
        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset['2010'], function(d) { return d['Pregnancy']; })])
                       .range([svgHeight - margin.top, margin.bottom]);

        createScatter(dataset, svg, xScale, yScale, margin)
        createAxes(dataset, svg, xScale, yScale, svgHeight, margin)
        createLabels(svg, svgHeight, svgWidth, margin)

    }).catch(function(e){
        throw(e);
    });

};

function createScatter(dataset, svg, xScale, yScale, margin){
    // d3.interpolatePuBuGn
    var colorScale = d3.scaleQuantize()
                       .domain([0, d3.max(dataset['2010'], function(d) { return d['Violent']; })])
                       .range(['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494']);
                       // .range(d3.range(6).map(function(i) { return "q" + i + "-9"; }));

    var colorLegend = d3.legendColor()
                        .labelFormat(d3.format(".0f"))
                        .scale(colorScale)
                        .shapePadding(5)
                        .shapeWidth(25)
                        .shapeHeight(10)
                        .labelOffset(12);

    svg.selectAll("circle")
       .data(dataset['2010'])
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        return xScale(d['GDP']);
       })
       .attr("cy", function(d) {
            return yScale(d['Pregnancy']);
       })
       .attr("r", 4)
       .style("fill", function(d, i ) { return colorScale(d['Violent']); });

    svg.append("g")
   	   .attr("class", "legend")
   	   .attr("transform", "translate(" + 2*margin.right + "," + margin.bottom + ")")
   	   .call(colorLegend);
}

function createAxes(dataset, svg, xScale, yScale, svgHeight, margin){

    // Create x axis
    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (svgHeight - margin.top) + ")")
       .call(xAxis);

   // Create y axis
   var yAxis = d3.axisLeft(yScale);

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

}

function createLabels(svg, svgHeight, svgWidth, margin){
    // Add x label
    svg.append('text')
       .attr('class', 'title')
       .attr("font-weight", "bold")
       .attr('x', (svgWidth + margin.left) / 2)
       .attr('y', svgHeight - 10)
       .attr('text-anchor', 'middle')
       .text('GDP');

    // Add y label
    svg.append('text')
       .attr('class', 'title')
       .attr("font-weight", "bold")
       .attr("transform", "rotate(-90)")
       .attr('x', -svgHeight / 2)
       .attr('y', margin.left / 2)
       .attr('text-anchor', 'middle')
       .text('Pregancy iets');

    // Add title
    svg.append('text')
       .attr('class', 'title')
       .attr("font-size", "15px")
       .attr("font-weight", "bold")
       .attr('x', (svgWidth + margin.left + 10) / 2)
       .attr('y', 11)
       .attr('text-anchor', 'middle')
       .text('GDP en Pregnancy ofzo blabla');

}

function transformResponseTeens(data){

    // Save data
    let originalData = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output object, an object with each country being a key and an array
    // as value
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });

    // return the finished product!
    return dataObject;
}

function transformResponseGDP(data){

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    return dataObject;
}

function cleanData(teensViolent, teensPregnant, countryGDP){

    var dataset = {"2010": [],
                   "2011": [],
                   "2012": [],
                   "2013": [],
                   "2014": [],
                   "2015": []};

    for (country in teensViolent){
        // console.log(teensViolent[country][0]["Datapoint"]);
        for(var i = 0, size = teensViolent[country].length; i < size ; i++){
            // console.log(teensViolent[country][i]['2010']);
            if (teensViolent[country][i]['Time'] == 2010 && countryGDP[country][i]['Year'] == 2010){
                // console.log(teensViolent[country][i]['Datapoint']);
                dataset["2010"].push({Country: country, Violent: teensViolent[country][i]['Datapoint'], Pregnancy: teensPregnant[country][i]['Datapoint'], GDP: countryGDP[country][i]['Datapoint']});
            }
            if (teensViolent[country][i]['Time'] == 2011 && countryGDP[country][i]['Year'] == 2011){
                // console.log(teensViolent[country][i]['Datapoint']);
                dataset["2011"].push({Country: country, Violent: teensViolent[country][i]['Datapoint'], Pregnancy: teensPregnant[country][i]['Datapoint'], GDP: countryGDP[country][i]['Datapoint']});
            }
            if (teensViolent[country][i]['Time'] == 2012 && countryGDP[country][i]['Year'] == 2012){
                // console.log(teensViolent[country][i]['Datapoint']);
                dataset["2012"].push({Country: country, Violent: teensViolent[country][i]['Datapoint'], Pregnancy: teensPregnant[country][i]['Datapoint'], GDP: countryGDP[country][i]['Datapoint']});
            }
            if (teensViolent[country][i]['Time'] == 2013 && countryGDP[country][i]['Year'] == 2013){
                // console.log(teensViolent[country][i]['Datapoint']);
                dataset["2013"].push({Country: country, Violent: teensViolent[country][i]['Datapoint'], Pregnancy: teensPregnant[country][i]['Datapoint'], GDP: countryGDP[country][i]['Datapoint']});
            }
            if (teensViolent[country][i]['Time'] == 2014 && countryGDP[country][i]['Year'] == 2014){
                // console.log(teensViolent[country][i]['Datapoint']);
                dataset["2014"].push({Country: country, Violent: teensViolent[country][i]['Datapoint'], Pregnancy: teensPregnant[country][i]['Datapoint'], GDP: countryGDP[country][i]['Datapoint']});
            }
            if (teensViolent[country][i]['Time'] == 2015 && countryGDP[country][i]['Year'] == 2015){
                // console.log(teensViolent[country][i]['Datapoint']);
                dataset["2015"].push({Country: country, Violent: teensViolent[country][i]['Datapoint'], Pregnancy: teensPregnant[country][i]['Datapoint'], GDP: countryGDP[country][i]['Datapoint']});
            }
        }
    }

    // return the dataset
    return dataset;
};
