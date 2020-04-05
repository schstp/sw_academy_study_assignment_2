
$(document).ready(function () {

    const formNames = ['signup', 'signin', 'colorscheme', 'addpost', 'interview'];

    const stylesClassDict = {
        form: 'form-gen-styles',
        fieldsSection: 'form-fields-section',
        referencesSection: 'form-references-section',
        buttonsSection: 'form-buttons-section',
        input: 'form-generic-input',
        textInput: 'form-text-input',
        textareaInput: 'form-textarea-input',
        emailInput: 'form-email-input',
        passwordInput: 'form-password-input',
        checkboxInput: 'form-checkbox-input',
        colorInput: 'form-color-input',
        fileInput: 'form-file-input',
        dateInput: 'form-date-input',
        numberInput: 'form-number-input',
        multipleChoiceInput: 'form-multiple-choice-input',
        ref: 'form-ref-gen',
        refContainer: 'form-ref-container',
        refCheckbox: 'form-ref-checkbox',
        btn: 'form-button',
        cancelBtn: 'form-cancel-btn',
        label: 'form-label',
        wrappers: {
            generic: 'generic-field-wrapper',
            checkbox: 'checkbox-field-wrapper',
            checkboxClicked: 'checkbox-field-clicked',
            color: 'color-field-wrapper',
        },
        fileSelectorBtn: 'form-file-input-btn',
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

