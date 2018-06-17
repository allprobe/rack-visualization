$(function() {
    // Idea.
    // From the main data, split the data to two parts; 1) All the data with pos 0 and 2) All the data with pos != 0 AND SORT
    // Then create a new array with size 42, arrange the data just like the rack.
    var jsonData;
    var unitHeight = 14;
    var maxLength = 42;
    var reverseL = 43;
    var height = 0;
    var div;
    var running = 1;
    var hosts;
    var dummy = {"name": "", size: 1};
    var rackBodyPos = $('.rack_container').position();
    
    zeroPosHosts = [];
    nonZeroPosHosts = [];
    wholeHosts = [];
    indexArray = [];

    $.get('data.json', function(data) {
        console.log("Hola", data);
        jsonData = data;    
        initialize();
        divideData();
        sortData();
        combineDividedArrays();
        render();
    });
 
    $('.sub_menu_rectangle').mouseout(function() {
        $(this).hide();
    });

    initialize = function () {
        hosts = jsonData.hosts;
    };
    
    divideData = function() {

        $.each(hosts, function(index, host) {
            host.pos = parseInt(host.pos);
            if(host.pos === 0) {
                zeroPosHosts.push(host);
            } else if( host.pos > 0 ) {
                nonZeroPosHosts.push(host);
            }
        });    
    };
    
    sortData = function() {
        nonZeroPosHosts.sort(function(a, b) {
            return a.pos - b.pos;
        });
    
        hosts.sort(function(a, b) {
            return a.pos - b.pos;
        });
    };
    
    combineDividedArrays = function() {
        var i = 1;
        var dummyData = {
            "name":"",
            'dummy': true, 
            "size":1,
            "bucket":"",
            "ip":"",
            "events":"",
            "submenu":"",
            "pos": null
        };
        
        while(i <= 42) {
            if(nonZeroPosHosts[0]) {
                if(nonZeroPosHosts[0].pos === i) {
                    wholeHosts[i - 1] = $.extend({}, nonZeroPosHosts[0]);
                    i = i + nonZeroPosHosts[0].size;
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

            wholeHosts[i - 1] = dummyData;
            i = i + 1;
        }
    };

    render = function() {

        $.each(wholeHosts, function(index, value) {
        
            if(value) {
    
                var hString = "";
    
                for(var i = 0; i < value.size; i++) {
                    var colorText = "";
                    if(! value.dummy) {
                        if(value.events === "") {
                            colorText = "background-color: green";
                        } else if(value.events.length > 0) {
                            colorText = "background-color: red";
                        }
                    }
                    if(i === 0 ) {
                        indexArray[i] = "<div class='individual-server-first-child' style='border-bottom:none;" + colorText + "'>" + ( running ) + "</div>";
                    } else {
                        indexArray[i] = "<div class='individual-server-first-child' style='"+ colorText +"'>" + ( running ) + "</div>";
                    }
                    
                    running = running + 1; 
                }
    
                hString = indexArray.reverse().join('');
                indexArray.length = 0;
                
                div = $( "<div>" + 
                            "<div class='individual-server-first'>" + hString + "</div>" +
                            "<div class='individual-server-second'>" + 
                                "<span style='cursor: pointer;'>"+ value.name + "</span>" + 
                            "</div>" +
                            "<div class='individual-server-third'></div>" + 
                            "</div>" 
                        )
                        .addClass("individual-server")
                        .attr("index", index)
                        .css("height", (value.size * unitHeight) + "px");
    
                $(".rack_body")
                    .prepend(div);
                
                
                if(! value.dummy) {
                    
                    $(div).data("myJson", value);

                    implementClick(div);
                    implementMouseMove(div);
                    implementMouseOut(div);
                    
                }
            }                    
        });
    
    };

    implementMouseOut = function(div) {
        $(div).mouseout(function() {
            $('.data_rectangle').hide();
        });
    };

    implementMouseMove = function(div) {
        $(div).mousemove(function(event) {
            var jsonContent = $(this).data('myJson');
            var divPos = $(this).position();
            var newPos = { top: event.pageY, left: event.pageX + 10 };
            $('.data_rectangle').text(jsonContent.ip)
                .css(newPos)
                .show();
            
        });
    };

    implementClick = function(div) {
        $(div).click(function(event) {
            $('.data_rectangle').hide();
            var jsonContent = $(this).data('myJson');
            console.log($(this).data('myJson'), event.pageX, event.pageY);
            var newPos = { top: event.pageY - 10, left: event.pageX - 10 };
            $('.sub_menu_rectangle').html(jsonContent.submenu)
                .css(newPos)
                .show();
        });
    };
    
});