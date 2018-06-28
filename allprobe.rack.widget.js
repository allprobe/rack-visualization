$(function() {

    $.widget("allprobe.rack", {

        options: {

        },

        _create: function() {
            
            this.element.append(
                '<div class="rack_container">' +
                    '<div class="data_rectangle"></div>' +
                    '<div class="sub_menu_rectangle"></div>' +
                    '<div class="rack_top">' +
                        '<div class="rack_top_corner_rect"></div>' +
                        '<div class="rack_top_middle_rect"><span class="title_place"></span></div>' +
                        '<div class="rack_top_corner_rect"></div>' +
                    '</div>' +

                    '<div class="rack_body">' +
                    '</div>' +

                    '<div class="rack_bottom_section">' +
                        '<div class="rack_top">' +
                            '<div class="rack_top_corner_rect"></div>' +
                            '<div class="rack_top_middle_rect"></div>' +
                            '<div class="rack_top_corner_rect"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            this.rackBodyPos = this.element.find('.rack_container').offset();
            
            this.element.find('.sub_menu_rectangle').mouseleave(function() {
                $(this).hide();
            });

            if(this.options.data) {
                this.getJson(this.options.data);
            }
            
            if(this.options.title) {
                this.element.find('.title_place').text(this.options.title);
            }
            
        },

        getJson: function(data) {
            
            console.log("Hola", data);
            this.jsonData = data;    
            this.initialize();
            this.divideData();
            this.sortData();
            this.combineDividedArrays();
            this.render();
                   
        },

        initialize: function () {
            this.hosts = this.jsonData.hosts;
            this.hostsNo = parseInt(this.jsonData.size);
            this.zeroPosHosts = [];
            this.nonZeroPosHosts = [];
            this.jsonData =  null;
            this.unitHeight = 14;
            // We have 3 values to take care when we choose height of U
            // Now: if its a U with a server its 16px tall;
            // If a U doesn't have a server its 14 px [unit height]
            // individual server first has (unitHeight - 1)px height [difference of 1 accounted for 1px border]
            
            this.maxLength = 42;
            this.reverseL = 43;
            this.height = 0;
            this.div = null;
            this.running = 1;
            this.dummy = {"name": "", size: 1};
            this.wholeHosts = [];
            this.indexArray = [];
        },
        
        divideData: function() {
            
            var that = this;
            $.each(this.hosts, function(index, host) {
                
                host.pos = parseInt(host.pos);
                
                if(host.pos === 0) {
                    that.zeroPosHosts.push(host);
                } else if( host.pos > 0 ) {
                    that.nonZeroPosHosts.push(host);
                }
            });    
        },

        sortData: function() {

            this.nonZeroPosHosts.sort(function(a, b) {
                return a.pos - b.pos;
            });
        
            this.hosts.sort(function(a, b) {
                return a.pos - b.pos;
            });
        },

        combineDividedArrays: function() {

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
            
            while(i <= this.hostsNo) {
                if(this.nonZeroPosHosts[0]) {
                    if(this.nonZeroPosHosts[0].pos === i) {
                        this.wholeHosts[i - 1] = $.extend({}, this.nonZeroPosHosts[0]);
                        i = i + this.nonZeroPosHosts[0].size;
                        this.nonZeroPosHosts.shift();
                        continue;
                    }
                } 

                if(this.zeroPosHosts[0]) {
                    this.wholeHosts[i - 1] = $.extend({}, this.zeroPosHosts[0]);
                    i = i + this.zeroPosHosts[0].size;
                    this.zeroPosHosts.shift();
                    continue;
                }

                this.wholeHosts[i - 1] = dummyData;
                i = i + 1;
            }
        },

        render: function() {

            var that = this;
            var height = 0;

            $.each(that.wholeHosts, function(index, value) {
                console.log(index);
                if(value) {
        
                    var hString = "";
        
                    for(var i = 0; i < value.size; i++) {
                        var colorText = "";
                        if(! value.dummy) {
                            if(value.events === "") {
                                colorText = "background-color: green; color:#ffffff";
                            } else if(value.events.length > 0) {
                                colorText = "background-color: red";
                            }
                        }
                        if(i === 0 ) {
                            if(value.size === 1 && value.dummy !== true) {
                                that.indexArray[i] = "<div class='individual-server-first-child' style='border-bottom:none;height:" + (that.unitHeight + 1)+"px;" + colorText + "'><span class='rack_no'>" + ( that.running ) + "</span></div>";
                            } else {
                                that.indexArray[i] = "<div class='individual-server-first-child' style='height:" + (that.unitHeight - 1)+"px;border-bottom:none;" + colorText + "'><span class='rack_no'>" + ( that.running ) + "</span></div>";
                            }
                        } else {
                            that.indexArray[i] = "<div class='individual-server-first-child' style='"+ colorText +"'>" + ( that.running ) + "</div>";
                        }
                        
                        that.running = that.running + 1; 
                    }
        
                    hString = that.indexArray.reverse().join('');
                    that.indexArray.length = 0;
                    
                    height = that.unitHeight;
                    if(value.size === 1 && value.dummy !== true) {
                        height = that.unitHeight + 2;
                    }
                    that.div = $( "<div>" + 
                                "<div class='individual-server-first'>" + hString + "</div>" +
                                "<div class='individual-server-second'>" + 
                                    "<span style='cursor: pointer;'>"+ value.name + "</span>" + 
                                "</div>" +
                                "<div class='individual-server-third'></div>" + 
                                "</div>" 
                            )
                            .addClass("individual-server")
                            .attr("index", index)
                            .css("height", (value.size * height) + "px");
        
                    that.element.find(".rack_body")
                        .prepend(that.div);
                    
                    
                    if(! value.dummy) {
                        
                        $(that.div).data("myJson", value);

                        that.implementClick(that.div);
                        that.implementMouseMove(that.div);
                        that.implementMouseOut(that.div);
                        
                    }
                }                    
            });
        
        },

        implementMouseOut: function(div) {
            var that = this;
            $(div).mouseout(function() {
                that.element.find('.data_rectangle').hide();
            });
        },

        implementMouseMove: function(div) {

            var that = this;
            $(div).mousemove(function(event) {
                var jsonContent = $(this).data('myJson');
                var divPos = $(this).position();
                var newPos = { top: event.pageY - that.rackBodyPos.top , 
                    left: event.pageX - that.rackBodyPos.left + 10 };
                that.element.find('.data_rectangle').text(jsonContent.ip)
                    .css(newPos)
                    .show();
                
            });
        },

        implementClick: function(div) {

            var that = this;
            $(div).click(function(event) {
                that.element.find('.data_rectangle').hide();
                var jsonContent = $(this).data('myJson');
                console.log($(this).data('myJson'), event.pageX, event.pageY);
                var newPos = { top: event.pageY - that.rackBodyPos.top - 10, 
                    left: event.pageX - that.rackBodyPos.left - 10 };
                that.element.find('.sub_menu_rectangle').html(jsonContent.submenu)
                    .css(newPos)
                    .show();
            });
        }

    });
    // End
});