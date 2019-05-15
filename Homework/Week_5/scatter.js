/* Name: Teska Vaessen
   Student number: 11046341
   This file creates an interactive scatter plot about the relationship between
   the GDP of a country and the teen pregnancy rate. It also shows the rate of
   teen living in a area with a high crime rate. */

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

        // Define variables for SVG and create SVG element
        var svgWidth = 800;
        var svgHeight = 500;
        var margin = {top: 50, right: 30, bottom: 30, left: 50};
        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

        // Set the year 2010 as default scatter plot
        // Define xScale
        var xScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset["2010"], function(d) { return d['GDP']; })])
                       .range([margin.left, svgWidth - margin.right]);

        // Define yScale
        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset["2010"], function(d) { return d['Pregnancy']; })])
                       .range([svgHeight - margin.top, margin.bottom]);
        var date = 2010;

        createScatter(dataset["2010"], svg, xScale, yScale, margin);
        createAxes(dataset["2010"], svg, xScale, yScale, svgHeight, margin);
        createLabels(date, svg, svgHeight, svgWidth, margin);

        // Based the update code on http://bl.ocks.org/anupsavvy/9513382
        // from Anup’s Block 9513382
        // On click, update with new data year
		d3.selectAll(".m")
		  .on("click", function() {
			  var date = this.getAttribute("value");
              dataset_new = dataset[date];

              // Define xScale
              var xScale = d3.scaleLinear()
                             .domain([0, d3.max(dataset_new, function(d) { return d['GDP']; })])
                             .range([margin.left, svgWidth - margin.right]);

              // Define yScale
              var yScale = d3.scaleLinear()
                             .domain([0, d3.max(dataset_new, function(d) { return d['Pregnancy']; })])
                             .range([svgHeight - margin.top, margin.bottom]);

              createScatter(dataset_new, svg, xScale, yScale, margin);
              createAxes(dataset_new, svg, xScale, yScale, svgHeight, margin);
              createLabels(date, svg, svgHeight, svgWidth, margin);

          });

    }).catch(function(e){
        throw(e);
    });

};

function createScatter(dataset, svg, xScale, yScale, margin){
    // Remove the old dots
    svg.selectAll("circle")
       .remove();

    // Remove the old legend and axes
    svg.selectAll("g")
       .remove();
    svg.selectAll("text.legend")
       .remove();

    // Set color scale for the color of the dots
    var colorScale = d3.scaleQuantize()
                       .domain([0, d3.max(dataset, function(d) { return d['Violent']; })])
                       .range(['#c7e9b4','#7fcdbb','#1d91c0','#253494','#081d58']);

    // Based all legend code on https://bl.ocks.org/zanarmstrong/0b6276e033142ce95f7f374e20f1c1a7
    // from zan’s Block 0b6276e033142ce95f7f374e20f1c1a7
    // Set legend for the color of the dots
    var colorLegend = d3.legendColor()
                        .labelFormat(d3.format(".0f"))
                        .scale(colorScale)
                        .shapePadding(5)
                        .shapeWidth(25)
                        .shapeHeight(10)
                        .labelOffset(12);

    // Based all tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1
    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    // tooltip mouseover event handler
    var tipMouseover = function(d) {
    var color = colorScale(d['Violent']);
    var html  = "<span style='color:" + color + ";'>" + d['Country'] + "</span><br/>";

        tooltip.html(html)
            .style("left", (d3.event.pageX + 12) + "px")
            .style("top", (d3.event.pageY - 18) + "px")
            .transition()
            .duration(200)
            .style("opacity", .9)

    };

    // tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
               .duration(300)
               .style("opacity", 0);
    };

    // Create the dots
    svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        return xScale(d['GDP']);
       })
       .attr("cy", function(d) {
            return yScale(d['Pregnancy']);
       })
       .attr("r", 5)
       .style("fill", function(d, i ) { return colorScale(d['Violent']); })
       .on("mouseover", tipMouseover)
       .on("mouseout", tipMouseout);

    // Create the legend
    svg.append("g")
   	   .attr("class", "legend")
   	   .attr("transform", "translate(" + 2*margin.right + "," + margin.bottom + ")")
   	   .call(colorLegend);

    // Add title for legend
    svg.append("text")
       .attr("class", "legend")
       .attr("x", 50)
   	   .attr("y", 26)
   	   .attr("text-anchor", "start")
   	   .style("font-weight", "bold")
       .style("font-size", "10px")
   	   .text("Teens in crime area rate");
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

function createLabels(date, svg,svgHeight, svgWidth, margin){
    // Remove old title
    svg.selectAll("text.title")
       .remove()

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
       .text('Teen Pregnancy rate');

    // Add title
    svg.append('text')
       .attr('class', 'title')
       .attr("font-size", "15px")
       .attr("font-weight", "bold")
       .attr('x', (svgWidth + margin.left + 10) / 2)
       .attr('y', 11)
       .attr('text-anchor', 'middle')
       .text('Relationship between GDP, teen pregnancy and teens living in high crime in Europe in ' + date);

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
    // Create empty data set with the years you want data from
    var dataset = {"2010": [],
                   "2011": [],
                   "2012": [],
                   "2013": [],
                   "2014": [],
                   "2015": []};

    // Create a list with the years in your dataset
    var years = Object.keys(dataset);

    // Append all the data to your dataset
    for (country in teensViolent){
        for (element in years){
            let year = years[element];
            if (teensViolent[country][element]['Time'] == year && countryGDP[country][element]['Year'] == year){
                dataset[year].push({Country: country, Violent: teensViolent[country][element]['Datapoint'], Pregnancy: teensPregnant[country][element]['Datapoint'], GDP: countryGDP[country][element]['Datapoint']});
            }
        }
    }

    // return the dataset
    return dataset;
};
