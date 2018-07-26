// This is a very bespoke list of functions for the object_edit pages included in the competency app, relating
// primarily to the trait "sliders" used on these pages
$(document).ready(function() {
    function initialise_slider(div) {
        div.slider({
            slide: function (event, ui) {
                // Stop the slider handles from being dragged over each other
                if (ui.values[0] > ui.values[1] ||
                        ui.values[1] > ui.values[2] ||
                        ui.values[2] > ui.values[3]) {
                    return false;
                }
                else {
                    doUpdate
                }
            },
            change: doUpdate,
            min: 0,
            max: 10,
            values: [
                div.prevAll("div #ideal_range_threshold_1").children("input[name*='ideal_range_threshold_1']").val(),
                div.prevAll("div #ideal_range_threshold_2").children("input[name*='ideal_range_threshold_2']").val(),
                div.nextAll("div #ideal_range_threshold_3").children("input[name*='ideal_range_threshold_3']").val(),
                div.nextAll("div #ideal_range_threshold_4").children("input[name*='ideal_range_threshold_4']").val()
            ]
        });
    }
    function set_weighting_text(span) {
        // Set weighting text based on range slider. span is slider container
        span.parent().prev().text(span.val());
    }
    function slide_colour(i, slider, handle) {
        // Set the background colour between two slider handles based on handle position in sequence
        var bg = '#ba274a'; // RED
        if (i == 0) {
            bg = '#e5d24a'; // AMBER
        } else if (i == 1) {
            bg = '#45c45d'; // GREEN
        } else if (i == 2) {
            bg = '#e5d24a'; // AMBER
        } else if (i == 3) {
            bg = '#ba274a'; // RED
        }
        slider.append($('<div></div>').addClass('slide-back').width(handle.position().left - 7).css('background', bg));
    }

    function initialise_graph_colours() {
        // For each slider or aptitude graph which exists when the page first loads, update the colour ranges
        $('.slide').each(function(index) {
            var $current_slider = $(this);
            $($current_slider.find('span').get().reverse()).each(function (i) {
                // Loop each handle
                slide_colour(i, $current_slider, $(this));
            });
        });
        $('.aptitude-cut-off').each(function(index) {
            set_aptitude_graph_color($(this));
        });
    }

    function set_aptitude_graph_color(input) {
        // Set aptitude graph colour based on radio button input
        if (input.val() == 2 && input.is(':checked')) {
            var new_color = '#45c45d'; // GREEN
        } else if (input.val() == 4 && input.is(':checked')) {
            var new_color = '#ba274a'; // RED
        }
        var $ul = input.closest("ul");
        var $graph = $ul.next(".aptitude-graph");
        $graph.find('.bar-second').css('background-color', new_color);
    }

    function update_form_fields(slider, ui) {
        // Update form fields closest to input object using values array
        slider.prevAll("div #ideal_range_threshold_1").children("input[name*='ideal_range_threshold_1']").val(ui.values[0]);
        slider.prevAll("div #ideal_range_threshold_2").children("input[name*='ideal_range_threshold_2']").val(ui.values[1]);
        slider.nextAll("div #ideal_range_threshold_3").children("input[name*='ideal_range_threshold_3']").val(ui.values[2]);
        slider.nextAll("div #ideal_range_threshold_4").children("input[name*='ideal_range_threshold_4']").val(ui.values[3]);
    }

    var doUpdate = function (event, ui) {
        var $slide = $(this).closest('.slide');
        $slide.find('.slide-back').remove();
        $($slide.find('span').get().reverse()).each(function (i) {
            slide_colour(i, $slide, $(this));
        });
    };

    var remove = function (event, ui) {
        var $target = $(event.target);
        if ($target.hasClass('remove')) {
            event.preventDefault();
            // Hide the formset form
            $target.parents(".trait").fadeOut("fast");
            // Flag the form for deletion on POST
            $target.prev("input[name*='DELETE']").val('on');
        }
    };

    var $slide = $('.slide');
    // Update form fields for ideal_ranges to slider values on slide
    $slide.on("slide", function( event, ui) {
        update_form_fields($(this), ui);
    });
    // Initialise slider(s)
    $slide.each(function(index){
        initialise_slider($(this))
    });

    // Set weighting text based on range slider
    $('.weighting').on("input change", "input", function () {  // Both input and change for IE10 and Chrome/Firefox
        set_weighting_text($(this));
    });
    // Set aptitude graph colour based on radio button input
    $('.aptitude-cut-off').on("input change", function () {
        set_aptitude_graph_color($(this));
    });

    // Init. Delete buttons on forms
    $('.form-container').on('click', remove);

    // **************************
    // ADD NEW FORMSET EMPTY FORM
    // **************************

    $('.add-trait').click(function (ev) {
        /* Prepare empty form template. Add functions to newly added objects */
        ev.preventDefault();
        var $this = $(this);
        var $container = $(this).parents('.form-container').first();
        var $setContainer = $(this).siblings('.formset-container').first();

        // Update django formset validation count
        var count = $setContainer.children().length;
        $container.find('[id$=TOTAL_FORMS]').attr('value', count + 1);

        // Add new template
        var templateMarkup = $($this.data('template')).html();
        var compiledTemplate = templateMarkup.replace(/__prefix__/g, count);
        $setContainer.append(compiledTemplate);

        var $traitBlock = $setContainer.find('.trait').last()
        $traitBlock.find('.remove').off().on('click', remove);

        // Initialise new slider (if any)
        var $slide = $traitBlock.find('.slide');
        $slide.each(function (index) {
            initialise_slider($(this));
            // Update form fields for ideal_ranges to slider values on slide
            $(this).on("slide", function( event, ui) {
                update_form_fields($(this), ui);
            });
            // Initialise the colours on newly added slider
            $($(this).find('span').get().reverse()).each(function (i) {
                slide_colour(i, $slide, $(this));
            });
        });

        // Change weighting text on slide (if any)
        $traitBlock.find('.weighting').on("input change", "input", function () {
            set_weighting_text($(this));
        });
        // Set aptitude graph colour based on radio button input (if any)
        $traitBlock.find('.aptitude-cut-off').on("input change", function () {
            set_aptitude_graph_color($(this));
        });
    });
    initialise_graph_colours();
});