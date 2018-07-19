$(function () {

    $.widget('allprobe.hostDisk', {

        options: {

        },

        _create: function() {

            this.initialize();
            this.firstStep();
        },

        initialize: function() {
            
            this.currentStep = 1;
            this.data = {
                noOfFrontRows: null,
                noOfBackRows: null,
                front: null,
                back: null,
                currentlySelectedRowIndex: null,
                currentlySelectedRowReference: null
            };

            console.log("Okay");
        },

        firstStep: function() {

            this.currentStep = 1;

            this.firstStepHtml = '<div class="first-step-container step">' +
                            '<div class="row">' +
                                '<div class="col-lg-12 title"><h3>Host disk front/back configuration</h3></div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col fields">' +
                                '<fieldset>' +
                                    '<label>No of Rows at front</label><input type="number" max="12" id="frontRowValue">' +
                                    '<label>No of Rows at back</label><input type="number" max="12" id="backRowValue">' +
                                '</fieldset>' +
                                '</div>' +
                                '<div class="col">' +
                                    '<div class="row">' +
                                        '<div class="front-and-back">' +
                                            '<div class="graphics-container-front"></div>' +
                                        '</div>' +
                                        '<div class="front-and-back">' + 
                                            '<div class="graphics-container-back"></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col-md-12">' +
                                    '<button id="firstStepNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

            this.element.html(this.firstStepHtml);

            this.element.find('#firstStepNext').click(this.firstStepNextHandler.bind(this));
            this.element.find('#frontRowValue').keyup(this.dynamicRows.bind(this));
            this.element.find('#backRowValue').keyup(this.dynamicRows.bind(this));

            if( this.data !== null) {
                var event;
                if(this.data.noOfFrontRows !== null) {
                    event = {
                        target: {
                            id: "frontRowValue",
                            value: this.data.noOfFrontRows
                        }
                    };
                    $('#frontRowValue').val(this.data.noOfFrontRows);
                    this.dynamicRows(event, "front");
                }

                if(this.data.noOfBackRows !== null) {
                    event = {
                        target: {
                            id: "backRowValue",
                            value: this.data.noOfBackRows
                        }
                    };
                    $('#backRowValue').val(this.data.noOfBackRows);
                    this.dynamicRows(event, "back");
                }
                
            }
        },

        dynamicRows: function(event, face) {
            
            var value = parseInt(event.target.value);
            var html = this.generateRowHtml(event, face);

            if( event.target.id === "frontRowValue") {
                
                this.data.noOfFrontRows = value;
                
                html = 'Front: <div class="disk-container">' + html + '</div>';
                if(value === 0 || isNaN(value)) {
                    $('.graphics-container-front').html("");
                    return;
                }
                $('.graphics-container-front').html(html);
            } 
            
            if( event.target.id === "backRowValue") {
                
                this.data.noOfBackRows = value;

                html = 'Back: <div class="disk-container">' + html + '</div>';
                if(value === 0 || isNaN(value)) {
                    $('.graphics-container-back').html("");
                    return;
                }
                $('.graphics-container-back').html(html);
            }     
            
        },

        generateRowHtml: function(event, face) {
            
            var value = parseInt(event.target.value);
            if(value === 0) {
                return "";
            }

            var length = value - 1;
            var html = '<div class="disk" index="0" face="'+ face +'"></div>';

            for(var i = 1; i <= length; i ++) {
                html = html + '<div class="disk" index="'+ i +'" face="'+ face +'"></div>';
            }

            return html;
        },

        firstStepNextHandler: function(event) {
            
            this.data.front = Array(this.data.noOfFrontRows - 1);
            this.data.back = Array(this.data.noOfBackRows - 1);

            console.log("Heyy");
            this.secondStep();
        },

        secondStep: function() {

            this.currentStep = 2;
            this.secondStepHtml = '<div class="second-step-container step">' + 
                            '<div class="row">' +
                                '<div class="col-lg-12 title"><h3>Disks configuration</h3></div>' +
                            '</div>' +
                                '<div class="row">' +
                                    '<div class="col fields">' +

                                        '<div class="dropdown-menu">' +
                                            '<a class="dropdown-item" href="#">Add Disk</a>' +
                                            '<a class="dropdown-item" href="#">Delete Row</a>' +
                                        '</div>' +

                                        '<div class="row">' +
                                            '<div class="front-and-back menu-reference">' +
                                                '<div class="second-section-front"></div>' +
                                            '</div>' +
                                            '<div class="front-and-back menu-reference">' +
                                                '<div class="second-section-back"></div>' +
                                            '</div>' + 
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col">' +
                                        '<div id="rowSelectedHtmlRef" class="row rowSelected diskSelected"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col-md-12">' +
                                        '<button id="secondStepPrevious" type="button" class="btn btn-primary previous">Previous</button>' +
                                        '<button id="secondStepNext" type="button" class="btn btn-primary next">Next</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

            this.element.html(this.secondStepHtml);

            this.showRows();
            this.addRowClickHandlers();
            //this.addMenuHandler();
            
            this.element.find('#secondStepPrevious').click(this.secondStepPreviousHandler.bind(this));
        },

        secondStepPreviousHandler: function(event) {
            this.firstStep();
        },

        showRows: function() {
            
            var event = {
                target: {
                    value: this.data.noOfFrontRows
                }
            };
            
            var html = this.generateRowHtml(event, "front");
            $('.second-section-front').html('Front: <div class="disk-container disk-container-front">' + html + '</div>');

            event.target.value = this.data.noOfBackRows;
            html = this.generateRowHtml(event, "back");
            $('.second-section-back').html('Back: <div class="disk-container disk-container-back">' + html + '</div>');
        },

        addRowClickHandlers: function() {
            var that = this;
            $('.second-section-front').find('.disk').each(function(index, disk) {
                $(disk).click(function(event) {
                    that.rowClickHandler(event, this, 7);
                });
            });

            $('.second-section-back').find('.disk').each(function(index, disk) {
                $(disk).click(function(event) {
                    that.rowClickHandler(event, this, 127);
                });
            });
        },

        rowClickHandler: function(event, row, left) {
            
            /*$('.fields').find('.dropdown-menu')
            .css({left: left, top: event.pageY - 45})
            .show();*/
            //console.log(this.rowSelectedHtml);
            console.log(row)
            this.data.currentlySelectedRowReference = row;
            this.data.currentlySelectedRowIndex = parseInt($(row).attr("index"));
            
            $('.active-row').removeClass('active-row');
            
            $(row).addClass("active-row");

            if(! $(".row-selected-button-container")[0] ) {
                $('.rowSelected').html(this.rowSelectedHtml);
                this.addDiskHandler();
            }            
        },
        
        rowSelectedHtml: '<div class="col">' +
                            '<div class="row-selected-button-container"><button type="button" class="btn add-disk-button btn-success">Add Disk</button></div>' +
                        '</div>',

        diskHTML: '<div class="single-disk"></div>',
                        
        addDiskHandler: function() {
            
            $('.add-disk-button').click(this.addDisk.bind(this));
        },

        defaultDisk: {
            'disk_index' : '0', 
            'size_type': '2.5', 
            'type': 'SAS', 
            'rpm': '10k',
            'extra' : ''
        },

        addDisk: function() {
            
            if( $(this.data.currentlySelectedRowReference).find(".single-disk").length <= 11 ) {
                
                var index = 0;
                var face = $(this.data.currentlySelectedRowReference).attr("face");
                var selector = $(this.data.currentlySelectedRowReference).attr("face");
                

                
                /*if($(this.data.currentlySelectedRowReference).attr("face") === "front") {
                    
                    if( typeof(this.data.front[this.data.currentlySelectedRowIndex]) === 'undefined') {
                        this.data.front[this.data.currentlySelectedRowIndex] = [];
                    }
                    this.data.front[this.data.currentlySelectedRowIndex].push(this.defaultDisk);
                    index = this.data.front[this.data.currentlySelectedRowIndex].length - 1;

                } else {
                    if( typeof(this.data.back[this.data.currentlySelectedRowIndex]) === 'undefined') {
                        this.data.back[this.data.currentlySelectedRowIndex] = [];
                    }
                    this.data.back[this.data.currentlySelectedRowIndex].push(this.defaultDisk);
                    index = this.data.back[this.data.currentlySelectedRowIndex].length - 1;
                }*/

                if( typeof(this.data[selector][this.data.currentlySelectedRowIndex]) === 'undefined') {
                    this.data[selector][this.data.currentlySelectedRowIndex] = [];
                }
                this.data[selector][this.data.currentlySelectedRowIndex].push(this.defaultDisk);
                index = this.data[selector][this.data.currentlySelectedRowIndex].length - 1;
                

                var diskHtml = $(this.diskHTML).attr("index", index);

                $(this.data.currentlySelectedRowReference).append(diskHtml);

                console.log(this.data.back, this.data.front);
            }
            
            
        },

        /*addMenuHandler: function() {

            $('.dropdown-menu').mouseleave(function(event) {
                $(this).hide();
            });
        },*/

        
    });
});