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

        console.log(dataset);
        // zo geef je dus een kleur mee aan de dataset dus dit nu met een
        // colorfunctie doen en meegeven aan de dataset
        // dataset["USA"]["fillColor"] = "#FF6500"
        // var hoi = d3v5.min(dataset, function(d) { return d['Population']; })

        var population = [];
        for (country in dataset){;
            population.push(dataset[country]["PopulationDensity"]);
        }
        var minPopulation = Math.min.apply(null, population);
        var maxPopulation = Math.max.apply(null, population);
        var meanPopulation = d3v5.mean(population, function(d) { return d; });
        console.log(minPopulation);
        console.log(maxPopulation);
        console.log(meanPopulation);
        var colorScale = d3v5.scaleQuantize()
                             .domain([0, 100])
                             //.domain([d3v5.min(dataset, function(d) { return d['Population']; }), d3v5.max(dataset, function(d) { return d['Population']; })])
                             .range(['#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']);

        for (country in dataset){
            // console.log(country);
            // console.log(dataset[country]['Population'])
            dataset[country]["fillColor"] = colorScale(dataset[country]['PopulationDensity']);
        }

        var map = new Datamap({element: document.getElementById("container"),
            data: dataset
        });

        // var basic = new Datamap({
        //     element: document.getElementById("basic")
        // });


    }).catch(function(e){
        throw(e);
    });

};
