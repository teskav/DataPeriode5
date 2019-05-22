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

        // dataset["USA"]["fillColor"] = "#FF6500"

        var population = [];
        for (country in dataset){;
            population.push(dataset[country]["PopulationDensity"]);
        }
        var minPopulation = Math.min.apply(null, population);
        var maxPopulation = Math.max.apply(null, population);
        var meanPopulation = d3v5.mean(population, function(d) { return d; });

        console.log(population.sort(function(a, b){return a-b}))
        // console.log(minPopulation);
        // console.log(maxPopulation);
        // console.log(meanPopulation);

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
            geographyConfig: {
            popupTemplate: function(geo, dataset) {
                return ['<div class="hoverinfo"><strong>',
                        'Population density in ' + geo.properties.name,
                        ': ' + dataset['PopulationDensity'],
                        '</strong></div>'].join('');
                    }
                }
        });


    }).catch(function(e){
        throw(e);
    });

};
