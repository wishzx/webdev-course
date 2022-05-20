"use-strict";

class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
    }

    render(dateobject) {
        let root = document.getElementById(this.id);
        root.innerHTML = "";
        root.appendChild(this._createCalendar(dateobject));
    }

    _createCalendar(dateobject) {
        let table = document.createElement("table");

        this._addTableHeader(table, dateobject);

        let selectedMonth = dateobject.getMonth();
        //create a new date object to scroll throw the calendar and set it to the first day of the month
        let scrollingDate = new Date(dateobject);
        scrollingDate.setDate(1);
        // subtract the offset from previous sunday and get the sunday of the previous month ( or current if the first day of the current month is a sunday)
        const previousMonthDays = scrollingDate.getDay();
        scrollingDate.setDate(1 - previousMonthDays);
        //now we can start scrolling and fill the calendar 

        console.log(scrollingDate);

        //outer loop to create rows (between 4 and 6)
        for (let week = 0; week < 6; week++) {
            let weekRow = table.insertRow(-1);


            // inner loop to create cells
            for (let day = 0; day < 7; day++) {
                let dayCell = weekRow.insertCell();
                dayCell.textContent = scrollingDate.getDate();

                if (selectedMonth === scrollingDate.getMonth()) {

                    let callback_date = {
                        month: scrollingDate.getMonth() + 1,
                        day: scrollingDate.getDate(),
                        year: scrollingDate.getFullYear()
                    };

                    dayCell.addEventListener("click", () => { this._selectedDateEventCallback(this.id, this.callback, callback_date); });
                }
                else {
                    dayCell.style.color = '#8a8a8a';
                }

                scrollingDate.setDate(scrollingDate.getDate() + 1);

            }

            // break if the new week is in the next month
            if (selectedMonth !== scrollingDate.getMonth()) { break; }


        }

        return table;
    }

    _addTableHeader(table, dateobject) {
        let header = table.createTHead();


        let controlRow = header.insertRow(0);

        let leftArrow = controlRow.insertCell(0);
        leftArrow.textContent = " < ";
        leftArrow.setAttribute("id", "LeftArrow");

        let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = controlRow.insertCell(1);
        month.textContent = months[dateobject.getMonth()] + " " + dateobject.getFullYear();
        // total columns number is 7 ( number of days of the week) so since the control row has 3 element , the date cell has to span 5 cells (1+5+1)
        month.colSpan = "5";


        let rightArrow = controlRow.insertCell(2);
        rightArrow.textContent = " > ";
        rightArrow.setAttribute("id", "RightArrow");

        leftArrow.addEventListener("click", () => { this._changeMonth(dateobject, -1); });
        rightArrow.addEventListener("click", () => { this._changeMonth(dateobject, +1); });

        let daysRow = header.insertRow(1);

        let days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        days.forEach(day => {
            let cell = daysRow.insertCell();
            cell.textContent = day;
        });

    }

    _changeMonth(dateobject, direction) {
        dateobject.setMonth(dateobject.getMonth() + direction);
        this.render(dateobject);

    }
    _selectedDateEventCallback(id, callback, date) {
        callback(id, date);

    }
}

