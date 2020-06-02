//const bodyParser = require("body-parser");

const baseURL = `http://flip1.engr.oregonstate.edu:8157/`;
const deleteTable = () => {
    let table = document.getElementById("workoutsTable");
    if (table){
        table.parentNode.removeChild(table);
    }
};

const makeTable = (allRows) => {
    let table = document.createElement("table");

    table.setAttribute("id", "workoutsTable");

    table.appendChild(makeHeaderRow());

    for (var i = 0; i < allRows.length; i++){
        table.appendChild(makeRow(allRows[i]));
    }

    return table;
};

const makeHeaderRow = () => {
    let headerRow = document.createElement("tr");
    headerRow.setAttribute("id", "header");
    var headers = ["id", "name", "reps", "weight", "unit", "date", "update", "delete"];

    for (var i = 0; i < headers.length; i++) {
       let headerCell = document.createElement("th");
       headerCell.appendChild(document.createTextNode(headers[i]));
       headerRow.appendChild(headerCell);
    }
    
    return headerRow;
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
    newRow.appendChild(makeCell("delete", "Delete"));

    for (var i = 0; i < newRow.length - 1; i++) {
        for (children in node){
            children.setAttribute("id", "Form " + rowData[0]);
        }
    }

    var delButton = newRow.getElementById("delete");
    delButton.setAttribute("value", rowData[0]);

    return newRow;
};

const makeCell = (name, contents, headerRow = false) => {
    let newCell = document.createElement("td");

    if (name == "units") {
        let newForm = document.createElement("form");
        newForm.appendChild(makeDropDown(name, contents));
        newCell.appendChild(newForm);
    } else if (name == ("update" || "delete")) {
        newCell.appendChild(makeButton(name, contents));
    } else if (name == "id") {
        newCell.appendChild(createTextNode(contents));
    }
    else {
        let newForm = document.createElement("form");
        newForm.appendChild(makeInput(text, name, contents));
        newCell.appendChild(newForm);
    }
    return newCell;
};

const makeInput = (type, name, value) => {
    
    let newInput = document.createElement("input");
    newInput.setAttribute("type", type);
    newInput.setAttribute("name", name);
    newInput.setAttribute("value", value); 

    disableInput(newInput);
    return newInput;
};

const makeDropDown = (name, value) => {
    var newSelect = document.createElement("select");
    newSelect.setAttribute("name", name);
    newSelect.setAttribute("id", name);

    var newOption = document.createElement("option");
    newOption.setAttribute("value", "kgs");
    newSelect.appendChild(newOption);
    newOption = document.createElement("option");
    newOption.setAttribute("value", "lbs");
    newSelect.appendChild(newOption);

    for (options in newSelect) {
        if (options.getAttribute("value") == value) {
            options.setAttribute("selected", "selected")
            break;
        }
    }

    disableInput(newSelect);

    return newSelect;
}

const makeButton = (name, txt) => {
    let newButton = document.createElement("button");
    newButton.setAttribute("id", name);
    newButton.appendChild(document.createTextNode(txt));

    return newButton;
};

const disableInput = (formID) => {
    formID.disabled = true;
};

const enableRow = (row) => {
    for (element in row) {
        element.disabled = false;
    }
};

const toggleUpdateButton = (rowID) => {
    let tableRow = table.getElementById(rowID);
    let updateButton = tableRow.getElementById("update");

    updateButton.id = "edit";
    updateButton.firstChild.nodeValue = "Done";
    updateButton.setAttribute ("form", rowID);
    updateButton.setAttribute("type", "submit");

};

const table = document.getElementById('workoutsTable');

if (table) { 
    table.addEventListener('click', (event) => {
        let target = event.target;

        if (target.tagName != 'button') return;

        let row = target.parentNode.parentNode;

        if (target.id == "update") {
            toggleUpdateButton(row);
            enableRow(row);
        }

        else if (target.id == "delete") {
            var req = new XMLHttpRequest();
            let payload = {
                id: target.value
            }
            req.open('DELETE', baseURL, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    alert(req.responseText);
                }
                else {
                    console.log("Error in network request: " + req.statusText);
                }});
            event.preventDefault();
        }

        return;
    });
};

if (table) {
    table.getElementsByTagName('form').onsubmit = async (event) => {
        event.preventDefault();
        var row = event.target.parentNode;

        var req = new XMLHttpRequest();
        let payload = {
            id: row.getElementsByName('id').value,
            name: row.getElementsByName('name').value,
            reps: row.getElementsByName('reps').value,
            weight: row.getElementsByName('weight').value,
            unit: row.getElementsByName('unit').value,
            date: row.getElementsByName('date').value,
        }
        req.open('PUT', baseURL, true)
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            alert(response);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});

        deleteTable();
        let tableData = getData();
        document.appendChild(makeTable(tableData));    
    }
}

const onUpdate = () => {};
const onDelete = () => {};

const getData = async () => {
    var req = new XMLHttpRequest();
    var rowData;
    req.open('GET', baseURL, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        rowData = JSON.parse(req.responseText);
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
    return rowData;
};

document.getElementById('addForm').onsubmit = async (event) => {
    event.preventDefault();

    var req = new XMLHttpRequest();
    let payload = {
        name: document.getElementById('name').value,
        reps: document.getElementById('reps').value,
        weight: document.getElementById('weight').value,
        unit: document.getElementById('unit').value,
        date: document.getElementById('date').value,
      }
      console.log(payload);
    req.open('POST', baseURL, true)
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.responseText);
        document.appendChild(makeTable(tableData));
    } else {
        console.log("Error in network request: " + req.statusText);
      }});

      deleteTable();
      let tableData = await getData();
      if (tableData == 'null') {
          console.log("Add some data.");
          return;
      }
      document.appendChild(makeTable(tableData));
};

/*(async () => {
    let tableData = await getData();
    if (tableData == 'null') {
        console.log("Add some data.");
        return;
    }
    document.appendChild(makeTable(tableData));
})();*/