$(function() {
    // Idea.
    // From the main data, split the data to two parts; 1) All the data with pos 0 and 2) All the data with pos != 0 AND SORT
    // Then create a new array with size 42, arrange the data just like the rack.

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
    var reverseL = 43;
    var height = 0;
    var div;
    var running = 1;
    var hosts = jsonData.hosts;
    var dummy = {"name": "", size: 1};

    zeroPosHosts = [];
    nonZeroPosHosts = [];
    wholeHosts = [];

    $.each(hosts, function(index, host) {
        host.pos = parseInt(host.pos);
        if(host.pos === 0) {
            zeroPosHosts.push(host);
        } else if( host.pos > 0 ) {
            nonZeroPosHosts.push(host);
        }
    });

    nonZeroPosHosts.sort(function(a, b) {
        return a.pos - b.pos;
    });

    hosts.sort(function(a, b) {
        return a.pos - b.pos;
    });

    var i = 1;
    var dummyData = {"name":"","size":1,"bucket":"","ip":"","events":"","submenu":"","pos": null};
    
    while(i <= 42) {
        if(nonZeroPosHosts[0]) {
            if(nonZeroPosHosts[0].pos === i) {
                wholeHosts[i - 1] = $.extend({}, nonZeroPosHosts[0]);
                i = i + 1;
                nonZeroPosHosts.shift();
                continue;
            }
        } 

        if(zeroPosHosts[0]) {
            wholeHosts[i - 1] = $.extend({}, zeroPosHosts[0]);
            i = i + zeroPosHosts[0].size;
            zeroPosHosts.shift();
            continue;
        }

        // 

        wholeHosts[i - 1] = dummyData;

        i = i + 1;
    }

    console.log("All data", wholeHosts);
    //wholeHosts.shift();
    //wholeHosts.reverse();
    $.each(wholeHosts, function(index, value) {
        if(value) {

        
        var hString = "";

        for(var i = 0; i < value.size; i++) {
            if((i + 1) === value.size) {
                hString = "<div class='individual-server-first-child' style='border-bottom:none'>" + (running) + "</div>" + hString;
            } else {
                hString = "<div class='individual-server-first-child'>" + (running) + "</div>" + hString;
            }
            
            running = running + 1; 
        }

        div =
        $(".rack_body")
        .prepend(
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
    }
        console.log(value, index);
                    
    });

    /*if( jsonData.hosts.length < maxLength) {
        
        var begin = jsonData.hosts.length;
        while(running <= maxLength) {

            div =
            $(".rack_body")
            .append(
                $( "<div>" + 
                        "<div class='individual-server-first'>" + (reverseL - running) + "</div>" +
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
    }*/

});