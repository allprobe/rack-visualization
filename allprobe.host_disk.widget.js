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
                currentlySelectedRowReference: null,
                currentlySelectedDiskIndex: null,
                currentlySelectedDiskReference: null,
            };

            console.log("Okay");
        },

        firstStep: function() {

            this.currentStep = 1;

            this.firstStepHtml = '<div class="first-step-container">' +
                            '<div class="title-row">' +
                                '<div class=" title">Host disk front/back configuration</div>' +
                            '</div>' +
                            '<div class="info">'+
                                'Welcome to Host Disk configuration wizard. Please input number of front and back discs you want in the below text boxes. Notice they are auto generated in the right side. Click next to move on to the next section.' +
                            '</div>' +
                            '<div class="field-container">' +
                                '<div class=" fields">' +
                                    '<fieldset>' +
                                        '<label>Number of Rows at front:</label><input type="number" class="first-step-input" max="12" id="frontRowValue">' +
                                        '<label>Number of Rows at back:</label><input type="number" class="first-step-input" max="12" id="backRowValue">' +
                                    '</fieldset>' +
                                '</div>' +
                                '<div class="auto-disks">' +
                                    '<div class="graphics-container-front"></div>' +
                                    '<div class="graphics-container-back"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="button-container">' +
                                '<button id="firstStepNext" type="button" class="btn btn-primary next">Next</button>' +
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
                
                html = '<label>Front:</label> <div class="disk-container">' + html + '</div>';
                if(value === 0 || isNaN(value)) {
                    $('.graphics-container-front').html("");
                    return;
                }
                $('.graphics-container-front').html(html);
            } 
            
            if( event.target.id === "backRowValue") {
                
                this.data.noOfBackRows = value;

                html = '<label>Back:</label> <div class="disk-container">' + html + '</div>';
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
            this.secondStepHtml = '<div class="second-step-container">' + 
                            '<div class="title-row">' +
                                '<div class="title">Disks configuration</div>' +
                            '</div>' +
                            '<div class="info">' +
                                'Please sekect a row to add disks. When you select a row, there appears a button to add disks. Select disks to change its parameters.'+
                            '</div>' +
                                '<div class="field-container">' +
                                    '<div class="fields">' +

                                        
                                        
                                            '<div class=" divide second-section-front"></div>' +
                                        
                                        
                                            '<div class="divide second-section-back"></div>' +
                                        
                                        
                                    '</div>' +
                                    '<div class="action-col">' +
                                        '<div id="rowSelectedHtmlRef" class="rowSelected diskSelected"></div>' +
                                    '</div>' +
                                '</div>' +
                                
                                '<div class="button-container">' +
                                    '<button id="secondStepPrevious" type="button" class="btn btn-primary previous">Previous</button>' +
                                    '<button id="secondStepNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                                
                            '</div>';

            this.element.html(this.secondStepHtml);

            this.showRows();
            this.addRowClickHandlers();
            //this.addMenuHandler();
            
            this.element.find('#secondStepPrevious').click(this.secondStepPreviousHandler.bind(this));
            this.element.find('#secondStepNext').click(this.secondStepNextHandler.bind(this));
        },

        secondStepPreviousHandler: function(event) {
            this.firstStep();
        },

        secondStepNextHandler: function() {

            this.thirdStep();
        },

        thirdStep: function() {
            this.element.html(this.thirdStepHtml);
        },

        thirdStepHtml: '<div class="third-step-container">' +
                    '<div class="title-row">' +
                        '<div class="title">Disks configuration</div>' +
                    '</div>' +
                    '<div class="text-content">Congratulation</div>' +
                    '<div class="button-container">' +
                        '<button id="thirdStepFinish" type="button" class="btn btn-primary next">Finish</button>' +
                    '</div>' +
                '</div>',

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
            console.log(row);
            this.data.currentlySelectedRowReference = row;
            this.data.currentlySelectedRowIndex = parseInt($(row).attr("index"));
            
            $('.active-row').removeClass('active-row');
            
            $(row).addClass("active-row");

            if(! $(".row-selected-button-container")[0] ) {
                $('.rowSelected').html(this.rowSelectedHtml);
                this.addDiskHandler();
            }            
        },
        
        rowSelectedHtml: '<div class="row-selected-button-container"><button type="button" class="btn add-disk-button btn-success">Add Disk</button></div>',

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
                //var face = $(this.data.currentlySelectedRowReference).attr("face");
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
        
                this.data[selector][this.data.currentlySelectedRowIndex].push($.extend({}, this.defaultDisk));
                index = this.data[selector][this.data.currentlySelectedRowIndex].length - 1;
                

                var that = this;

                var diskHtml = $(this.diskHTML).attr("index", index)
                    .click(function(event) {
                        event.stopPropagation();
                        that.editDiskValues(this);
                    });

                $(this.data.currentlySelectedRowReference)
                    .append(diskHtml);

                console.log(this.data.back, this.data.front);
            }  
        },

        getFace: function() {
            return $(this.data.currentlySelectedRowReference).attr("face");
        },

        getRowIndex: function() {
            return this.data.currentlySelectedRowIndex;
        },

        getDiskIndex: function() {
            return this.data.currentlySelectedDiskIndex;
        },

        editDiskValues: function(disk) {
            //console.log($(disk).parent());
            $('.active-disk').removeClass('active-disk');
            $(disk).addClass('active-disk');

            this.rowClickHandler({}, $(disk).parent(), 127);
            var face = this.getFace();
            var selectedRow = this.getRowIndex();
            diskIndex = parseInt($(disk).attr('index'));
            this.data.currentlySelectedDiskIndex = diskIndex;
            this.data.currentlySelectedDiskReference = disk;
            var values = this.data[face][selectedRow][diskIndex];
            console.log(selectedRow, diskIndex);
            $('.diskSelected').html(this.editDiskHtml);
            this.autoSave();
            this.applyValues(values);
        },

        getCurrentDisk: function() {

            var face = this.getFace();
            var rowIndex = this.getRowIndex();
            var diskIndex = this.getDiskIndex();
            console.log(face, rowIndex, diskIndex);
            return this.data[face][rowIndex][diskIndex];
        },

        editDiskHtml: '<div class="col disk-editing edit-disk-values">'+
                        '<div class="item-left">Disk Index</div>' +
                        '<div class="item-right"><input id="disk_index" type="number" /></div>' +
                        
                        '<div class="item-left">Size:</div>' +
                        '<div class="item-right"> '+
                            '<select id="size_type_select" name="size_type">' +
                                '<option value="2.5">2.5</option>' +
                                '<option value="3.5">3.5</option>' +
                            '</select>' +
                        '</div>' +

                        '<div class="item-left">Type:</div>' +
                        '<div class="item-right"> '+
                            '<select id="disk_type_select" name="disk_type">' +
                                '<option value="SAT">SAT</option>' +
                                '<option value="SATA">SATA</option>' +
                                '<option value="SSD">SSD</option>' +
                            '</select>' +
                        '</div>' +

                        '<div class="item-left">Rpm:</div>' +
                        '<div class="item-right"> '+
                            '<select id="rpm_select" name="rpm">' +
                                '<option value="7200">7200</option>' +
                                '<option value="10000">10000</option>' +
                                '<option value="15000SD">15000</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="item-left">Extra:</div>' +
                        '<div class="itm-right"><textarea id="extra_text"></textarea></div>' +
                    '</div>',
        /*addMenuHandler: function() {

            $('.dropdown-menu').mouseleave(function(event) {
                $(this).hide();
            });
        },*/
        
        applyValues: function(values) {
            
            console.log(values);
            $("#disk_index").val(parseInt(values.disk_index));
            $("#size_type_select option[value='"+  values.size_type +"']").attr("selected", "selected");
            $("#disk_type_select option[value='"+  values.type +"']").attr("selected", "selected");
            $("#rpm_select option[value='"+  values.rpm +"']").attr("selected", "selected");
            $("#extra_text").val(values.extra);
        },

        autoSave: function() {

            var rowIndex = this.data.currentlySelectedRowIndex;
            var diskIndex = this.data.currentlySelectedDiskIndex;
            var that = this;

            $("#disk_index").keyup(function(event) {
                var disk = that.getCurrentDisk();
                disk.disk_index = event.target.value;
            });

            $("#disk_index").change(function(event) {
                var disk = that.getCurrentDisk();
                disk.disk_index = event.target.value;
            });

            $("#size_type_select").change(function(event) {
                var disk = that.getCurrentDisk();
                disk.size_type = event.target.value;
            });

            $("#disk_type_select").change(function(event) {
                var disk = that.getCurrentDisk();
                disk.type = event.target.value;
            });

            $("#rpm_select").change(function(event) {
                var disk = that.getCurrentDisk();
                disk.rpm = event.target.value;
            });

            $("#extra_text").keyup(function(event) {
                var disk = that.getCurrentDisk();
                disk.extra = event.target.value;
            });
        }
        
    });
});