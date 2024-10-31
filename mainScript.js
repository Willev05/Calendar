const monthStrings = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var day;
var month;
var year;

var todayDay;
var todayMonth;
var todayYear;

var calMonth;
var calYear;


document.addEventListener("DOMContentLoaded", function(){
    let mainTable = document.getElementById("mainTable").firstElementChild;

    //Creates the basic semantic table
    for (let i = 0; i < 6; i++){
        let newRow = document.createElement("tr");
        newRow.classList.add("calendarRow");

        for (let j = 0; j < 7; j++){
            let newCell = document.createElement("td");
            let dateHolder = document.createElement("p");
            newCell.append(dateHolder);
            dateHolder.classList.add("center");
            newCell.addEventListener("click", cellClicked);
            newRow.appendChild(newCell);
        }

        mainTable.appendChild(newRow)
    }

    window.addEventListener("resize", resizeElements);
    resizeElements();

    //After all semantics are done!
    //Get the date and write at required places
    const date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();

    todayDay = day;
    todayMonth = month;
    todayYear = year;

    calMonth = month;
    calYear = year;

    newDate();
    newMonth();
    //Add function to the month buttons
    let nextMonth = document.getElementById("nextMonth");
    let prevMonth = document.getElementById("prevMonth");

    nextMonth.addEventListener("click", changeNextMonth);
    prevMonth.addEventListener("click", changePrevMonth);

});

function changeNextMonth(e){
    if (calMonth + 1 > 11){
        calMonth = 0;
        calYear += 1;
    }
    else{
        calMonth += 1;
    }

    newMonth();
}

function changePrevMonth(e){
    if (calMonth - 1 < 0){
        calMonth = 11;
        calYear -= 1;
    }
    else{
        calMonth -= 1;
    }

    newMonth();
}

function newMonth(){
    writeCalendar();
    updateMonthDisplay();
}

function newDate(){
    updateDateDisplay();
    updateMonthDisplay();
    writeCalendar();
}

function resizeElements(e){
    resizeCalendarTable();
    resizeCalendar();
    resizeAppointmentView();
}

function resizeCalendarTable(){
    //Get all required elements
    let calendar = document.getElementById("calendar");
    let mainTable = document.getElementById("mainTable");
    let siblings = document.querySelectorAll("#calendar > *")

    //Set some heights for later use
    let calendarTotalHeight = getAbsoluteHeightFromElement(calendar); 
    let totalSiblingHeight = 0;

    for (sibling of siblings){
        //Exclude table as is going to be resized later
        if (sibling.id == "mainTable"){
            continue;
        }

        
        totalSiblingHeight += getAbsoluteHeightFromElement(sibling);
    }

    let calendarRemainingSize = calendarTotalHeight - totalSiblingHeight;

    //We only want part of it as to not stick to corners of screen
    let calendarWantedSize = calendarRemainingSize * 0.95;

    mainTable.style.height = calendarWantedSize + "px";
}

function updateMonthDisplay(){
    let header = document.getElementById("monthHeader");
    let monthString = monthStrings[calMonth];
    let yearString = calYear.toString();

    header.textContent = monthString + " " + yearString;
}

function updateDateDisplay(){
    let header = document.getElementById("selectedDate");
    let dayString = day.toString();
    let monthString = monthStrings[month];
    let yearString = year.toString();

    header.textContent = dayString + " " + monthString + " " + yearString;
}

function resizeCalendar(){
    //Get the two main divs
    let sidePanel = document.getElementById("sidePanel");
    let calendar = document.getElementById("calendar");
    let parent = document.getElementById("pageParent");
    
    let sidePanelWidth = parseFloat(getComputedStyle(sidePanel).width);
    let totalWidth = parseFloat(getComputedStyle(parent).width);
    

    let remainingWidth = totalWidth - sidePanelWidth;

    calendar.style.width = remainingWidth + "px";
}

function resizeAppointmentView(){
    let appointmentForm = document.getElementById("appointmentCreator");
    let appointmentViewer = document.getElementById("appointmentShow");
    let parent = document.getElementById("sidePanel");

    let appointmentFormHeight = getAbsoluteHeightFromElement(appointmentForm);
    let totalHeight = getAbsoluteHeightFromElement(parent);

    let remainingHeight = totalHeight - appointmentFormHeight;

    appointmentViewer.style.height = remainingHeight + "px";
}

function writeCalendar(){
    let totalDays = daysInMonth(calMonth, calYear);
    let currentDay = 1;
    let dayOfTheWeekToStart = new Date(calYear, calMonth, 1).getDay();

    let calendarRows = document.querySelectorAll("#mainTable tr[class=\"calendarRow\"]");

    let cellsRunThrough = 0;
    for (row of calendarRows){
        let cells = row.children;
        for (cell of cells){
            let date = cell.firstElementChild;
            date.textContent = "";
            date.classList.remove("today");
            cell.classList.remove("selected");
            cellsRunThrough++;
            if (cellsRunThrough < dayOfTheWeekToStart + 1){
                continue;
            }

            if (currentDay <= totalDays){
                if (todayDay == currentDay && todayMonth == calMonth && todayYear == calYear){
                    date.classList.add("today");
                }
                if (day == currentDay && month == calMonth && year == calYear){
                    cell.classList.add("selected");
                }

                date.textContent = currentDay.toString();
                cell.appendChild(date);
            }
            currentDay++;
        }
    }
}

function cellClicked(e){
    let cell = e.target;
    let dateS = cell.firstElementChild.textContent;
    let date = parseInt(dateS);

    if (date > 0){
        day = date;
        month = calMonth;
        year = calYear;
        newDate();
    }
}

//Helper functions

//Gets absolute height by adding margin. Returns a float !! border-box model is already in use !!
function getAbsoluteHeightFromElement(element){
    let elementStyle = getComputedStyle(element);

    //Gets both the border-box values and then margin
    let elementHeightFromStyle = parseFloat(elementStyle.height);
    let elementMarginFromStyle = parseFloat(elementStyle.marginTop) + parseFloat(elementStyle.marginBottom);

    let elementAbsoluteHeight = elementHeightFromStyle + elementMarginFromStyle;
    
    return elementAbsoluteHeight;
}

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}