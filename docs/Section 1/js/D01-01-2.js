function show() {

    'use strict';

    var margin = {top: 20, bottom: 20, right: 20, left: 20},
        width = 1100 - margin.left - margin.right,
        height = 750 - margin.top - margin.bottom;

    var CHAR_SIZE = 25;
    var LOC_SIZE = 5;

    var svg = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(function(d) {
            return d.type === "location" ? -40 : -40;
        }))
        .force("collide", d3.forceCollide(function(d) {return d.type === 'character' ? 50 : 50; }).iterations(16))
        .force("y", d3.forceY(height/2).strength(0.2))
        .force("x", d3.forceX(height/2).strength(0))
        .force("center", d3.forceCenter(width / 2, height / 2))

    d3.xml("data/simpsons_logo.svg").mimeType("image/svg+xml").get(function(error, xml) {
        var logoAndText = svg.append("g")
            .attr("class", "title")
        logoAndText.node().appendChild(xml.documentElement);
        logoAndText.select("svg g").attr("transform", "translate(-55 -140) scale(0.4)")

        logoAndText.append("text").text("Characters & Locations")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width/2) + ", 50)")
    });


    d3.json("./data/graph.json", function(error, graph) {

        graph.nodes = graph.characters.concat(graph.locations);

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll(".links")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "links");

        var link2 = svg.append("g")
            .attr("class", "links2")
            .selectAll(".links2")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "links2");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")


        node.append("circle")
            .attr("r", function(d) { return d.type === 'character' ? CHAR_SIZE : LOC_SIZE; })
            .attr("class", function(d) {return d.type})
            .attr("stroke", "black");


        simulation.nodes(graph.nodes).on("tick", ticked);
        simulation.force("link").links(graph.links);

        function ticked() {
            link.attr("d", linkArc)
            link2.attr("d", linkArc)
            node.attr("transform", function(d) {return "translate("+ d.x +" " + d.y + ")"})
        }

         function linkArc(d) {
             var cX = (d.source.x + d.target.x) / 2;
             var cY = d.target.y;
             return "M" + d.source.x + "," + d.source.y + "Q" + cX + "," + cY  + "," + d.target.x + "," + d.target.y;
         }


        function setupGUI() {
            var gui = new dat.GUI();
            gui.add(config, 'collideCharacters', 0, 200);
            gui.add(config, 'collideLocations', 0, 200);
            gui.add(config, 'chargeCharacters', -500, 500, 20);
            gui.add(config, 'chargeLocations', -500, 500, 20);
            gui.add(config, 'forceX', 0, 2, 0.01);
            gui.add(config, 'forceY', 0, 2, 0.01);

            gui.add(config, 'simulate');
        }
    });
}
