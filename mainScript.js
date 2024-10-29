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
});