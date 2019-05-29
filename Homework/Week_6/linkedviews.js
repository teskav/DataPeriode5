/* Name: Teska Vaessen
   Student number: 11046341
   This fileThis file creates an interactive world map. This map shows the population
   density. When you click on a country you can see the birth- and deathrate
   of that specific country in a barchart. This file also shows the world
   average birth- and deathrate so you can compare. */

window.onload = function() {

    var requests = [d3v5.json("data.json")];

    Promise.all(requests).then(function(response) {
        var dataset = response[0];

        // Make variable list for the birthrate and deathrate
        var deathrate = [];
        var birthrate = [];
        for (country in dataset){;
            deathrate.push(dataset[country]["Deathrate"]);
            birthrate.push(dataset[country]["Birthrate"]);
        }
        // Calculate maximums for the domain
        var maxDeathrate = Math.max.apply(null, deathrate);
        var maxBirthrate = Math.max.apply(null, birthrate);

        // Define variables for SVG of the barchart and create SVG
        var svg = {width: 525, height: 250, barPadding: 10};
        var margin = {top: 20, right: 125, bottom: 20, left: 250};
        var svg_barchart = d3v5.select("#bars")
                               .append("svg")
                               .attr("width", svg.width)
                               .attr("height", svg.height);

        // Create seperate svg for the barchart of the world average
        var svg_average = d3v5.select("#bars")
                               .append("svg")
                               .attr("width", svg.width)
                               .attr("height", svg.height);

        // Set default barchart (Netherlands) and create world average barchart
        barchart(dataset['NLD'], maxBirthrate, svg, margin, svg_barchart);
        barchart(dataset['WLD'], maxBirthrate, svg, margin, svg_average);

        // Draw the worldmap with population density variable in colors
        worldmap(dataset, maxBirthrate, svg, margin, svg_barchart);

    }).catch(function(e){
        throw(e);
    });

    function worldmap(dataset, maxBirthrate, svg, margin, svg_barchart) {

        // Set colorscale for the world map (threshold domain based on the data)
        var colorScale = d3v5.scaleThreshold()
                             .domain([10, 50, 100, 300, 500, 1000])
                             .range(['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#225ea8','#0c2c84', '#081d58']);

        // Add color to country in dataset
        for (country in dataset){
            dataset[country]["fillColor"] = colorScale(dataset[country]['PopulationDensity']);
        }

        // Create world map
        var map = new Datamap({element: document.getElementById("container"),
            data: dataset,
            fills: {
                defaultFill: "#808080"
            },
            geographyConfig: {
            popupTemplate: function(geo, dataset) {
                return ['<div class="hoverinfo"><strong>',
                        'Population density in ' + geo.properties.name,
                        ': ' + dataset['PopulationDensity'],
                        '</strong></div>'].join('');
                    }
                },
            done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    country = geography.id;
                    if (dataset[country] == undefined) {
                        alert("This country has no data available. Click on another country.");
                    }
                    else {
                        // Remove old barchart and vreate new barchart of selected country
                        removeBarchart(svg_barchart);
                        barchart(dataset[country], maxBirthrate, svg, margin, svg_barchart);
                    }
                });
            }
        });

        // Add legend of the world map
        addLegend(colorScale);

        // Add title to world map
        var container = d3v5.select("#container")
 		var title = container.select(".datamap")
                             .append("text")
                 		 	 .attr("transform", "translate(470,12)")
                 		  	 .style("text-anchor", "left")
                 		 	 .style("font-weight", "bold")
                 			 .style("font-size", "12pt")
                 			 .text("Population density per country in the world");

    }
    function addLegend(colorScale){

        // Based the legend code on https://bl.ocks.org/mbostock/4573883
        // from Mike Bostock’s Block 4573883
        var x = d3v5.scaleLinear()
                    .domain([0, 1100])
                    .range([585, 1085]);

        var xAxis = d3v5.axisBottom(x, 440)
                        .tickSize(13)
                        .tickValues(colorScale.domain());

        var g = d3v5.select("g").call(xAxis);

        g.select(".domain")
         .remove();

        g.selectAll("rect")
         .data(colorScale.range().map(function(color) {
             var d = colorScale.invertExtent(color);
             if (d[0] == undefined) {
                 d[0] = x.domain()[0];
             }
             if (d[1] == undefined) {
                 d[1] = x.domain()[1];
             }
             return d;
           }))
           .enter().insert("rect", ".tick")
           .attr("height", 10)
           .attr("y", 440)
           .attr("x", function(d) { return x(d[0]); })
           .attr("width", function(d) { return x(d[1]) - x(d[0]); })
           .attr("fill", function(d) { return colorScale(d[0]); });

        // Add ticks at right position
        g.selectAll(".tick")
         .data(colorScale.range().map(function(color) {
             var d = colorScale.invertExtent(color);
             if (d[0] == undefined) {
                 d[0] = x.domain()[0];
             }
             if (d[1] == undefined) {
                 d[1] = x.domain()[1];
             }
             return d;
           }))
           .attr("transform", function translate(d) {
               return "translate(" + x(d[1]) + ","+ 440 + ")";
           });

        // Add title of the legend
        g.append("text")
         .attr("fill", "#000")
         .attr("font-weight", "bold")
         .attr("text-anchor", "start")
         .attr("x", 585)
         .attr("y", 430)
         .text("Population density (per sq. mi.)");
    }

    function barchart(dataset, maxBirthrate, svg, margin, svg_barchart) {

        // Set variable for x values
        x_values = ['Birthrate', 'Deathrate'];

        // Define xScale
        var xScale = d3v5.scaleBand()
                         .domain(x_values.map(function(d) {return d; }))
                         .range([margin.left, svg.width - margin.right]);

        // Define yScale
        var yScale = d3v5.scaleLinear()
                         .domain([0, maxBirthrate])
                         .range([svg.height - margin.top, margin.bottom]);

        // Create tooltip
        var tip = d3v5.tip()
                      .attr('class', 'd3-tip')
                      .offset([-10, 0])
                      .html(function(d) {
                          return "<strong>Rate:</strong> <span style='color:teal'>" + dataset[d] + "</span>";
                      });

        svg_barchart.call(tip);

        // Create bars
        svg_barchart.selectAll("rect")
                    .data(x_values)
                    .enter()
                    .append("rect")
                    .attr("class", "rect")
                    .attr("x", function(d) {
                        return xScale(d) + svg.barPadding / 2 + "px";
                    })
                    .attr("y", function(d) {
                         return yScale(dataset[d]) - margin.bottom + margin.top + "px";
                     })
                    .attr("height", function(d) {
                         return svg.height - margin.top - yScale(dataset[d]) + "px";
                     })
                    .attr("width", (svg.width - margin.left - margin.right) / 2 - svg.barPadding + "px")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

        // Create axes of the barchart
        createAxes(dataset, svg, margin, svg_barchart, xScale, yScale);

    }

    function createAxes(dataset, svg, margin, svg_barchart, xScale, yScale){

        // Create x axis
        var xAxis = d3v5.axisBottom(xScale);
        svg_barchart.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (svg.height - margin.bottom) + ")")
                    .call(xAxis);

       // Create y axis
       var yAxis = d3v5.axisLeft(yScale);
       svg_barchart.append("g")
                   .attr("class", "axis")
                   .attr("transform", "translate(" + margin.left + ", " + -(margin.bottom - margin.top)  + ")")
                   .call(yAxis);

       // Add y label
       svg_barchart.append('text')
                   .attr('class', 'title')
                   .attr("font-size", "13px")
                   .attr("transform", "rotate(-90)")
                   .attr('x', - (svg.height - margin.bottom) / 2)
                   .attr('y', 225)
                   .attr('text-anchor', 'middle')
                   .text('Rate (per 1000 individuals)');

      // Add title
      svg_barchart.append('text')
                  .attr('class', 'title')
                  .attr("font-size", "15px")
                  .attr("font-weight", "bold")
                  .attr('x', (svg.width + margin.left - margin.right + 10) / 2)
                  .attr('y', 11)
                  .attr('text-anchor', 'middle')
                  .text("Rates " + dataset['Country']);
    }

    function removeBarchart(svg_barchart){

        // Remove old bars
        svg_barchart.selectAll("rect")
                    .remove();

        // Remove old axes
        svg_barchart.selectAll("g")
                    .remove();

        // Remove old title
        svg_barchart.selectAll("text.title")
           .remove();
    }

};
