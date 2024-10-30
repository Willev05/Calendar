document.addEventListener("DOMContentLoaded", function(){
    let mainTable = document.getElementById("mainTable").firstElementChild;

    //Creates the basic semantic table
    for (let i = 0; i < 5; i++){
        let newRow = document.createElement("tr");

        for (let j = 0; j < 7; j++){
            let newCell = document.createElement("td");
            newRow.appendChild(newCell);
        }

        mainTable.appendChild(newRow)
    }

    window.addEventListener("resize", resizeElements)
    resizeElements();
});



function resizeElements(e){
    resizeCalendarTable();
    resizeSidePanel();
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

    //mainTable.setAttribute("height", calendarWantedSize + "px");
    mainTable.style.height = calendarWantedSize + "px";
}

function resizeSidePanel(){
    //Get the two main divs
    let sidePanel = document.getElementById("sidePanel");
    let calendar = document.getElementById("calendar");
    let parent = document.getElementById("pageParent");
    
    let sidePanelWidth = parseFloat(getComputedStyle(sidePanel).width);
    let totalWidth = parseFloat(getComputedStyle(parent).width);
    
    console.log(sidePanelWidth, totalWidth);

    let remainingWidth = totalWidth - sidePanelWidth;

    console.log(remainingWidth)
    calendar.style.width = remainingWidth + "px";
}

//Gets absolute height by adding margin. Returns a float !! border-box model is already in use !!
function getAbsoluteHeightFromElement(element){
    let elementStyle = getComputedStyle(element);

    //Gets both the border-box values and then margin
    let elementHeightFromStyle = parseFloat(elementStyle.height);
    let elementMarginFromStyle = parseFloat(elementStyle.marginTop) + parseFloat(elementStyle.marginBottom);

    let elementAbsoluteHeight = elementHeightFromStyle + elementMarginFromStyle;
    
    return elementAbsoluteHeight;
}