$(function () {
    //online
    //$('.spin').spin();
    //$('.spin').spin('show');
    //$('.spin').spin('hide');
    //My Build
    $("#loaderbody").addClass('hide');

    $(document).bind('ajaxStart', function () {
        $("#loaderbody").removeClass('hide');
    }).bind('ajaxStop', function () {
        $("#loaderbody").addClass('hide');
    });
    //Manual Spin
    //$(".spin").addClass('hide');

    //$(document).bind('ajaxStart', function () {
    //    $(".spin").removeClass('hide');
    //}).bind('ajaxStop', function () {
    //    $(".spin").addClass('hide');
    //});
});

//Add jQuery Release Function
//(function () {
//    "use strict";
//    var $, Spinner;

//    $ = jQuery;

//    Spinner = (function () {
//        Spinner.prototype.defaults = {
//            petals: 3
//        };

//        function Spinner($element, options) {
//            this.$element = $element;
//            this.options = $.extend({}, this.defaults, options);
//            this.configure();
//        }

//        Spinner.prototype.show = function () {
//            return this.$element.animate({
//                opacity: 1.0
//            });
//        };

//        Spinner.prototype.hide = function () {
//            return this.$element.animate({
//                opacity: 0.0
//            });
//        };

//        Spinner.prototype.destroy = function () {
//            this.$element.empty();
//            return this.$element.data('spin', void 0);
//        };

//        Spinner.prototype.configure = function () {
//            var $petal, i, _i, _ref, _results;
//            this.$element.empty();
//            _results = [];
//            for (i = _i = 0, _ref = this.options.petals; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
//                $petal = $("<div />");
//                _results.push(this.$element.append($petal));
//            }
//            return _results;
//        };

//        return Spinner;

//    })();

   


function ShowImagePreview(imageUploader) {
    if (imageUploader.files && imageUploader.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#imagePreview").attr('src', e.target.result);
        }
        reader.readAsDataURL(imageUploader.files[0]);
    }
}
$("#uploadId").change(function () {
    ShowImagePreview(this);
});
//General function jQuery Ajax POST can be use for anyTYPE of form with or without Attachment (picture)
function jQueryAjaxPost(form) {
    $.validator.unobtrusive.parse(form);
    if ($(form).valid()) {
        var ajaxConfig = {
            type: 'POST',
            url: form.action,
            data: new FormData(form),
            success: function (response) {
                if (response.success) {                
                    $("#firstTab").html(response.html);
                    refreshAddNewTab($(form).attr('data-restUrl'), true);
                    //success message
                    $.notify(response.message, "success");
                    //Adctivate jQuery Datable Effect
                    if (typeof activatejQueryTable !== 'undefined' && $.isFunction(activatejQueryTable))
                        activatejQueryTable();

                } else {
                    //error message
                    $.notify(response.message, "error");
                }
            }
        }
        if ($(form).attr('enctype') == "multipart/form-data") {
            ajaxConfig["contentType"] = false;
            ajaxConfig["processData"] = false;
        }
        $.ajax(ajaxConfig);
    }
    return false;
}

//Function to refresh and redirect to ViewAll
function refreshAddNewTab(resetUrl, showViewTab)
{
    //Refresh the form and ADD new Record
    $.ajax({
        type: 'GET',
        url: resetUrl,
        success: function (response) {
            $("#secondTab").html(response);
            $('ul.nav.nav-tabs a:eq(1)').html('Add New'); //Show Add New Tab without Record(Blank)
            if (showViewTab)
                $('ul.nav.nav-tabs a:eq(0)').tab('show'); // Show View List
        }
    });
}

//Edit Function
function Edit(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {
            $("#secondTab").html(response);
            $('ul.nav.nav-tabs a:eq(1)').html('Edit Record'); //Show new Edit Tab with Record
            $('ul.nav.nav-tabs a:eq(1)').tab('show'); // Show View List
        }
    });
}

//Delete Function
function Delete(url) {
    if (confirm('Are you sure to Delete this record ?') == true) {
        $.ajax({
            type: 'POST', // bcz Delete
            url: url,
            success: function (response) {
                if (response.success) {
                    $("#firstTab").html(response.html);
                    $.notify(response.message, "warn");
                    //Activate jQuery Datable 
                    if (typeof activatejQueryTable !== 'undefined' && $.isFunction(activatejQueryTable))
                        activatejQueryTable();
                } else {
                    $.notify(response.message, "error");
                }          
               
            }
        });
    }
}