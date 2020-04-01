
const types = {
    form: 'form',
    input: 'input',
    label: 'label',
    plainText: 'text without ref',
    datalist: 'datalist',
};

class Form {

    constructor(JSONschema, classList = {}) {
        this.name = JSONschema.name;
        this.classList = classList;
        this.fields = [];
        this.refs = [];
        this.btns = [];

        let fieldsCount = 0;
        for (let field of JSONschema.fields) {
            let id = `${this.name}_${types.input}_${fieldsCount++}`;
            this.fields.push(new Field(field, id));
        }

        if (JSONschema.references) {
            for (let reference of JSONschema.references) {
                this.refs.push(new Reference(reference));
            }
        }

        if (JSONschema.buttons) {
            for (let button of JSONschema.buttons) {
                this.btns.push(new Button(button));
            }
        }

        this._buildView();
    }

    _buildView() {
        this.view = document.createElement(types.form);
        this.view.setAttribute('name', this.name);
        this.view.classList.add(this.classList.formGeneral);

        for (let field of this.fields) {
            for (let prop in field.elements) {
                if (field.elements.hasOwnProperty(prop) && field.elements[prop]) {
                    this.view.appendChild(field.elements[prop]);
                }
            }
        }

        for (let reference of this.refs) {
            this.view.appendChild(reference.refEl);
        }

        for (let button of this.btns) {
            this.view.appendChild(button.btnEl);
        }
    }

    appendSelfTo(node) {
        node.appendChild(this.view);
    }
}

class Field {

    static extraordinaryTypes = {
        color: 'color',
        checkbox: 'checkbox'
    };

    constructor(field, id) {
        this.id = id;
        this.elements = {
            label: false,
            input: false,
            datalist: false,
        };

        for (let elementType in field) {
            if (field.hasOwnProperty(elementType)) {
                this.elements[elementType] = document.createElement(elementType);

                if (elementType === types.label) {
                    this.elements[elementType].innerText = field[elementType];
                    this.elements[elementType].setAttribute('for', this.id);
                }
                else {
                    field[elementType].id = this.id;
                    this._makeFormattedInputEl(field[elementType]);
                }
            }
        }
    }

    _makeFormattedInputEl(inputItem) {
        if (inputItem.type in Field.extraordinaryTypes) {
            if (inputItem.type === Field.extraordinaryTypes.color) {
                this._makeColorInputEl(inputItem);
            }
            else if (inputItem.type === Field.extraordinaryTypes.checkbox) {
                this._makeCheckboxInputEl(inputItem);
            }
        }
        else this._makeGenericInputEl(inputItem);
    }

    _makeGenericInputEl(inputItem) {
        for (let attr in inputItem) {
            if (inputItem.hasOwnProperty(attr)) {
                $(this.elements.input).prop(attr, inputItem[attr]);
                this.elements.input.classList.add(classList.blockInput)
            }
        }
    }

    _makeColorInputEl(inputItem) {
        $(this.elements.input).prop('type', inputItem.type);

        if (inputItem.hasOwnProperty('colors')) {
            this.elements.datalist = document.createElement(types.datalist);
            this.elements.datalist.id = `${this.id}_list`;
            this.elements.input.setAttribute('list', this.elements.datalist.id);

            for (let i = 0; i < inputItem.colors.length; i++) {
                let optionEl = document.createElement('option');
                optionEl.value = inputItem.colors[i];
                this.elements.datalist.appendChild(optionEl);
            }

            this.elements.input.value = inputItem.colors[0];
        }
    }

    _makeCheckboxInputEl(inputItem) {
        for (let attr in inputItem) {
            if (inputItem.hasOwnProperty(attr)) {
                $(this.elements.input).prop(attr, inputItem[attr]);
                this.elements.input.classList.add(classList.lineInput)
            }
        }
    }

}

class Input {

    constructor(props) {
        
    }
}

class TextInput extends Input {

    constructor() {
        super();
    }
}

class EmailInput extends Input {

    constructor() {
        super();
    }
}

class PasswordInput extends Input {

    constructor() {
        super();
    }
}

class CheckboxInput extends Input {

    constructor() {
        super();
    }
}

class ColorInput extends Input {

    constructor() {
        super();
    }
}

class Reference {

    constructor(reference) {
        this.refEl = document.createElement('p');
        let aEl = document.createElement('a');
        aEl.setAttribute('href', `${reference.ref}.html`);
        aEl.innerText = reference['text'];
        aEl.onclick = () => {return false;};

        if (reference.hasOwnProperty(types.plainText)) {
            this.refEl.innerText = reference[types.plainText] + ' ';
        }

        this.refEl.appendChild(aEl);
    }
}

class Button {

    constructor(button) {
        this.btnEl = document.createElement('button');
        this.btnEl.innerText = button['text'];
    }
}