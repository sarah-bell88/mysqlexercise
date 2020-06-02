//const bodyParser = require("body-parser");

const baseURL = 'http://flip1.engr.oregonstate.edu:8157/';
const table = document.getElementById('workoutsTable');
const deleteTable = () => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }    
};

const makeTable = (allRows) => {
    console.log("Made it to Make Table");

    table.innerHTML = makeHeaderRow();
    console.log("Made it past Make HR")

    for (var i = 0; i < allRows.length; i++){
        table.appendChild(makeRow(allRows[i]));
    }
};

const makeHeaderRow = () => {
    console.log("Made it to Make HR");
    var headers = ["id", "name", "reps", "weight", "unit", "date", "update", "delete"];
    let html = "<tr>"
    headers.forEach(function(h){
        html += "<th>"+h+"</th>";
    });
    html += "</tr>";

    console.log(html);

    return html;
};

const makeRow = (rowData, headerRow = false) => {
    // use data in row to make table data cells
    let newRow = document.createElement("tr")
    var headers = ["id", "name", "reps", "weight", "unit", "date"];
    newRow.setAttribute("id", rowData[0]);

    for (var i = 0; i < headers.length; i++){
        newRow.appendChild(makeCell(rowData[0], headers[i], rowData[i]));
    }

    newRow.appendChild(makeCell(rowData[0], "update", "Update"));
    newRow.appendChild(makeCell(rowData[0], "delete", "Delete"));

    return newRow;
};

const makeCell = (id, keyVal, contents, headerRow = false) => {
    let newCell = document.createElement("td");

    if (keyVal == "unit") {
        newCell.appendChild(makeDropDown(id, keyVal, contents));
    } else if (keyVal == "update" || keyVal == "delete") {
        newCell.appendChild(makeButton(id, keyVal, contents));
    } else if (keyVal == "id") {
        newCell.appendChild(document.createTextNode(contents));
    }
    else {
        var type;
        var input;
        var newForm = document.createElement("form");
        newForm.setAttribute("id", "row-" + id);

        if (keyVal == "name"){
            type = 'text';
            input = contents;
        } else if (keyVal == "date") {
            type = 'date';
            input = contents.substring(0,10);
        } else {
            type = 'number';
            input = contents;
        }

        newForm.appendChild(makeInput(type, keyVal, input));
        newCell.appendChild(newForm);
    }
    return newCell;
};

const makeInput = (type, keyVal, value) => {
    
    let newInput = document.createElement("input");
    newInput.setAttribute("type", type);
    newInput.setAttribute("name", keyVal);
    newInput.setAttribute("value", value); 

    return newInput;
};

const makeDropDown = (id, keyVal, input) => {
    var newSelect = document.createElement("select");
   newSelect.setAttribute("form", "row-" + id);
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

    return newSelect;
}

const makeButton = (formId, id, name) => {
    let newButton = document.createElement("button");
    newButton.setAttribute("id", id);

    if (id == "update"){
        newButton.setAttribute("type" , "submit");
        newButton.setAttribute("form", "row-" + formId);
    } else {
        newButton.setAttribute("value", formId);
    }

    newButton.appendChild(document.createTextNode(name));

    return newButton;
};

table.addEventListener('click', async (event) => {
    const target = event.target.closest('button');

    if (!target) return;

    let row = target.parentNode.parentNode;

    if (target.id == "update") {
        console.log(row.id);
        let str = {
            id: row.querySelector('id').value,
            name: row.querySelector('name').value,
            reps: row.querySelector('reps').value,
            weight: row.querySelector('weight').value,
            unit: row.querySelector('unit').value,
            date: row.querySelector('date').value,
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
        console.log("Registered you hit the delete button");
        let str = target.value;

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
    console.log("Page loaded")
    deleteTable();
    console.log("Table deleted");
    let tableData = await getData();
    console.log("TableData should be populated");
    if (tableData == 'null') {
        console.log("Add some data.");
        return;
    }
    makeTable(tableData);
})();