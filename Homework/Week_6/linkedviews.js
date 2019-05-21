/* Name: Teska Vaessen
   Student number: 11046341
   This file .......... */

window.onload = function() {

    var requests = [d3.json("data.json")];

    // d3.json("data.json").then(function(d){
    //     console.log(d);
    // })

    Promise.all(requests).then(function(response) {
        console.log(response);
        var dataset = response[0];
        console.log(dataset)

        var map = new Datamap({element: document.getElementById('container')});

        // var basic = new Datamap({
        //     element: document.getElementById("basic")
        // });


    }).catch(function(e){
        throw(e);
    });

};
