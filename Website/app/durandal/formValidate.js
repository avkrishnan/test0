define(function () {

    /*---------------------
        
        FORM VALIDATION
    
    ---------------------*/

    var formSettings = {
        singleError: function ($field, rules) {

            $field
                .closest('.field')
                .removeClass('valid')
                .addClass('error');

        },
        singleSuccess: function ($field, rules) {

            $field
                .closest('.field')
                .removeClass('error')
                .addClass('valid');

        },
        overallSuccess: function () {

            alert('Everything is OK, submit!');

        },
        overallError: function ($form, fields) {

            alert('Errors found');

        },
        autoDetect: true,
        debug: true,
        // Add in a new RegExp rule
        regExp: {
            username: /^[a-zA-Z0-9\-_]*$/
        }
    };

    var $validate = $('.form-inline')
            .validate(formSettings)
            .data('validate');

    /*---------------------
    
        Custom validation
    
    */

    $validate.checkMatches = function ($field, toMatch) {

        return $field.val() == $('[name="' + toMatch + '"]').val();

    }

});