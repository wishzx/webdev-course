"use-strict";
class TableTemplate {
    constructor() { }
    static fillIn(id, dictionary, columnName) {
        let table = document.getElementById(id);
        let rows = table.rows;
        let processor = new Cs142TemplateProcessor("");

        let header = rows[0];
        processor.template = header.innerHTML;
        header.innerHTML = processor.fillIn(dictionary);

        let columns = [];
        let columnNumber = header.cells.length;

        if (columnName === undefined) {
            columns = [...Array(columnNumber).keys()];

        } else {
            let found = false;
            for (let i = 0; i < columnNumber; i++) {
                if (header.cells[i].textContent === columnName) {
                    columns = [i];
                    found = true;
                }
            }
            if (!found) {
                columns = [];
            }
        }

        columns.forEach(col => {

            for (let index = 1; index < rows.length; index++) {
                let row = rows[index];
                let value = row.cells[col];
                processor.template = value.innerHTML;
                value.innerHTML = processor.fillIn(dictionary);
            }
        });

        if (table.style.visibility === "hidden") {
            table.style.visibility = "visible";
        }
    }
}

