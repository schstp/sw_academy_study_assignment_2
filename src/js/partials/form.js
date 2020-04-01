
class Form {

    static _formElementTypes = {
        fields: (props) => {return new Field(props)},
        buttons: (props) => {return new Button(props)},
        references: (props) => {return new Reference(props)},
    };

    constructor(props) {
        this.data = {};
        this.data.name = props.JSONschema.name;

        for (let typeName in props.JSONschema) {
            if (props.JSONschema.hasOwnProperty(typeName) && typeName !== 'name') {
                let elementsCount = 0;
                this.data[typeName] = [];
                for (let item of props.JSONschema[typeName]) {
                    this.data[typeName].push(Form._formElementTypes[typeName]({
                        id: `${props.JSONschema.name}_${typeName}_${elementsCount++}`,
                        item: item,
                        stylesClassDict: props.stylesClassDict,
                    }))
                }
            }
        }

        this._buildView(props.stylesClassDict);
    }

    _buildView(stylesClassDict) {
        this.view = document.createElement('form');
        this.view.setAttribute('name', this.data.name);
        this.view.classList.add(stylesClassDict.form);

        for (let list in this.data) {
            if (this.data.hasOwnProperty(list) && this.data[list] instanceof Array) {
                for (let elem of this.data[list]) this._addElemToView(elem.view);
            }
        }
    }

    _addElemToView (elem) {

        for (let childElemName in elem) {
            if (elem.hasOwnProperty(childElemName)) {
                if (elem[childElemName].nodeType) {
                    this.view.appendChild(elem[childElemName]);
                }
                else {
                    this._addElemToView(elem[childElemName]);
                }
            }
        }
    }

    appendSelfTo(node) {
        node.appendChild(this.view);
    }
}


class Input {

    static _standardAttrs = ['id', 'autocomplete', 'autofocus', 'disabled', 'form', 'formnovalidate', 'name',
        'accept', 'alt', 'checked', 'dirname', 'formaction', 'formenctype', 'formmethod',
        'formtarget', 'height', 'list', 'max', 'min', 'maxlength', 'multiple', 'pattern',
        'placeholder', 'readonly', 'required', 'size', 'src', 'step', 'type', 'value', 'width'];

    constructor(props) {
        this.data = {};
        this.view = {};
        this.view.input = document.createElement('input');
        this.view.input.classList.add(props.stylesClassDict.input);

        props.item.id = props.id;

        for (let attr in props.item) {
            if (props.item.hasOwnProperty(attr) && Input._standardAttrs.includes(attr)) {
                this.data[attr] = props.item[attr];
                if (attr === 'list') {
                    this.view.input.setAttribute(attr, this.data[attr]);
                }
                else {
                    $(this.view.input).prop(attr, this.data[attr]);
                }
            }
        }
    }
}

class TextInput extends Input {

    _type = 'text';

    constructor(props) {
        super(props);
        this.view.input.classList.add(props.stylesClassDict.textInput);
    }
}

class EmailInput extends Input {

    _type = 'email';

    constructor(props) {
        super(props);
        this.view.input.classList.add(props.stylesClassDict.emailInput);
    }
}

class PasswordInput extends Input {

    _type = 'password';

    constructor(props) {
        super(props);
        this.view.input.classList.add(props.stylesClassDict.passwordInput);
    }
}

class CheckboxInput extends Input {

    _type = 'checkbox';

    constructor(props) {
        super(props);
        this.view.input.classList.add(props.stylesClassDict.checkboxInput);
    }
}

class ColorInput extends Input {

    _type = 'color';

    constructor(props) {

        if (props.item.hasOwnProperty('colors')) {
            props.item.list = `${props.id}_list`;
            props.item.value = props.item.colors[0];
            super(props);
            this.data.datalist = new DataList({values: props.item.colors, id: this.data.list});
            this.view.datalist = this.data.datalist.view;
        }
        else {
            super(props);
        }

        this.view.input.classList.add(props.stylesClassDict.colorInput);
    }
}

class DataList {

    constructor(props) {
        this.data = props;
        this.view = {};
        this.view.datalist = document.createElement('datalist');
        this.view.datalist.id = this.data.id;

        for (let i = 0; i < this.data.values.length; i++) {
            let optionEl = document.createElement('option');
            optionEl.value = this.data.values[i];
            this.view.datalist.appendChild(optionEl);
        }
    }

}

class Label {

    constructor(props) {
        this.data = {
            for: props.id,
            text: props.item,
        };
        this.view = {};
        this.view.label = document.createElement('label');
        this.view.label.innerText = this.data.text;
        this.view.label.setAttribute('for', this.data.for);
        this.view.label.classList.add(props.stylesClassDict.label);
    }
}


class Field {

    static _types = {
        label: (props) => { return new Label(props) },
        input: (props) => { return new Field._inputTypes[props.item.type](props) },
    };

    static _inputTypes = {
        text: TextInput,
        email: EmailInput,
        password: PasswordInput,
        checkbox: CheckboxInput,
        color: ColorInput,
    };

    constructor(props) {
        this.id = props.id;
        this.data = {};
        this.view = {};
        this.view.container = document.createElement('div');

        for (let elementType in props.item) {
            if (props.item.hasOwnProperty(elementType)) {
                this.data[elementType] = Field._types[elementType]({
                    id: this.id,
                    item: props.item[elementType],
                    stylesClassDict: props.stylesClassDict,
                });
                this._addElemToView(this.data[elementType].view, props.stylesClassDict);
            }
        }
    }

    _addElemToView (elem, stylesClassDict) {
        for (let childElemName in elem) {
            if (elem.hasOwnProperty(childElemName)) {
                if (elem[childElemName].nodeType) {
                    this.view.container.appendChild(elem[childElemName]);
                    this._addFieldWrapper(elem[childElemName], stylesClassDict);
                }
                else {
                    this._addElemToView(elem[childElemName]);
                }
            }
        }
    }

    _addFieldWrapper (elem, stylesClassDict) {
        if (elem.tagName === 'INPUT') {

            if (elem.type === 'checkbox') {
                this.view.container.classList.add(stylesClassDict.wrappers.checkbox);
                $(this.view.container).on('click', function (e) {
                    e.preventDefault();
                    $(elem).prop('checked', !elem.checked);
                    $(this).toggleClass(stylesClassDict.wrappers.checkboxClicked);
                })
            }
            else if (elem.type === 'color') {
                this.view.container.classList.add(stylesClassDict.wrappers.color);
            }
            else {
                this.view.container.classList.add(stylesClassDict.wrappers.generic);
            }
        }
    }
}


class Reference {

    static _plaintText = 'text without ref';

    constructor(props) {
        this.data = {
            href: `${props.item.ref}.html`,
            text: props.item.text,
            description: props.item.hasOwnProperty(Reference._plaintText) ? props.item[Reference._plaintText] + ' ' : ''
        };

        this.view = {};
        this.view.p = document.createElement('p');
        let aEl = document.createElement('a');
        aEl.setAttribute('href', this.data.href);
        aEl.innerText = this.data.text;
        aEl.classList.add(props.stylesClassDict.ref);
        aEl.onclick = () => {return false;};
        this.view.p.appendChild(document.createTextNode(this.data.description));
        this.view.p.appendChild(aEl);
        this.view.p.classList.add(props.stylesClassDict.refContainer);
    }
}

class Button {

    constructor(props) {
        this.data = {
            text: props.item.text,
        };

        this.view = {};
        this.view.button = document.createElement('button');
        this.view.button.innerText = this.data.text;
        this.view.button.classList.add(props.stylesClassDict.btn);
    }
}