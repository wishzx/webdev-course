"use-strict";

function Cs142TemplateProcessor(template) {
    this.template = template;

    const regex = /{{(.*?)}}/;
    this.fillIn = function (dictionary) {
        let template = this.template;
        if (typeof dictionary !== "object") {
            return;
        }

        let match = null;
        do {
            match = regex.exec(template);
            if (match !== null) {
                let repl = dictionary[match[1]] || "";
                console.log(repl);
                template = template.replace(regex, repl);
            }
        } while (match !== null);

        return template;


    };
}


// var template = 'My favorite month is {{month}} but not the day {{day}} or the year {{year}}';
// var dateTemplate = new Cs142TemplateProcessor(template);

// var dictionary = { month: 'July', day: '1', year: '2016' };
// var str = dateTemplate.fillIn(dictionary);
// console.log(str);

// console.log(str === 'My favorite month is July but not the day 1 or the year 2016');

// //Case: property doesn't exist in dictionary
// var dictionary2 = { day: '1', year: '2016' };
// var str = dateTemplate.fillIn(dictionary2);
// console.log(str);
// console.log(str === 'My favorite month is  but not the day 1 or the year 2016');
