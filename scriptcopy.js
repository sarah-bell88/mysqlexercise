//const bodyParser = require("body-parser");

const baseURL = 'http://flip1.engr.oregonstate.edu:8157/';
const table = document.getElementById('workoutsTable');
const deleteTable = () => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }    
};

const makeTable = (allRows) => {
    //table.appendChild(makeHeaderRow());

    table.innerHTML = makeHeaderRow();

    for (var i = 0; i < allRows.length; i++){
        table.appendChild(makeRow(allRows[i]));
    }
};

const makeHeaderRow = () => {
    var headers = ["id", "name", "reps", "weight", "unit", "date", "update", "delete"];
    let html = "<tr>"
    headers.forEach(function(h){
        html += "<th>"+h+"</th>";
    });
    html += "</tr>";

    return html;
    /*let headerRow = document.createElement("tr");
    headerRow.setAttribute("id", "header");
    var headers = ["id", "name", "reps", "weight", "unit", "date", "update", "delete"];

    for (var i = 0; i < headers.length; i++) {
       let headerCell = document.createElement("th");
       headerCell.appendChild(document.createTextNode(headers[i]));
       headerRow.appendChild(headerCell);
    }
    
    return headerRow;*/
};

const makeRow = (rowData, headerRow = false) => {
    // use data in row to make table data cells
    let newRow = document.createElement("tr")
    var headers = ["id", "name", "reps", "weight", "unit", "date"];
    newRow.setAttribute("id", rowData[0]);

    for (var i = 0; i < headers.length; i++){
        newRow.appendChild(makeCell(headers[i], rowData[i]));
    }

    newRow.appendChild(makeCell("update", "Update"));
    newRow.appendChild(makeCell("delete", "Update"));

    for (var i = 0; i < newRow.length - 1; i++) {
        for (children in node){
            children.setAttribute("id", "Form " + rowData[0]);
        }
    }

    return newRow;
};

const makeCell = (keyVal, contents, headerRow = false) => {
    let newCell = document.createElement("td");

    if (keyVal == "unit") {
        newCell.appendChild(makeDropDown(keyVal, contents));
    } else if (keyVal == "update" || keyVal == "delete") {
        newCell.appendChild(makeButton(keyVal, contents));
    } else if (keyVal == "id") {
        newCell.appendChild(document.createTextNode(contents));
    }
    else {
        var type;
        var input;

        if (keyVal == "name"){
            type = 'text';
            input = contents;
        } else if (keyVal == "date") {
            type = 'date';
            input = contents;
        } else {
            type = 'number';
            input = contents;
        }

        newCell.appendChild(makeInput(type, keyVal, input));
    }
    return newCell;
};

const makeInput = (type, keyVal, value) => {
    
    let newInput = document.createElement("input");
    newInput.setAttribute("type", type);
    newInput.setAttribute("name", keyVal);
    newInput.setAttribute("value", value); 

    newInput.disabled = true;
    return newInput;
};

const makeDropDown = (keyVal, input) => {
    var newSelect = document.createElement("select");
    newSelect.setAttribute("name", keyVal);
    newSelect.setAttribute("id", keyVal);

    var newOption = document.createElement("option");
    newOption.setAttribute("value", "lbs");
    if (newOption.value == input){
        newOption.setAttribute("selected", "selected");
    }
    newOption.appendChild(document.createTextNode("lbs"));
    newSelect.appendChild(newOption);
    newOption = document.createElement("option");
    newOption.setAttribute("value", "kgs");
    if (newOption.value == input){
        newOption.setAttribute("selected", "selected");
    }
    newOption.appendChild(document.createTextNode("kgs"));
    newSelect.appendChild(newOption);

    newOption.disabled = true;

    return newSelect;
}

const makeButton = (id, name) => {
    let newButton = document.createElement("button");
    newButton.setAttribute("id", id);

    newButton.appendChild(document.createTextNode(name));

    return newButton;
};

const enableRow = (row) => {
    for (element in row) {
        //element.disabled = false;
    }
};

const toggleUpdateButton = (rowID) => {
    let tableRow = table.getElementById(rowID);
    let updateButton = tableRow.getElementById("update");

    updateButton.id = "edit";
    updateButton.firstChild.nodeValue = "Done";
    updateButton.setAttribute ("form", rowID);
    updateButton.setAttribute("type", "submit");
    enableRow(tableRow);
};

table.addEventListener('click', async (event) => {
    const target = event.target.closest('button');

    if (!target) return;

    let row = target.parentNode.parentNode;

    if (target.id == "update") {
        toggleUpdateButton(row);
        enableRow(row);
    }

    if (target.id == "edit") {
        let str = {
            id: row.getElementById('id').value,
            name: row.getElementById('name').value,
            reps: row.getElementById('reps').value,
            weight: row.getElementById('weight').value,
            unit: row.getElementById('unit').value,
            date: row.getElementById('date').value,
        }
        
        console.log(str);
            
        let response = await fetch(baseURL, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(str)
        });
        let result = await response.json();

        deleteTable();
        const rowData = getData();
        document.appendChild(makeTable(rowData));
    }

    else if (target.id == "delete") {
        let str = target.parentNode.parentNode.id;

        let response = await fetch(baseURL, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(str)
        });
        event.preventDefault();

        deleteTable();
        const rowData = getData();
        document.appendChild(makeTable(rowData));
    }

    return;
});

const onUpdate = () => {};
const onDelete = () => {
    deleteTable();
    const rowData =  getData();
    document.appendChild(makeTable(rowData));
};

const getData = async () => {
    let response = await fetch(baseURL, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    let tableData = await response.json();

    var rowData =Object.values(JSON.parse(tableData.results)).map(el=>Object.values(el));


    //var rowData = Object.values(JSON.parse(tableData.results)[0]);
    console.log(tableData);
    console.log(rowData);

    return rowData;
};

document.getElementById('addForm').onsubmit = async (event) => {
    event.preventDefault();
    let str = {
        name: document.getElementById('name').value,
        reps: document.getElementById('reps').value,
        weight: document.getElementById('weight').value,
        unit: document.getElementById('unit').value,
        date: document.getElementById('date').value,
    }

    console.log(str);
    
    let response = await fetch(baseURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(str)
    });
    let result = await response.json();

    deleteTable();
    let tableData = await getData();
    if (tableData == 'null') {
        console.log("Add some data.");
        return;
      }
    makeTable(tableData);
};

(async () => {
    deleteTable();
    let tableData = await getData();
    if (tableData == 'null') {
        console.log("Add some data.");
        return;
    }
})();