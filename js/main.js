$(function() {
    
    var jsonData = 
    {
        "name":"M-02 \/ 1x",
        "size":"42",
        "hosts":[
            {"name":"SRV18","size":1,"bucket":"Virtual Platforms Grid-1","ip":"62.90.132.135","events":"","submenu":"ONCLICK SUBMENU CONTENT","pos":"20"},
            {"name":"SRV20","size":3,"bucket":"Virtual Platforms Grid-1","ip":"62.90.132.151","events":"","submenu":"ONCLICK SUBMENU CONTENT","pos":"0"},
            {"name":"SRV27","size":1,"bucket":"Virtual Platforms Grid-1","ip":"62.90.132.23","events":"","submenu":"ONCLICK SUBMENU CONTENT","pos":"14"},
            {"name":"SRV28","size":1,"bucket":"Virtual Platforms Grid-1","ip":"62.90.132.10","events":"","submenu":"ONCLICK SUBMENU CONTENT","pos":"10"},
            {"name":"SRV23","size":1,"bucket":"Virtual Platforms Grid-1","ip":"62.90.132.174","events":"","submenu":"ONCLICK SUBMENU CONTENT","pos":"1"},
            {"name":"SRV29","size":1,"bucket":"Virtual Platforms Grid-1","ip":"62.90.132.140","events":"","submenu":"ONCLICK SUBMENU CONTENT","pos":"0"}
        ]
    };

    var unitHeight = 20;
    var maxLength = 42;
    var height = 0;
    var div;
    var running = 1;
    var hosts = jsonData.hosts;
    var dummy = {"name": "", size: 1};

    $.each(hosts, function(index, host) {
        host.pos = parseInt(host.pos);
    });

    hosts.sort(function(a, b) {
        return a.pos - b.pos;
    });

    var i = 1;

    while(i <= 42) {

        
    }

    console.log("All data", hosts);


    $.each(hosts, function(index, value) {
        
        var hString = "";

        for(var i = 0; i < value.size; i++) {
            if((i + 1) === value.size) {
                hString = hString + "<div class='individual-server-first-child' style='border-bottom:none'>" + running + "</div>";
            } else {
                hString = hString + "<div class='individual-server-first-child'>" + running + "</div>";
            }
            
            running = running + 1; 
        }

        div =
        $(".rack_body")
        .append(
            $( "<div>" + 
                    "<div class='individual-server-first'>" + hString + "</div>" +
                    "<div class='individual-server-second'>" + 
                        "<span>"+ value.name + "</span>" + 
                    "</div>" +
                    "<div class='individual-server-third'></div>" + 
                "</div>" 
            )
            .addClass("individual-server")
            .attr("index", index)
            .css("height", (value.size * unitHeight) + "px")
        );

        console.log(value, index);
                    
    });

    if( jsonData.hosts.length < maxLength) {
        var begin = jsonData.hosts.length;
        while(running <= maxLength) {

            div =
            $(".rack_body")
            .append(
                $( "<div>" + 
                        "<div class='individual-server-first'>" + running + "</div>" +
                        "<div class='individual-server-second'>" + 
                            "<span>" + "</span>" + 
                        "</div>" +
                        "<div class='individual-server-third'></div>" + 
                    "</div>" 
                )
                .addClass("individual-server")
                .attr("index", begin)
                .css("height", (unitHeight) + "px")
            );
            running = running + 1;
        }
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