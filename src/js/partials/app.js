
$(document).ready(function () {

    const formNames = ['signup', 'signin', 'colorscheme'];

    const stylesClassDict = {
        form: 'form-gen-styles',
        input: 'form-generic-input',
        textInput: 'form-text-input',
        emailInput: 'form-email-input',
        passwordInput: 'form-password-input',
        checkboxInput: 'form-checkbox-input',
        colorInput: 'form-color-input',
        ref: 'form-ref-gen',
        refContainer: 'form-ref-container',
        btn: 'form-button',
        label: 'form-label',
        wrappers: {
            generic: 'generic-field-wrapper',
            checkbox: 'checkbox-field-wrapper',
            checkboxClicked: 'checkbox-field-clicked',
            color: 'color-field-wrapper',
        }
    };

    const contentEl = document.getElementById('content');

    for (let formName of formNames) {
        $.ajax({
            url: `forms/${formName}.json`,
            type: 'GET',
            dataType: 'json',
            success: function (JSONschema) {
                let formObj = new Form({JSONschema: JSONschema, stylesClassDict: stylesClassDict});
                formObj.appendSelfTo(contentEl);
            }
        });
    }
});

