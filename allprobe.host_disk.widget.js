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
                                '<div class="col">Graphics</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col-md-12">' +
                                    '<button id="firstStepNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

            this.element.html(this.firstStepHtml);

            this.element.find('#firstStepNext').click(this.firstStepNextHandler.bind(this));
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
                                    '<div class="col fields">fields</div>' +
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

            this.element.find('#secondStepPrevious').click(this.secondStepPreviousHandler.bind(this));
        },

        secondStepPreviousHandler: function(event) {
            this.firstStep();
        }


    });
});