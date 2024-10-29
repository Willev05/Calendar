document.addEventListener("DOMContentLoaded", function(){
    let mainTable = document.getElementById("mainTable");

    for (let i = 0; i < 5; i++){
        let newRow = document.createElement("tr");

        for (let j = 0; j < 7; j++){
            let newCell = document.createElement("td");
            newRow.appendChild(newCell);
        }

        mainTable.appendChild(newRow)
    }

    window.addEventListener("resize", resizeElements)
});



function resizeElements(e){
    resizeCalendarTable();
}

function resizeCalendarTable(){
    let calendar = document.getElementById("calendar");
    let mainTable = document.getElementById("mainTable");
    let siblings = document.querySelectorAll("#calendar > *")

    let calendarTotalHeight = getAbsoluteHeightFromElement(calendar);
    let totalSiblingHeight = 0;

    for (sibling of siblings){
        if (sibling.id == "mainTable"){
            console.log("Skipping " + sibling);
            continue;
        }
        totalSiblingHeight += getAbsoluteHeightFromElement(sibling);
    }
    console.log("Total Calendar Height: " + calendarTotalHeight);
    console.log("Total Sibling height: " + totalSiblingHeight);
    let calendarRemainingSize = calendarTotalHeight - totalSiblingHeight;

    mainTable.setAttribute("height", calendarRemainingSize + "px");
}

function getAbsoluteHeightFromElement(element){
    let elementStyle = getComputedStyle(element);

    let elementHeightFromStyle = parseInt(elementStyle.height);
    let elementPaddingFromStyle = parseInt(elementStyle.paddingTop) + parseInt(elementStyle.paddingBottom);
    let elementMarginFromStyle = parseInt(elementStyle.marginTop) + parse;

    let elementAbsoluteHeight = elementHeightFromStyle + elementPaddingFromStyle;
    
    return elementAbsoluteHeight;
}