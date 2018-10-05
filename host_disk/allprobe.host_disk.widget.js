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

            if(this.options.data) {

                var diskData = this.options.data;

                if(diskData.front) {
                    diskData.front.forEach(function(row, index) {
                    
                        if(row === null) {
                            diskData.front[index] = [];
                        }
                    });
                    this.data.noOfFrontRows = diskData.front.length;
                    this.data.front = diskData.front; 
                }
                
                if(diskData.back) {
                    diskData.back.forEach(function(row, index) {
                        if(row === null) {
                            diskData.back[index] = [];
                        }
                    });
                    this.data.noOfBackRows = diskData.back.length;
                    this.data.back = diskData.back;    
                }
                
                if(diskData.volume) {
                    this.data.volume = diskData.volume;
                }
                
                console.log(this.data);
            }
            
        },

        /** 
         * First Step 
        */

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
            
            if(this.data.front === null && this.data.back === null) {
                console.log("Here I am ");
                this.insertDefaultValues();
            }
            

            if( this.data !== null) {
                
                var event;
                if(this.data.noOfFrontRows !== null) {
                    console.log("hey js", this.data.noOfFrontRows);
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

        firstStepToChange: function() {
            this.firstStep();

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
            
            if(this.data.front === null && this.data.back === null) {
                var length = ( this.data.noOfFrontRows - 1 >= 0 ) ? this.data.noOfFrontRows - 1 : 0;

                this.data.front = Array(length);

                length = ( this.data.noOfBackRows - 1 <= 0 ) ? 0 : this.data.noOfBackRows - 1 ;
            
                this.data.back = Array(length);
                this.createVolume();
                return;
            }

            var diff;

            this.updateForChangeInFrontRows();
            this.updateForChangeInBackRows();

            this.createVolume();
            return;
            
        },

        updateForChangeInFrontRows: function() {
            
            if(this.data.noOfFrontRows > this.data.front.length) {
                diff = this.data.noOfFrontRows - this.data.front.length;
                for(var i = 0; i < diff; i++) {
                    this.data.front.push([]);
                }
            } 

            if(this.data.noOfFrontRows < this.data.front.length) {
                diff = this.data.front.length - this.data.noOfFrontRows;
                this.data.front.splice(-1, diff);
            }
        },

        updateForChangeInBackRows: function() {

            if(this.data.noOfBackRows > this.data.back.length) {
                diff = this.data.noOfBackRows - this.data.back.length;
                for(var i = 0; i < diff; i++) {
                    this.data.back.push([]);
                }
            } 

            if(this.data.noOfBackRows < this.data.back.length) {
                diff = this.data.back.length - this.data.noOfBackRows;
                this.data.back.splice(-1, diff);
            }

        },

        /* End of First step */

        /** Second step which creates Volume 
         * 
        */
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
                                    '<div class="fields volume-field">' +
                                        this.addVolumeHTML +
                                    '</div>' +
                                    '<div class="action-col">' +
                                        '<select size="10" class="select-box-volume" id="volumeSelector">' + 

                                        '</select>' +
                                    '</div>' +
                                '</div>' +
                                
                                '<div class="button-container create-volume-button-container">' +
                                    '<button id="createVolumePrevious" type="button" class="btn btn-primary previous">Previous</button>' +
                                    '<button id="createVolumeNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                            '</div>';

            this.element.html(this.createVolumeStep);
            this.autoSaveCurrentVolume();
            this.volumeSelectorChange();
            this.volumeNextAndPrevious();
            if(this.data.volume.length > 0) {
                this.reWorkVolumeDetails();
            }
        },

        volumeNextAndPrevious: function() {

            var that = this;
            $('#createVolumePrevious').click(function(evt) {
                that.firstStepToChange();
            });

            $('#createVolumeNext').click(function(evt) {
                that.diskStep();
            });

        },

        defaultVolume: {
            index: 0,
            name: "",
            type: 'none',
            color: '#d30219',
        },

        addVolumeHTML: '<div class="col disk-editing edit-disk-values volume-val">' +
                            '<div class="volume-message">Create new Volume</div>' +
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

        editVolumeHTML: '<div class="col disk-editing edit-disk-values edit-volume-val">' +
                        '<div class="volume-message">Edit selected Volume</div>' +
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
                            '<button id="discardVolume" type="button" class="btn btn-primary">Discard</button>' +
                        '</div>' +
                        '<div class="item-right">' +
                            '<button id="updateVolume" type="button" class="btn btn-primary">Update</button>' +
                            '<button id="deleteVolume" type="button" class="btn btn-primary">Delete</button>' +
                        '</div>' +
                    
                    '</div>',

        volumeHTML: function() {

            var aVolume = $.extend({}, this.defaultVolume);
            aVolume.index = this.data.volume.length;
            aVolume.name = $('#volume_name').val() || "Volume(" + aVolume.index + ")";
            aVolume.type = $('#volume_type_select').val();
            aVolume.color = $('#volume_color').val();

            this.data.volume.push(aVolume);
            return this.data.volume[this.data.volume.length - 1];

        },
            
        volumeSelectorChange: function() {
            var that = this;
            $('#volumeSelector').change(function(evt) {
                that.editVolumeMode = true;
                that.activateEditVolumeMode();
                var selectedVolume = that.getCurrentlySelectedVolume();
                console.log(selectedVolume);
                $('#edit_volume_name').val(selectedVolume.name);
                $('#edit_volume_type_select').val(selectedVolume.type);
                $('#edit_volume_color').val(selectedVolume.color);
            });
        },
            
        autoSaveCurrentVolume: function() {

            var that = this;
            
            $('#doneVolume').click(function(event) {

                var volume = that.volumeHTML();
                $('#volumeSelector')
                    .append("<option value=" + volume.index + ">"+ volume.name +"</option>");
                that.clearVolumeFields();
                
                
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
            console.log(volumeIndex, this.data.volume);
            var selectedVolume = this.data.volume[volumeIndex];
            return selectedVolume;
        },
            
        getCurrentlySelectedVolumeIndex: function() {

            var volumeIndex = $('#volumeSelector').val();
            return volumeIndex;
        },

        addEditVolumeEvents: function() {
            var that = this;
            
            $('#updateVolume').click(function(evt) {
                that.updateVolume();
                that.discardVolume();
            });

            $('#discardVolume').click(function(evt) {
                that.discardVolume();
            });

            $('#deleteVolume').click(function(evt) {
                that.deleteVolume();
            });

        },
            
        deleteVolume: function() {

            var index = this.getCurrentlySelectedVolumeIndex();
            this.removeVolumeReferenceFromDisks(index, "front");
            this.removeVolumeReferenceFromDisks(index, "back");
            this.data.volume.splice(index, 1);
            $('#volumeSelector').empty();
            this.reWorkVolumeDetails();
            this.discardVolume();
            
        },

        removeVolumeReferenceFromDisks: function(volumeIndexToBeDeleted, face) {

            this.data[face].forEach(function(rowArray, rowIndex) {

                rowArray.forEach(function(disk, diskIndex) {
                    if(disk.volume === volumeIndexToBeDeleted) {
                        disk.volume = 'none';
                    }
                });
            });
        },
        

        reWorkVolumeDetails: function() {
            
            this.data.volume.forEach(function(volume, index) {
                console.log(index);
                volume.index = index;
                $('#volumeSelector')
                    .append("<option value=" + volume.index + ">"+ volume.name +"</option>");

            });
        },
            
        discardVolume: function() {

            $('.fields').html(this.addVolumeHTML);
            this.autoSaveCurrentVolume();
            this.editVolumeMode = false;
            $('#volumeSelector option:selected').prop('selected', false);
        },

        updateVolume: function() {
            
            var selectedVolume = this.getCurrentlySelectedVolume();
            selectedVolume.name = $('#edit_volume_name').val();
            $('#volumeSelector option:selected').text(selectedVolume.name);
            selectedVolume.type = $('#edit_volume_type_select').val();
            selectedVolume.color = $('#edit_volume_color').val();
            
        },
            
        clearVolumeFields: function() {
            $('#volume_name').val("");
            $('#volume_type_select').val("none");
            $('#volume_color').val('#d30219');

        },
        
        getVolumesOption: function() {

            var returnHtml = '<option value="none">none</option>';
            this.data.volume.forEach((element, index) => {
                returnHtml = returnHtml + '<option value='+ element.index+'>'+ element.name +'</option>';
            });
            
            return returnHtml;
        },
            
        /**
         * End of Volume Step
         */

         /**
          * ThirdStep Starts here which manages disks.
          */
        diskStep: function() {

            this.currentStep = 2;
            this.diskStepHtml = '<div class="disk-step-container">' + 
                            '<div class="title-row">' +
                                '<div class="title">Disks configuration</div>' +
                            '</div>' +
                            '<div class="info">' +
                                'Please select a row to add disks. When you select a row, there appears a button to add disks. Select disks to change its parameters.'+
                            '</div>' +
                                '<div class="field-container">' +
                                    '<div class="fields">' +

                                        
                                        
                                            '<div class=" divide disk-section-front"></div>' +
                                        
                                        
                                            '<div class="divide disk-section-back"></div>' +
                                        
                                        
                                    '</div>' +
                                    '<div class="action-col">' +
                                        '<div id="rowSelectedHtmlRef" class="rowSelected diskSelected createVolumeSelected"></div>' +
                                    '</div>' +
                                '</div>' +
                                
                                '<div class="button-container">' +
                                    '<button id="diskStepPrevious" type="button" class="btn btn-primary previous">Previous</button>' +
                                    '<button id="diskStepNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                                
                            '</div>';

            this.element.html(this.diskStepHtml);

            this.showRows();
            this.addRowClickHandlers();
            this.showDisks();

            this.element.find('#diskStepPrevious').click(this.diskStepPreviousHandler.bind(this));
            this.element.find('#diskStepNext').click(this.diskStepNextHandler.bind(this));
        },

        diskStepPreviousHandler: function(event) {
            this.createVolume();
        },

        diskStepNextHandler: function() {

            this.thirdStep();
        },

        thirdStep: function() {

            this.element.html(this.thirdStepHtml);

            var finalData = {
                "front": this.data.front,
                "back": this.data.back,
                "volume": this.data.volume,
            };
            console.log(JSON.stringify(finalData));
            //alert(JSON.stringify(finalData));
            return finalData;
        },

        showRows: function() {
            
            var event = {
                target: {
                    value: this.data.noOfFrontRows
                }
            };
            
            var html = this.generateRowHtml(event, "front");
            $('.disk-section-front').html('Front: <div class="disk-container disk-container-front">' + html + '</div>');

            if( this.data.noOfBackRows > 0) {
                event.target.value = this.data.noOfBackRows;
                html = this.generateRowHtml(event, "back");
                $('.disk-section-back').html('Back: <div class="disk-container disk-container-back">' + html + '</div>');
            }
        },

        showDisks: function() {
            
            var that = this;
            this.data.front.forEach(function(arValue, index) {
                
                if(arValue !== null && arValue.length > 0) {
                    $($('.disk-section-front').find('.disk')[index]).click();
                    arValue.forEach(function(val, index) {
                        var DH = that.addDisk(true, index);
                        if(val.volume !== 'none') {
                            
                            volumeColor = that.data.volume[val.volume].color;
                            $(DH).css('background-color', volumeColor);
                            
                        }
                    }); 
                }
            });

            this.data.back.forEach(function(arValue, index) {
                
                if(arValue !== null && arValue.length > 0) {
                    $($('.disk-section-back').find('.disk')[index]).click();
                    arValue.forEach(function(val, index) {
                        var DH = that.addDisk(true, index);
                        if(val.volume !== 'none') {
                            
                            volumeColor = that.data.volume[val.volume].color;
                            $(DH).css('background-color', volumeColor);
                            
                        }
                    }); 
                }
            });
        },

        addRowClickHandlers: function() {

            var that = this;
            $('.disk-section-front').find('.disk').each(function(index, disk) {
                $(disk).click(function(event) {
                    that.rowClickHandler(this);
                });
            });

            $('.disk-section-back').find('.disk').each(function(index, disk) {
                $(disk).click(function(event) {
                    that.rowClickHandler(this);
                });
            });
        },

        rowClickHandler: function(row) {
            
            this.data.currentlySelectedRowReference = row;
            this.data.currentlySelectedRowIndex = parseInt($(row).attr("index"));
            
            $('.active-row').removeClass('active-row');
            
            $(row).addClass("active-row");

            if(! $(".row-selected-button-container")[0] ) {
                console.log("This is the place");
                $('.rowSelected').html(this.rowSelectedHtml);
                this.addDiskHandler();
            }            
        },
        
        rowSelectedHtml: '<div class="row-selected-button-container"><button type="button" class="btn add-disk-button btn-success">Add Disk</button></div>',
        
        
        diskHTML: '<div class="single-disk"></div>',

        
        addDiskHandler: function() {
            
            $('.add-disk-button').click(this.addDisk.bind(this, false, null));
        },
        
        defaultDisk: {
            'disk_index' : '0', 
            'size_type': '2.5', 
            'type': 'SAS', 
            'rpm': '10k',
            'extra' : '',
            'volume': 'none',
        },

        addDisk: function(automatic, automaticIndex) {

            var that = this;
            if( $(this.data.currentlySelectedRowReference).find(".single-disk").length <= 23 ) {
                
                var index = 0;

                var selector = $(this.data.currentlySelectedRowReference).attr("face");
                
                if( typeof(this.data[selector][this.data.currentlySelectedRowIndex]) === 'undefined') {
                    this.data[selector][this.data.currentlySelectedRowIndex] = [];
                }

                if(! automatic) {
                    
                    this.data[selector][this.data.currentlySelectedRowIndex].push($.extend({}, this.defaultDisk));
                    index = this.data[selector][this.data.currentlySelectedRowIndex].length - 1;
                } else {
                    index = automaticIndex;
                }
               console.log(this.data.back, this.data.front);
                

                var diskHtml = $(this.diskHTML).attr("index", index)
                    .click(function(event) {
                        
                        event.stopPropagation();
                        that.editDiskValues(this);
                    });

                $(this.data.currentlySelectedRowReference)
                    .append(diskHtml);

                return diskHtml;    
                
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
            
            $('.active-disk').removeClass('active-disk');
            $(disk).addClass('active-disk');

            this.rowClickHandler($(disk).parent());
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
                                '<option value="SATA">SATA</option>' +
                                '<option value="SSD">SSD</option>' +
                                '<option value="SAS">SAS</option>' +
                            '</select>' +
                        '</div>' +

                        '<div class="item-left">Rpm:</div>' +
                        '<div class="item-right"> '+
                            '<select id="rpm_select" name="rpm">' +
                                '<option value="7200">7200</option>' +
                                '<option value="10000">10000</option>' +
                                '<option value="15000">15000</option>' +
                            '</select>' +
                        '</div>' +

                        '<div class="item-left-special">Extra:</div>' +
                        '<div class="item-right-special"><textarea id="extra_text"></textarea></div>' +
                        
                        '<div class="item-left">Volume:</div>' +
                        '<div class="item-right"> '+
                            '<select id="volume_select" name="volume">replace_with_options</select>' +
                        '</div>' +

                        '<div class="item-left"><button id="deleteSelectedDisk" type="button" class="btn btn-primary">Delete</button></div>' +
                        '<div class="item-right"> '+
                            '<button id="updateSelectedDisk" type="button" class="btn btn-primary">Update</button>' +
                        '</div>' +
                    '</div>',
        
        
        applyValues: function(values) {
            
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
                
                var disk = that.getCurrentDisk();
                disk.volume = event.target.value;
                
                if(disk.volume === 'none') {
                    $(that.data.currentlySelectedDiskReference).css('background-color', "burlywood");
                } else {
                    volumeColor = that.data.volume[disk.volume].color;
                    $(that.data.currentlySelectedDiskReference).css('background-color', volumeColor);
                }
                
            });

            $("#deleteSelectedDisk").click(function(event) {

                var face = that.getFace();
                var rowIndex = that.getRowIndex();
                var diskIndex = that.getDiskIndex();

                that.data[face][rowIndex].splice(diskIndex, 1);
                $(that.data.currentlySelectedDiskReference).remove();
                
                $.each($('.active-row').find('.single-disk'), function(index, disk) {
                    $(disk).attr("index", index);
                });

                $('.rowSelected').html(that.rowSelectedHtml);
                that.addDiskHandler();
            });

            $("#updateSelectedDisk").click(function(event) {
                $('.rowSelected').html(that.rowSelectedHtml);
                that.addDiskHandler();
            });
        }


        
    });
});