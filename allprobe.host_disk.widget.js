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
            this.currentVolumeIndex = 0;
            this.editVolumeMode = false;

            this.data = {
                noOfFrontRows: null,
                noOfBackRows: null,
                front: null,
                back: null,
                volume: [],
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
                                    '<fieldset class="first-setion-fieldset">' +
                                        '<label>Number of Rows at front:</label><br /><input type="number" class="first-step-input" min="1" max="12" id="frontRowValue">' +
                                        '<label>Number of Rows at back:</label><br /><input type="number" class="first-step-input" min="0" max="12" id="backRowValue">' +
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

            this.insertDefaultValues();

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

        insertDefaultValues: function() {
            
            var event = {
                target: {
                    value: 1,
                    id: "frontRowValue",
                }
            };

            this.element.find('#frontRowValue').val(1);
            this.dynamicRows(event, "front");
            
            event = {
                target: {
                    value: 0,
                    id: "backRowValue",
                }
            };

            this.element.find('#backRowValue').val(0);
            this.dynamicRows(event, "back");
        
        },

        dynamicRows: function(event, face) {
            
            var value = parseInt(event.target.value);
            if(value > 12) {
                alert("Please enter a value less than 13");
                $(event.currentTarget).val(parseInt(value / 10));
                return 0;
            }
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
            
            var length = ( this.data.noOfFrontRows - 1 >= 0 ) ? this.data.noOfFrontRows - 1 : 0;

            this.data.front = Array(length);

            length = ( this.data.noOfBackRows - 1 <= 0 ) ? 0 : this.data.noOfBackRows - 1 ;
            
            this.data.back = Array(length);
            this.createVolume();
            //this.secondStep();
        },


        createVolume: function() {

            this.currentStep = 'volumeStep';
            this.createVolumeStep = '<div class="volume-step-container">' +
                                '<div class="title-row">' +
                                    '<div class="title">Disks configuration</div>' +
                                '</div>' +
                                '<div class="info">' +
                                    'Its time to create volumes.'+
                                '</div>' +

                                '<div class="field-container">' +
                                    '<div class="fields">' +
                                        this.addVolumeHTML +
                                    '</div>' +
                                    '<div class="action-col">' +
                                        '<select size="10" class="select-box-volume" id="volumeSelector">' + 

                                        '</select>' +
                                    '</div>' +
                                '</div>' +
                                
                                '<div class="button-container">' +
                                    '<button id="createVolumePrevious" type="button" class="btn btn-primary previous">Previous</button>' +
                                    '<button id="createVolumeNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                            '</div>';
            this.element.html(this.createVolumeStep);
            this.volumeHTML();
            this.autoSaveCurrentVolume();

        },

        secondStep: function() {

            this.currentStep = 2;
            this.secondStepHtml = '<div class="second-step-container">' + 
                            '<div class="title-row">' +
                                '<div class="title">Disks configuration</div>' +
                            '</div>' +
                            '<div class="info">' +
                                'Please select a row to add disks. When you select a row, there appears a button to add disks. Select disks to change its parameters.'+
                            '</div>' +
                                '<div class="field-container">' +
                                    '<div class="fields">' +

                                        
                                        
                                            '<div class=" divide second-section-front"></div>' +
                                        
                                        
                                            '<div class="divide second-section-back"></div>' +
                                        
                                        
                                    '</div>' +
                                    '<div class="action-col">' +
                                        '<div id="rowSelectedHtmlRef" class="rowSelected diskSelected createVolumeSelected"></div>' +
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

            var finalData = {
                "front": this.data.front,
                "back": this.data.back,
                "volume": this.data.volume,
            };

            alert(JSON.stringify(finalData));
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

            if( this.data.noOfBackRows > 0) {
                event.target.value = this.data.noOfBackRows;
                html = this.generateRowHtml(event, "back");
                $('.second-section-back').html('Back: <div class="disk-container disk-container-back">' + html + '</div>');
            }
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
                //this.createVolumeHandler();
            }            
        },
        
        rowSelectedHtml: '<div class="row-selected-button-container"><button type="button" class="btn add-disk-button btn-success">Add Disk</button><button type="button" class="btn create-volume-button btn-success">Create Volume</button></div>',
        
        addVolumeHTML: '<div class="col disk-editing edit-disk-values volume-val">' +
                            '<div class="item-left">Name</div>' +
                            '<div class="item-right"><input id="volume_name" type="text" /></div>' +
                            '<div class="item-left">Type:</div>' +
                            '<div class="item-right"> '+
                                '<select id="volume_type_select" name="volume_size_type">' +
                                    '<option value="none">NONE</option>' +
                                    '<option value="raid0">raid0</option>' +
                                    '<option value="raid1">raid1</option>' +
                                    '<option value="raid2">raid2</option>' +
                                    '<option value="raid3">raid3</option>' +
                                    '<option value="raid4">raid4</option>' +
                                    '<option value="raid5">raid5</option>' +
                                    '<option value="raid6">raid6</option>' +
                                '</select>' +
                            '</div>' +
                            '<div class="item-left">Type:</div>' +
                            '<div class="item-right"><input id="volume_color" value="#d30219" type="color" /></div>' +

                            '<div class="item-left"></div>' +
                            '<div class="item-right">' +
                                '<button id="doneVolume" type="button" class="btn btn-primary">Create Volume</button>' +
                            '</div>' +
                        
                        '</div>',

        diskHTML: '<div class="single-disk"></div>',

        editVolumeHTML: '<div class="col disk-editing edit-disk-values edit-volume-val">' +
                            '<div class="item-left">Name</div>' +
                            '<div class="item-right"><input id="edit_volume_name" type="text" /></div>' +
                            '<div class="item-left">Type:</div>' +
                            '<div class="item-right"> '+
                                '<select id="edit_volume_type_select" name="volume_size_type">' +
                                    '<option value="none">NONE</option>' +
                                    '<option value="raid0">raid0</option>' +
                                    '<option value="raid1">raid1</option>' +
                                    '<option value="raid2">raid2</option>' +
                                    '<option value="raid3">raid3</option>' +
                                    '<option value="raid4">raid4</option>' +
                                    '<option value="raid5">raid5</option>' +
                                    '<option value="raid6">raid6</option>' +
                                '</select>' +
                            '</div>' +
                            '<div class="item-left">Type:</div>' +
                            '<div class="item-right"><input id="edit_volume_color" value="#d30219" type="color" /></div>' +

                            '<div class="item-left">' +
                                '<button id="updateVolume" type="button" class="btn btn-primary">Update</button>' +
                            '</div>' +
                            '<div class="item-right">' +
                                '<button id="discardVolume" type="button" class="btn btn-primary">Discard</button>' +
                                '<button id="deleteVolume" type="button" class="btn btn-primary">Delete</button>' +
                            '</div>' +
                        
                        '</div>', 

        addDiskHandler: function() {
            
            $('.add-disk-button').click(this.addDisk.bind(this));
        },

        createVolumeHandler: function() {

            //$('.create-volume-button').click(this.volumeHTML.bind(this));
            //console.log("createVolumeHandler", this.data.volume, aVolume);
        },

        volumeHTML: function() {

            var aVolume = $.extend({}, this.defaultVolume);
            aVolume.index = this.currentVolumeIndex;
            aVolume.name = "Volume(" + aVolume.index + ")";
            this.currentVolumeIndex = this.currentVolumeIndex + 1;
            this.data.volume.push(aVolume);
            //$('.createVolumeSelected').html(this.addVolumeHTML);
            //this.autoSaveCurrentVolume();
            console.log("Created");

        },

        autoSaveCurrentVolume: function() {

            var that = this;
            var volume = this.data.volume[this.currentVolumeIndex - 1];
            
            $('#volume_name').keyup(function(evt) {
                var volume = that.data.volume[that.currentVolumeIndex - 1];
                volume.name = evt.target.value;
            });

            $('#volume_type_select').change(function(evt) {
                console.log("Its changed");
                var volume = that.data.volume[that.currentVolumeIndex - 1];
                volume.type = evt.target.value;
            });

            $('#volume_color').change(function(evt) {
                console.log("Its changed");
                var volume = that.data.volume[that.currentVolumeIndex - 1];
                volume.color = evt.target.value;
                //$(this.data.currentlySelectedDiskReference).css("backgroundColor", volume.color);
            });

            $('#volumeSelector').change(function(evt) {
                that.editVolumeMode = true;
                that.activateEditVolumeMode();
                var volumeIndex = evt.target.value;
                var selectedVolume = that.data.volume[volumeIndex];
                console.log(selectedVolume);
                $('#edit_volume_name').val(selectedVolume.name);
                $('#edit_volume_type_select').val(selectedVolume.type);
                $('#edit_volume_color').val(selectedVolume.color);
            });

            $('#doneVolume').click(function(event) {

                if($('#volumeSelector').val() === null) {
                    // Save as new volume
                    var volume = that.data.volume[that.currentVolumeIndex - 1];
                    //that.rowClickHandler({}, that.data.currentlySelectedRowReference);
                    that.volumeHTML();
                    $('#volumeSelector').append("<option value=" + volume.index + ">"+ volume.name +"</option>");
                    that.clearVolumeFields();
                } else {
                    // Edit an existing volume
                    
                }
                
            });
        },

        activateEditVolumeMode: function() {
            var exist = $('.fields').find('div.volume-val').length;
            if(exist > 0) {
                console.log("Yes", $('.fields').find('div.volume-val').length);
                $('.fields').html(this.editVolumeHTML);
                this.addEditVolumeEvents();
            }
        },

        getCurrentlySelectedVolume: function() {
            var volumeIndex = $('#volumeSelector').val();
            var selectedVolume = this.data.volume[volumeIndex];
            return selectedVolume;
        },

        addEditVolumeEvents: function() {
            var that = this;
            //var volume = this.data.volume[this.currentVolumeIndex - 1];
            
            $('#edit_volume_name').keyup(function(evt) {
                var volume = that.getCurrentlySelectedVolume();
                volume.name = evt.target.value;
            });

            $('#edit_volume_type_select').change(function(evt) {
                console.log("Its changed");
                var volume = that.getCurrentlySelectedVolume();
                volume.type = evt.target.value;
            });

            $('#edit_volume_color').change(function(evt) {
                console.log("Its changed");
                var volume = that.getCurrentlySelectedVolume();
                volume.color = evt.target.value;
                //$(this.data.currentlySelectedDiskReference).css("backgroundColor", volume.color);
            });

            $('#updateVolume').click(function(evt) {
                that.updateVolume();
            });

        },

        updateVolume: function() {
            
            var selectedVolume = this.getCurrentlySelectedVolume();
            selectedVolume.name = $('#edit_volume_name').val();
            $('#volumeSelector option:selected').text(selectedVolume.name);
            selectedVolume.type = $('#edit_volume_type_select').val();
            selectedVolume.color = $('#edit_volume_color').val();
            $('#volumeSelector option:selected').prop('selected', false);
            
        },

        clearVolumeFields: function() {
            $('#volume_name').val("");
            $('#volume_type_select').val("none");
            $('#volume_color').val('#d30219');

        },

        defaultDisk: {
            'disk_index' : '0', 
            'size_type': '2.5', 
            'type': 'SAS', 
            'rpm': '10k',
            'extra' : '',
            'volume': 'none',
        },

        defaultVolume: {
            index: 0,
            name: "",
            type: 'none',
            color: '#d30219',
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
            var editDiskHtmlDummy = this.editDiskHtml;
            editDiskHtmlDummy = editDiskHtmlDummy.replace("replace_with_options", this.getVolumesOption());
            $('.diskSelected').html(editDiskHtmlDummy);
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
                        '<div class="item-right"><input id="disk_index" min="0" type="number" /></div>' +
                        
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

                        '<div class="item-left-special">Extra:</div>' +
                        '<div class="item-right-special"><textarea id="extra_text"></textarea></div>' +
                        
                        '<div class="item-left">Volume:</div>' +
                        '<div class="item-right"> '+
                            '<select id="volume_select" name="volume">replace_with_options</select>' +
                        '</div>' +
                    '</div>',
        /*addMenuHandler: function() {

            $('.dropdown-menu').mouseleave(function(event) {
                $(this).hide();
            });
        },*/
        getVolumesOption: function() {

            var returnHtml = '<option value="none">none</option>';
            this.data.volume.forEach((element, index) => {
                returnHtml = returnHtml + '<option value='+ element.index+'>'+ element.name +'</option>';
            });
            console.log(this.data.volume, returnHtml);
            return returnHtml;
        },
        
        applyValues: function(values) {
            
            console.log(values);
            $("#disk_index").val(parseInt(values.disk_index));
            $("#size_type_select option[value='"+  values.size_type +"']").attr("selected", "selected");
            $("#disk_type_select option[value='"+  values.type +"']").attr("selected", "selected");
            $("#rpm_select option[value='"+  values.rpm +"']").attr("selected", "selected");
            $("#extra_text").val(values.extra);
            $("#volume_select option[value='"+  values.volume +"']").attr("selected", "selected");
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

            $("#volume_select").change(function(event) {
                console.log(event);
                var disk = that.getCurrentDisk();
                disk.volume = event.target.value;
                
                if(disk.volume === 'none') {
                    $(that.data.currentlySelectedDiskReference).css('background-color', "burlywood");
                } else {
                    volumeColor = that.data.volume[disk.volume].color;
                    $(that.data.currentlySelectedDiskReference).css('background-color', volumeColor);
                }
                
            });
        }
        
    });
});