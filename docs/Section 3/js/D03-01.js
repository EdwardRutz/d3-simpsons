function show() {

    'use strict';
    var margin = {top: 20, bottom: 20, right: 20, left: 20},
        width = 1650 - margin.left - margin.right,
        height = 950 - margin.top - margin.bottom;

    var svg = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var nPoints = 1000
    var color = function() {return d3.interpolateOranges(Math.random())};

    var points = d3.range(nPoints).map(function(d) { return [Math.random() * width, Math.random() * height]; });
    var voronoi = d3.voronoi().extent([[0, 0], [width, height ]]);

    var polygons = voronoi.polygons(points);
    svg.append("g").selectAll("path").data(polygons).enter()
        .append("path")
        .attr("d", polyToPath)
        .attr("fill", color)

    svg.selectAll("circle").data(points).enter()
        .append("circle")
        .attr("cx", function(d) {return d[0]})
        .attr("cy", function(d) {return d[1]})
        .attr("r", 2)

    svg.append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height);

    function polyToPath(polygon) {
        return polygon ? "M" + polygon.join("L") + "Z" : null;
    }

}
