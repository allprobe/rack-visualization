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
            
            this.firstStepHtml = '<div class="first-step-container step">' +
                            '<div class="row">' +
                                '<div class="col-lg-12 title"><h3>Host disk front configuration</h3></div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col fields">Field</div>' +
                                '<div class="col">Graphics</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col-md-12">' +
                                    '<button id="firstStepPrevious" type="button" class="btn btn-primary previous">Previous</button>' +
                                    '<button id="firstStepNext" type="button" class="btn btn-primary next">Next</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

            this.element.append(this.firstStepHtml);
        }
    });
});