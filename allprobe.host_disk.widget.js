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
                noOfBackRows: null
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
                                    '<label>No of Rows at front</label><input type="number" id="frontRowValue">' +
                                    '<label>No of Rows at back</label><input type="number" id="backRowValue">' +
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
            this.element.find('#frontRowValue').blur(this.dynamicRows.bind(this));
            this.element.find('#backRowValue').blur(this.dynamicRows.bind(this));

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
                    this.dynamicRows(event);
                }

                if(this.data.noOfBackRows !== null) {
                    event = {
                        target: {
                            id: "backRowValue",
                            value: this.data.noOfBackRows
                        }
                    };
                    $('#backRowValue').val(this.data.noOfBackRows);
                    this.dynamicRows(event);
                }
                
            }
        },

        dynamicRows: function(event) {
            
            var value = parseInt(event.target.value);
            var html = this.generateRowHtml(event);

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

        generateRowHtml: function(event) {

            var value = parseInt(event.target.value);
            if(value === 0) {
                return "";
            }

            var length = value - 1;
            var html = '<div class="disk" index="0"></div>';

            for(var i = 1; i <= length; i ++) {
                html = html + '<div class="disk" index="'+ i +'"></div>';
            }

            return html;
        },

        firstStepNextHandler: function(event) {
            //console.log(this, event);
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
                                    '<div class="col"></div>' +
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
            this.addMenuHandler();
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
            
            var html = this.generateRowHtml(event);
            $('.second-section-front').html('Front: <div class="disk-container disk-container-front">' + html + '</div>');

            event.target.value = this.data.noOfBackRows;
            html = this.generateRowHtml(event);
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
            console.log($('.disk-container-front').position(), event, $('.fields').position());
            $('.fields').find('.dropdown-menu')
            .css({left: left, top: event.pageY - 45})
            .show();
        },
        
        addMenuHandler: function() {

            $('.dropdown-menu').mouseleave(function(event) {
                $(this).hide();
            });
        },
        
    });
});