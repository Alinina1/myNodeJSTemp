let myTable;
let selectBox;
let loadSetting = "r";

window.onload = ()=>{
    myTable = document.getElementById("my-table");
    selectBox = document.getElementById("downloadOptions");
    load("small.csv").then(r => console.log("Вызван метод load"));
    selectBox.addEventListener("change",(e)=>{
        loadSetting = selectBox.value;
        load("small.csv").then(r => console.log("Вызван метод load с настройкой: "+loadSetting));
    })
}

async function load(name) {
    const url = "/files/"+name;
    let response = await fetch(url);
    if (response.ok) {
        const text = await response.text();
        const data = createObjectsArrayFromData(text);
        addDataToPage(data);
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function addDataToPage(data){
    for(let item of data){
        appendDivToTable(item);
    }
}

//Добавление ячейки в таблицу
function appendDivToTable(property){
    const rowDiv = document.createElement("div");//row div
    rowDiv.classList.add("row");
    rowDiv.setAttribute("level", property.level);
    //code 1
    let div = document.createElement("div");
    div.innerText = property.code1;
    rowDiv.append(div);
    //code 2
    div = document.createElement("div");
    div.innerText = property.code2;
    rowDiv.append(div);
    //code 3
    div = document.createElement("div");
    div.innerText = property.code3;
    rowDiv.append(div);
    //code 3
    div = document.createElement("div");
    div.innerText = property.code4;
    rowDiv.append(div);
    //name
    div = document.createElement("div");
    div.innerText = property.name;
    rowDiv.append(div);

    myTable.append(rowDiv);
}

function createObjectsArrayFromData(data){
    let arr;
    if(loadSetting === "r"){
        arr = data.match(/.+/g);
    }
    else {
        arr = data.split("\n");
    }
    const newData = [];
    for(let item of arr){
        const l = {};
        let reg;
        if(loadSetting === "r"){
            const regexp = new RegExp('"(\\d+)";"(\\d+)";"(\\d+)";"(\\d+)";"(\\d";"\\d";)"([a-zA-Zа-яА-Я\\s,ё-]+)"');
            reg = item.match(regexp);
            if(reg===null) continue;
        }
        else {
            reg = item.split(";");
        }

        l.fullName = reg[0];
        l.code1 = reg[1];
        l.code2 = reg[2];
        l.code3 = reg[3];
        l.code4 = reg[4];
        l.name = reg[6];
        if(l.code2 == 0 && l.code3 == 0 && l.code4 == 0){
            l.level = 1;
        }
        else if(l.code3 == 0 && l.code4 == 0){
            l.level = 2;
        }
        else if(l.code4 == 0){
            l.level = 3;
        }
        else {
            l.level = 4;
        }
        newData.push(l);
    }
    return newData;
    //для населенных пунктов:
    //"(\d+)";"(\d+)";"(\d+)";"(\d+)";"(\d";"\d";)"([а-я]+)\s([a-zA-Zа-яА-Я\s-]+)"
    //для всего:
    //"(\d+)";"(\d+)";"(\d+)";"(\d+)";"(\d";"\d";)"([a-zA-Zа-яА-Я\s,ё-]+)"
}
