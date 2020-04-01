
const formNames = ['signup', 'signin', 'colorscheme'];

const classList = {
    formGeneral: 'form-gen-styles',
    blockInput: 'form-block-input',
    lineInput: 'from-line-input'
};

$(document).ready(function () {

    const contentEl = document.getElementById('content');

    for (let formName of formNames) {
        $.ajax({
            url: `forms/${formName}.json`,
            type: 'GET',
            dataType: 'json',
            success: function (JSONschema) {
                let formObj = new Form(JSONschema, classList);
                formObj.appendSelfTo(contentEl);
            }
        });
    }
});

