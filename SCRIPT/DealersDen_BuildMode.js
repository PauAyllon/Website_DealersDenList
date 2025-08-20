/* FIREBASE REALTIME DATABASE
=============================================================================== */

/* Variables
=============================================================================== */
const DD_Container = document.getElementById('DD_Container');
const imagen = document.getElementById('imagen');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const coordDisplay = document.getElementById('coordenadas');
const overlay = document.getElementById('overlay');

let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;

const zoomStep = 0.2;
const minScale = 0.2;

let controlesActivos = false;

/* FICHEROS JSON
=============================================================================== */
var json_sellers = []
/* var json_sellers = [
    { "Artist": "Crimm", "Icon": "", "Link": "https://bsky.app/profile/crimmart.bsky.social", "Stall":"1", "x": 275, "y": 104, "w": 63, "h": 32 },
    { "Artist": "Thesphur", "Icon": "", "Link": "", "Stall":"2", "x": 338, "y": 104, "w": 62, "h": 32 },
    { "Artist": "Test", "Icon": "", "Link": "", "Stall":"2", "x": 432, "y": 104, "w": 62, "h": 32 }
]; */


var json_FavSellers = [{"User":"...","Artist":"Crimm"}]

var json_ItemData = []

/* FUNCION - DIBUJAR RECTÁNGULOS
=============================================================================== */
function dibujarRectangulos() {
    let html = '';

    json_sellers.forEach((obj, index) => {
        html += `<div class="rectangle" 
            style=" position: absolute; left: ${obj.x}px; top: ${obj.y}px; width: ${obj.w}px; height: ${obj.h}px; z-index:20;">
            </div> `;
    });

    document.getElementById('overlay').innerHTML = html;
}

/* UPLOAD FILES
=============================================================================== */

let base64Data = '';


ImageInput.addEventListener('change', function () {
    const file = ImageInput.files[0];

    if (file) {
        document.getElementById('ImageButton').style.backgroundColor = "#90f16379"

        // Leer como Base64
        const reader = new FileReader();
        reader.onload = function (e) {
            base64Data = e.target.result;
        };

        reader.readAsDataURL(file);

    } else {
        base64Data = '';
    }
});

Json_Input.addEventListener('change', function () {
    const file = Json_Input.files[0];
    let reader = new FileReader();

    document.getElementById('JSONButton').style.backgroundColor = "#90f16379"

    reader.onload = function() {
      json_sellers = JSON.parse(reader.result);
    };

    reader.readAsText(file);
});

function LoadData() {
    document.getElementById('Upload_File').style.display = 'none'

    document.getElementById('imagen').src = base64Data
    document.getElementById('imagen').style.display = ""

    document.getElementById('AddSellerButton').classList.remove('Button_Disabled');
    document.getElementById('SaveButton').classList.remove('Button_Disabled');

    ImageContainer.addEventListener('mousemove', function (e) {
        mostrarCoordenadas(e);
    });

    ShowSellerDatabase()
    dibujarRectangulos()
}

function ShowSellerDatabase() {
    var Seller_List = ''

    json_sellers.forEach((element,index) => {

        const Nickname = element.Artist.slice(0, 2).toUpperCase();

        Seller_List += `
            <div style="width: 97%; background-color: #ffffff; border-radius: 12px; box-shadow: 2px 5px 5px 0px #00000023; display: flex; gap: 20px; align-items: center; margin:10px 0px 10px 0px">
                <div id="Nickname" style="margin: 10px;">
                    <p id="Nickname_Letters">${Nickname}</p>
                </div>
                <div style="width: 60%; text-align: start;">
                    <p class="Text">${element.Artist}</p>
                    <p class="Text">Stall: ${element.Stall}</p>
                </div>
                <img src="Images/Buttons/write_5828493.png" style="width: 30px; height: 30px; cursor:pointer" class="edit_button" onclick="EditMenu(${JSON.stringify(element).replace(/"/g, "&quot;")}, ${index})">
            </div>
        `

    });

    document.getElementById('sellers_list').innerHTML = Seller_List;
}

function ShowFormMenu() {
    controlesActivos = true;
    document.getElementById('ListMenu').style.display = "none"
    document.getElementById('FormMenu').style.display = "block"

    document.getElementById('CreateButton').style.display = ''
    document.getElementById('UpdateButton').style.display = 'none'

    document.getElementById('NameInput').value = '';
    document.getElementById('StallInput').value = '';
    document.getElementById('XInput').value = 0;
    document.getElementById('YInput').value = 0;
    document.getElementById('WInput').value = 0;
    document.getElementById('HInput').value = 0;

    StartSelecting()
}

function CloseFormMenu() {
    controlesActivos = false;
    document.getElementById('ListMenu').style.display = "block"
    document.getElementById('FormMenu').style.display = "none"
}

function addSeller() {
    const newItem = { 
        "Artist": document.getElementById('NameInput').value, 
        "Icon": "", 
        "Link": "", 
        "Stall": document.getElementById('StallInput').value, 
        "x": document.getElementById('XInput').value, 
        "y": document.getElementById('YInput').value, 
        "w": document.getElementById('WInput').value, 
        "h": document.getElementById('HInput').value 
    };

    json_sellers.push(newItem)

    document.getElementById('selectionBox').style = ''
    dibujarRectangulos()
    ShowSellerDatabase()
    CloseFormMenu()
}

async function SaveFile() {
    const options = {
        suggestedName: "DealersDenSellers.json",
        types: [{
            description: "JSON Files",
            accept: { "application/json": [".json"] }
        }]
    };

    try {
        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();

        await writable.write(JSON.stringify(json_sellers, null, 2));
        await writable.close();

        console.log("Archivo guardado correctamente.");
    } catch (err) {
        console.error("Error al guardar el archivo:", err);
    }
}

/* SELECCIONAR AREA
=============================================================================== */
const image = document.getElementById('imagen');
const container = document.getElementById('ImageContainer');
const selectionBox = document.getElementById('selectionBox');
const output = document.getElementById('output');

let isSelecting = false;

function StartSelecting() {
    image.addEventListener('mousedown', (e) => {
        if(!controlesActivos) return;

        e.preventDefault(); // Evita arrastrar la imagen
        const rect = image.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        isSelecting = true;

        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
        selectionBox.style.display = 'block';
    });

    image.addEventListener('mousemove', (e) => {
        if(!controlesActivos) return;
        if (!isSelecting) return;

        const rect = image.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const x = Math.min(currentX, startX);
        const y = Math.min(currentY, startY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selectionBox.style.left = `${x}px`;
        selectionBox.style.top = `${y}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;
    });

    image.addEventListener('mouseup', (e) => {
        if (!controlesActivos) return;
        if (!isSelecting) return;
        isSelecting = false;

        const rect = image.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);

        document.getElementById('XInput').value = Math.round(x);
        document.getElementById('YInput').value = Math.round(y);

        document.getElementById('WInput').value = Math.round(width);
        document.getElementById('HInput').value = Math.round(height);

    });
}

var Data_Index = 0

function EditMenu(item, index) {
    Data_Index = index
    controlesActivos = true;
    document.getElementById('ListMenu').style.display = "none"
    document.getElementById('FormMenu').style.display = "block"

    document.getElementById('CreateButton').style.display = 'none'
    document.getElementById('UpdateButton').style.display = ''


    document.getElementById('NameInput').value = item.Artist;
    document.getElementById('StallInput').value = item.Stall;
    document.getElementById('XInput').value = item.x;
    document.getElementById('YInput').value = item.y;
    document.getElementById('WInput').value = item.w;
    document.getElementById('HInput').value = item.h;

    StartSelecting()
}

function updateEntry() {
    json_sellers[Data_Index].Artist = document.getElementById('NameInput').value
    json_sellers[Data_Index].Stall = document.getElementById('StallInput').value 

    json_sellers[Data_Index].x = document.getElementById('XInput').value
    json_sellers[Data_Index].y = document.getElementById('YInput').value
    json_sellers[Data_Index].w = document.getElementById('WInput').value
    json_sellers[Data_Index].h = document.getElementById('HInput').value

    document.getElementById('selectionBox').style = ''
    dibujarRectangulos()
    ShowSellerDatabase()
    CloseFormMenu()
}

// Create Group Code ----------------------------------------------------------------------------
const NameInput = document.getElementById('NameInput');
const StallInput = document.getElementById('StallInput');

const XInput = document.getElementById('XInput');
const YInput = document.getElementById('YInput');

const WInput = document.getElementById('WInput');
const HInput = document.getElementById('HInput');

const CreateButton = document.getElementById('CreateButton');
const UpdateButton = document.getElementById('UpdateButton');

function verificarCampos() {
    const NameValido = NameInput.value.trim() !== '';
    const StallValido = StallInput.value.trim() !== '';
    const XValido = XInput.value !== '';
    const YValido = YInput.value !== '';
    const WValido = WInput.value !== '';
    const HValido = HInput.value !== '';

    if (NameValido && StallValido && XValido && YValido && WValido && HValido) {
        CreateButton.classList.remove('Button_Disabled');
        UpdateButton.classList.remove('Button_Disabled');
    } else {
        CreateButton.classList.add('Button_Disabled');
        UpdateButton.classList.remove('Button_Disabled');
    }
}

// Escuchar los eventos input en ambos campos
NameInput.addEventListener('input', verificarCampos);
StallInput.addEventListener('input', verificarCampos);
XInput.addEventListener('input', verificarCampos);
YInput.addEventListener('input', verificarCampos);
WInput.addEventListener('input', verificarCampos);
HInput.addEventListener('input', verificarCampos);