/* Name: Teska Vaessen
   Student number: 11046341
   This file .......... */

window.onload = function() {

    var requests = [d3v5.json("data.json")];

    // d3.json("data.json").then(function(d){
    //     console.log(d);
    // })

    Promise.all(requests).then(function(response) {
        var dataset = response[0];
        console.log(dataset);

        // Make variable list for the birthrate and deathrate
        var deathrate = [];
        var birthrate = [];
        for (country in dataset){;
            deathrate.push(dataset[country]["Deathrate"]);
            birthrate.push(dataset[country]["Birthrate"]);
        }
        var maxDeathrate = Math.max.apply(null, deathrate);
        var maxBirthrate = Math.max.apply(null, birthrate);

        // dataset["USA"]["fillColor"] = "#FF6500"
        // Draw the worldmap with population variable in colors
        worldmap(dataset, maxBirthrate);

        // Make bar chart
        // barchart(dataset);


    }).catch(function(e){
        throw(e);
    });

    function worldmap(dataset, maxBirthrate) {
        // Add bar chart of the world average
        barchart(dataset["WLD"], maxBirthrate);

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
                    console.log(dataset[country]);
                    if (dataset[country] == undefined) {
                        alert("This country has no data available. Click on another country.");
                    }
                    else {
                        // Create barchart of this country
                        updateBarchart();
                        // svg_barchart.selectAll("*").remove();
                        barchart(dataset[country], maxBirthrate);
                        // alert(geography.properties.name);
                    }
                });
            }
        });

    }

    function barchart(dataset, maxBirthrate) {
        // Define variables for SVG of the barchart and create SVG
        var svgWidth = 300;
        var svgHeight = 250;
        var barPadding = 10;
        var margin = {top: 20, right: 75, bottom: 20, left: 75};
        var svg_barchart = d3v5.select("body")
                               .append("svg")
                               .attr("width", svgWidth)
                               .attr("height", svgHeight);

        // Set variable for x values
        x_values = ['Birthrate', 'Deathrate']

        // Define xScale
        var xScale = d3v5.scaleBand()
                         .domain(x_values.map(function(d) {return d; }))
                         .range([margin.left, svgWidth - margin.right]);

        // Define yScale
        var yScale = d3v5.scaleLinear()
                         .domain([0, maxBirthrate])
                         .range([svgHeight - margin.top, margin.bottom]);

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
                        return xScale(d) + barPadding / 2 + "px";
                    })
                    .attr("y", function(d) {
                         return yScale(dataset[d]) - margin.bottom + margin.top + "px";
                     })
                    .attr("height", function(d) {
                         return svgHeight - margin.top - yScale(dataset[d]) + "px";
                     })
                    .attr("width", (svgWidth - margin.left - margin.right) / 2 - barPadding + "px")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

        // Create axes of the barchart
        // Create x axis
        var xAxis = d3v5.axisBottom(xScale);

        svg_barchart.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (svgHeight - margin.bottom) + ")")
                    .call(xAxis);

       // Create y axis
       var yAxis = d3v5.axisLeft(yScale);

       svg_barchart.append("g")
                   .attr("class", "axis")
                   .attr("transform", "translate(" + margin.left + ", " + -(margin.bottom - margin.top)  + ")")
                   .call(yAxis);

      // VRAGEN TIM OM ASSEN MOETEN WANT IS LELIJKER
      // // Add x label
      // svg_barchart.append('text')
      //             .attr('class', 'title')
      //             .attr("font-weight", "bold")
      //             .attr('x', (svgWidth + margin.left) / 2)
      //             .attr('y', svgHeight)
      //             .attr('text-anchor', 'middle')
      //             .text('Rate');
      //
      // // Add y label
      // svg_barchart.append('text')
      //             .attr('class', 'title')
      //             .attr("font-weight", "bold")
      //             .attr("transform", "rotate(-90)")
      //             .attr('x', - (svgHeight - margin.bottom) / 2)
      //             .attr('y', 25)
      //             .attr('text-anchor', 'middle')
      //             .text('Value');

      // Add title
      svg_barchart.append('text')
                  .attr('class', 'title')
                  .attr("font-size", "15px")
                  .attr("font-weight", "bold")
                  .attr('x', (svgWidth + margin.left - margin.right + 10) / 2)
                  .attr('y', 11)
                  .attr('text-anchor', 'middle')
                  .text(dataset['Country']);
    }

    function updateBarchart(){
    }

};
