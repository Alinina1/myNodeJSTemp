let myTable;
let selectBox;
let loadSetting = "r";
let allNP;

let regionInput;
let areaInput;

window.onload = ()=>{
    myTable = document.getElementById("my-table");
    selectBox = document.getElementById("downloadOptions");
    load("small.csv").then(r => {console.log("Вызван метод load");});

    selectBox.addEventListener("change",(e)=>{
        loadSetting = selectBox.value;
        load("small.csv").then(r => console.log("Вызван метод load с настройкой: "+loadSetting));
    });

    // myTable.addEventListener("click", (e)=>{
    //     e = e.target.parentElement;
    //     const currentElement = e;
    //     if(e.hasAttribute("level")){
    //         while(true){
    //             if (+e.nextElementSibling.getAttribute("level") > +currentElement.getAttribute("level")){
    //                 e.nextElementSibling.classList.toggle("hidden");
    //                 e = e.nextElementSibling;
    //             }
    //             else{
    //                 break;
    //             }
    //         }
    //     }
    // });

    regionInput = document.getElementById("region");
    areaInput = document.getElementById("area");
    const npInput = document.getElementById("np");

    regionInput.addEventListener("keyup", findRegionAndArea);//{

        // let isHide = false;
        // if (e.target.value.length >=3){
        //     for(let item of allNP){
        //         //скрывать все населенные пункты при поиске региона
        //         if(item.getAttribute("level") === "4"){
        //             item.classList.add("hidden");
        //             continue;
        //         }
        //         if(item.getAttribute("level") === "1"){
        //             const itemText = item.innerText.toUpperCase();
        //             isHide = !itemText.includes(e.target.value.toUpperCase());
        //         }
        //         if(isHide){
        //             item.classList.add("hidden");
        //         }
        //         else {
        //             item.classList.remove("hidden");
        //         }
        //     }
        // }
        // else {
        //     for(let items of allNP){
        //         items.classList.remove("hidden");
        //     }
        // }
   // });

    areaInput.addEventListener("keyup", findRegionAndArea);

    np.addEventListener("keyup",(e)=>{
        const newGrid = document.getElementById("my-table2");
        if (e.target.value.length >=2) {
            myTable.classList.add("grid60");
            newGrid.classList.add("grid40");
            newGrid.innerText = "";
            let isHide = false;
            for(let item of allNP){
                if(item.getAttribute("level") === "4"){
                    const itemText = item.innerText.toUpperCase();
                    if (itemText.includes(e.target.value.toUpperCase())){
                        isHide = false;
                        const div = item.cloneNode(true);
                        div.classList.add("row");
                        newGrid.append(div);
                    }
                    else {
                        isHide = true;
                    }
                }
                if(isHide){
                    item.classList.add("hidden");
                }
                else {
                    item.classList.remove("hidden");
                }
            }
        }
        else {
            for(let items of allNP){
                items.classList.remove("hidden");
            }
            myTable.classList.remove("grid60");
            newGrid.classList.remove("grid40");
            newGrid.innerText = "";
        }
    });
}

async function load(name) {
    myTable.innerText = "";
    const url = "/files/"+name;
    let response = await fetch(url);
    if (response.ok) {
        const text = await response.text();
        const data = createObjectsArrayFromData(text);
        addDataToPage(data);
        allNP = document.querySelectorAll("div[level]");
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
    //if(property.code4 != 0) return;
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
    //code 4
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
            l.fullName = reg[0];
            l.code1 = reg[1];
            l.code2 = reg[2];
            l.code3 = reg[3];
            l.code4 = reg[4];
        }
        else {
            item = item.replaceAll('"', "");
            reg = item.split(';');
            l.code1 = reg[0];
            l.code2 = reg[1];
            l.code3 = reg[2];
            l.code4 = reg[3];
        }

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


function findRegionAndArea(e){
    let isHide = false;
    let isHide1 = false;
    if (e.target.value.length >=3){
        for(let item of allNP){
            //скрывать все населенные пункты при поиске района
            if(item.getAttribute("level") === "4"){
                item.classList.add("hidden");
                continue;
            }
            if(item.getAttribute("level") === "1"){
                const itemText = item.innerText.toUpperCase();
                isHide1 = !itemText.includes(regionInput.value.toUpperCase());
            }
            if(item.getAttribute("level") === "2"){
                const itemText = item.innerText.toUpperCase();
                isHide = !itemText.includes(areaInput.value.toUpperCase());
            }
            if(!isHide && !isHide1){
                item.classList.remove("hidden");
            }
            else {
                item.classList.add("hidden");
            }
        }
    }
    else {
        for(let items of allNP){
            items.classList.remove("hidden");
        }
    }
}