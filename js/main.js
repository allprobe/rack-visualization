$(function() {
    
    var jsonData = {
        rack_size: 40,
        hosts: [
            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 1,
            },
            {
                ip: '10.02.102',
                name: "cdn.allprobe",
                type: "cdn",
                status: "okay",
                u: 1
            },
            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 3
            },

            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 4
            },

            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 5
            },

            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 5
            },

            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 5
            },
            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 5
            },
            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 3
            },
            {
                ip: '10.02.100',
                name: "allprobe",
                type: "san",
                status: "okay",
                u: 3
            },
            
        ]
    };
     var height = 0;
    $.each(jsonData.hosts, function(index, value) {
        
        console.log(value);
        var div =
        $(".rack-container-div").append(
            $("<div></div>").addClass("individual-server")
            .css("height", (value.u * 13) + "px").append(
                $("<div></div>").addClass("switch")
                
            )
        );

        height = height + (value.u * 13);
                    
    });

    var times = Math.round((height - 60) / 13);
    height = height + jsonData.hosts.length;

    $(".rack_body").css("height", height + "px");

    
    console.log(times);
    var single_rack = $(".single_rack").clone();
    for(var i = 0; i < times; i++) {
        $('.rack_body').append(single_rack);
        single_rack = single_rack.clone();
        console.log(i);
    }

});


/*$(function() {
    
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
                servers: [
                    {
                        "name": "Jo"
                    },
                    {
                        "name": "Dan"
                    }
                ]
            },
            {
                rows: 4,
                columns: 2,
                x: 200,
                y: 100,
                servers: [
                    {
                        "name": "Jo"
                    },
                    {
                        "name": "Dan"
                    }
                ]
            },
            {
                rows: 5,
                columns: 2,
                x: 300,
                y: 100,
                servers: [
                    {
                        "name": "Jo"
                    },
                    {
                        "name": "Dan"
                    }
                ]
            },
            {
                rows: 7,
                columns: 1,
                x: 400,
                y: 100,
                servers: [
                    {
                        "name": "Jo"
                    },
                    {
                        "name": "Dan"
                    }
                ]
            }
        ]
    };

    var racks = svgContainer.selectAll("g")
                    .data(rackData.racks, function(rack) {
                        //console.log(rack);
                    })
                    .enter();

    var outer_rects = racks
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
                    .attr("fill", "green")
                    .attr("rx", 8)
                    .attr("ry", 8);

                

        outer_rects.each(function(d, i) {
            console.log("ww", d, i);
            var tempParent = d;
            d3.selectAll("circle")
            .data(d.servers)
            .enter()
            .append("circle")
            
            .attr("r", function(d) {
                return 100;
            })
            .attr("cx", 200)
            .attr("cy", 300);
            
        });            

        racks.exit().remove();

});

/*
try to make a g with rectangle and add a classname to it.
then select them use each to traverse the inner array
create rectangles according to data

var data = [
    { name: '1', data: [1,2,3] },
    { name: '2', data: [1,2,3] }
]

var colourScale = ['red','blue','yellow']
var svg = d3.select('body').append('svg').attr('width', 1000).attr('height', 1000);
svg.selectAll('rect')
    .data(data)
  .enter().append('g')
    .each(function(d,i){
        d3.select(this).selectAll('rect')
        .data(d.data)
      .enter().append('rect')
        .attr('x', function(d,j) { return j*100; })
        .attr('y', function() { return i*100; })
        .attr('width', function() { return 90; })
        .attr('height', function() { return 90; })
        .attr('fill', function(d,j) { console.log(d); return colourScale[j]; })
    });

    */