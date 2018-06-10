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
    var reverseL = 43;
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

    /*while(i <= 42) {

        
    }*/

    console.log("All data", hosts);


    $.each(hosts, function(index, value) {
        
        var hString = "";

        for(var i = 0; i < value.size; i++) {
            if((i + 1) === value.size) {
                hString = hString + "<div class='individual-server-first-child' style='border-bottom:none'>" + (reverseL - running) + "</div>";
            } else {
                hString = hString + "<div class='individual-server-first-child'>" + (reverseL - running) + "</div>";
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
    }

});