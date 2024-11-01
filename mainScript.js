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
            let cellContainer = document.createElement("div");
            let dateHolder = document.createElement("p");
            let eventHolder = document.createElement("div");
            cellContainer.classList.add("cellContainer")
            newCell.appendChild(cellContainer);
            cellContainer.appendChild(dateHolder);
            cellContainer.appendChild(eventHolder);
            dateHolder.classList.add("center");
            newCell.addEventListener("click", cellClicked);
            newRow.appendChild(newCell);
        }

        mainTable.appendChild(newRow)
    }

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

    window.addEventListener("resize", resizeElements);
    resizeElements();
    
    //Add function to the month buttons
    let nextMonth = document.getElementById("nextMonth");
    let prevMonth = document.getElementById("prevMonth");

    nextMonth.addEventListener("click", changeNextMonth);
    prevMonth.addEventListener("click", changePrevMonth);

    let form = document.getElementById("appointmentCreatorForm");
    form.addEventListener("submit", appointmentCreate);

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
    writeAppointments();
}

function resizeElements(e){
    let shouldBeTableSize = resizeCalendarTable();
    resizeCalendar();
    resizeCalendarCells(shouldBeTableSize);
    resizeAppointmentView();
    writeCalendar();
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

    return calendarWantedSize;
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
    let selectedDate = document.getElementById("selectedDate");
    let parent = document.getElementById("sidePanel");

    let appointmentFormHeight = getAbsoluteHeightFromElement(appointmentForm);
    let selectedDateHeight = getAbsoluteHeightFromElement(selectedDate);
    let totalHeight = getAbsoluteHeightFromElement(parent);

    let remainingHeight = totalHeight - appointmentFormHeight - selectedDateHeight;

    appointmentViewer.style.height = remainingHeight + "px";
}

function resizeCalendarCells(size){
    let cells = document.querySelectorAll("#mainTable td");
    let table = document.getElementById("mainTable");

    for (cell of cells){
        let cellContainer = cell.firstElementChild;
        cellContainer.style.height = (size - 20) / 6 - 8 + "px";
    }
}
function writeCalendar(){
    let totalDays = daysInMonth(calMonth, calYear);
    let currentDay = 1;
    let dayOfTheWeekToStart = new Date(calYear, calMonth, 1).getDay();

    let calendarRows = document.querySelectorAll("#mainTable tr[class=\"calendarRow\"]");
    let monthlyAppointments = JSON.parse(localStorage.getItem(calMonth.toString() + calYear));

    monthlyAppointments = monthlyAppointments != null ? monthlyAppointments : {};

    let cellsRunThrough = 0;
    for (row of calendarRows){
        let cells = row.children;
        for (cell of cells){
            cell = cell.firstElementChild;
            let date = cell.firstElementChild;
            let events = cell.lastElementChild;
            let dayAppointments = monthlyAppointments["d" + currentDay];
            dayAppointments = dayAppointments != null ? dayAppointments : []

            events.textContent = "";
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
                
                //Write appointments on the small card
                //Take how many events are remaining, we need to figure out how many can fit on the screen
                let amOfEvents = dayAppointments.length;
                let remainingHeight = parseFloat(getComputedStyle(cell).height) - 50;
                for (let i = 0; i < dayAppointments.length; i++){
                    let text = "";
                    if (remainingHeight - 26 < 26){
                        text = "+" + amOfEvents + " more";
                        i = dayAppointments.length;
                    }
                    else {
                        text = dayAppointments[i]["name"];
                    }


                    let newEvent = document.createElement("p");
                    newEvent.textContent = text;
                    newEvent.classList.add("calendarEvent");
                    newEvent.classList.add("center");
                    events.appendChild(newEvent);

                    remainingHeight -= 26;
                    amOfEvents--;
                }
            }
            currentDay++;
        }
    }
}

//Write the appointments on the left side of the screen
function writeAppointments(){
    //Gets the daily appointments from storage
    let monthlyAppointments = JSON.parse(localStorage.getItem(month.toString() + year));
    monthlyAppointments = monthlyAppointments != null ? monthlyAppointments : {};

    let dateAppointments = monthlyAppointments["d" + day];
    dateAppointments = dateAppointments != null ? dateAppointments : [];

    //Wipe currently displaying appointments
    let appointmentContainer = document.getElementById("appointmentShow");
    appointmentContainer.textContent = "";


    for (appointment of dateAppointments){
        //All appointment details are part of another general div
        let newContainer = document.createElement("div");
        let appointmentTitle = document.createElement("h3");
        let appointmentTimes = document.createElement("p");
        let appointmentDesc = document.createElement("p");

        //Only want title and time to be centered
        appointmentTitle.classList.add("center");
        appointmentTimes.classList.add("center");
        
        //Inputs the stored appointment into the elements
        appointmentTitle.textContent = appointment.name;
        appointmentTimes.textContent = appointment.start + " - " + appointment.end;
        appointmentDesc.textContent = appointment.description;

        //Adds them to new div and then finnaly appends it to the main container
        newContainer.appendChild(appointmentTitle);
        newContainer.appendChild(appointmentTimes);
        newContainer.appendChild(appointmentDesc);

        appointmentContainer.appendChild(newContainer);
    }
}

function cellClicked(e){
    let cell = e.currentTarget;
    let dateS = cell.firstElementChild.textContent;
    let date = parseInt(dateS);

    if (date > 0){
        day = date;
        month = calMonth;
        year = calYear;
        newDate();
    }
}

//For storage, it will work like this:
//Each key for localstorage will be a monthyear combo
//Value will be a object storing vars with key days as d#
//Each value will be a list of appointments
//Each appointment is a object with name, start, end, description
function appointmentCreate(e){
    e.preventDefault();
    let name = document.getElementById("appointmentName").value;
    let start = document.getElementById("inTime").value;
    let end = document.getElementById("endTime").value;
    let description = document.getElementById("description").value;

    let newAppointment = {
        name:name,
        start:start,
        end:end,
        description:description
    };

    let monthAppointments = JSON.parse(localStorage.getItem(month.toString() + year));

    if (monthAppointments == null){
        monthAppointments = {};
    }

    dayAppointments = monthAppointments["d" + day];

    if (dayAppointments == null){
        dayAppointments = [];
        monthAppointments["d" + day] = dayAppointments;
    }

    dayAppointments.push(newAppointment);

    let monthAppointmentsString = JSON.stringify(monthAppointments);

    localStorage.setItem(month.toString() + year, monthAppointmentsString);

    writeCalendar();
    writeAppointments();
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