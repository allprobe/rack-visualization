$(function() {
    
    var svgContainer = d3.select(".rack_display")
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%");

    
    var rackData = {
        racks: [
            {
                rows: 2,
                columns: 1,
                x: 100,
                y: 100,
            },
            {
                rows: 4,
                columns: 2,
                x: 200,
                y: 100,
            },
            {
                rows: 5,
                columns: 2,
                x: 300,
                y: 100,
            },
            {
                rows: 7,
                columns: 1,
                x: 400,
                y: 100,
            }
        ]
    };

    var racks = svgContainer.selectAll("g")
                    .data(rackData.racks, function(rack) {
                        //console.log(rack);
                    });

        racks.enter()
                    .append("g")
                    .append("rect")
                    .attr("width", function(d) {
                        if(d.columns)
                            return d.columns * 40;
                        return 40;
                    })
                    .attr("height", function(d) {
                        if(d.rows)
                            return d.rows * 25;
                        return 25;
                    })
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y",function(d) {
                        return d.y;
                    })
                    .attr("rx", 8)
                    .attr("ry", 8);


        racks.exit().remove();

});