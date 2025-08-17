/* FIREBASE REALTIME DATABASE
=============================================================================== */
//import { initializeApp } from "firebase/app";
//import { getDatabase, ref, set } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyDwNYxSb9sQtxYSIb0GJxrqFBT2Bl8N91s",
  authDomain: "mff-dealersden-app.firebaseapp.com",
  databaseURL: "https://mff-dealersden-app-default-rtdb.firebaseio.com",
  projectId: "mff-dealersden-app",
  storageBucket: "mff-dealersden-app.firebasestorage.app",
  messagingSenderId: "1087665539682",
  appId: "1:1087665539682:web:5bdd4cc15bfa75b8eb5f3b"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener base de datos
const database = firebase.database();

let datosCargados = [];

function StartData() {
    const reference = firebase.database().ref('json_ItemData/UserName');

    reference.once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (data) {
                datosCargados = Object.values(data); // asignación directa
            } else {
                console.log("No hay datos disponibles.");
                datosCargados = [];
            }
        })
        .catch(error => {
            console.error("Error al leer los datos:", error);
        });
}




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
const minScale = 0.2; // Puedes ajustarlo si quieres evitar zoom demasiado chico

/* FICHEROS JSON
=============================================================================== */
var json_sellers = [
    { "Artist": "Crimm", "Icon": "1.png", "Link": "https://bsky.app/profile/crimmart.bsky.social", "Stall":"1", "x": 275, "y": 104, "w": 63, "h": 32 },
    { "Artist": "Thesphur", "Icon": "2.png", "Link": "...", "Stall":"2", "x": 338, "y": 104, "w": 62, "h": 32 }
];


var json_FavSellers = [{"User":"...","Artist":"Crimm"}]

var json_ItemData = []


/* FAVORITOS
=============================================================================== */
function FavoriteSeller() {
    const color = getComputedStyle(document.getElementById('heart')).getPropertyValue('--c').trim();

    console.log(color)
    if (color == '#ff0000') {
        document.getElementById('heart').style.setProperty('--c', '#aaaaaa');
        json_FavSellers = json_FavSellers.filter(item => item.Artist !== json_sellers[index].Artist)
    } else {
        document.getElementById('heart').style.setProperty('--c', '#ff0000');
        json_FavSellers.push({
            "User":"Crimm",
            "Artist":json_sellers[index].Artist,
        })
    }

    dibujarRectangulos()
}

function FilterFavorite(Item) {
    console.log(Item.style.backgroundColor != 'rgb(255, 181, 159)')
    if(Item.style.backgroundColor != 'rgb(255, 181, 159)') {
        let html = '';

        Item.style.backgroundColor = 'rgb(255, 181, 159)'

        const favoritos = new Set(json_FavSellers.map(fav => fav.Artist));

        json_sellers.forEach((obj, index) => {
            const esFavorito = favoritos.has(obj.Artist);

            // Solo añadir el rectángulo si es favorito
            if (esFavorito) {
                const estiloFondo = 'background-color: rgba(252, 229, 26, 0.4);'; // Puedes cambiar el color a gusto

                html += `
                    <div class="rectangle" data-index="${index}" title="${obj.Artist}"
                        style="left: ${obj.x}px; top: ${obj.y}px; width: ${obj.w}px; height: ${obj.h}px; ${estiloFondo}"
                        onclick="handleRectClick(event)">
                        <p class="Rectangle_Title">${obj.Artist}</p>
                    </div>
                `;
            }
        });

        overlay.innerHTML = html;
    } else {
        Item.style.backgroundColor = ''
        dibujarRectangulos()
    }

}

/* FUNCION - DIBUJAR RECTÁNGULOS
=============================================================================== */
function dibujarRectangulos() {
    let html = '';

    const favoritos = new Set(json_FavSellers.map(fav => fav.Artist));
    const artistasEnItemData = new Set(json_ItemData.map(item => item.Artist));

    json_sellers.forEach((obj, index) => {
        const esFavorito = favoritos.has(obj.Artist);
        const enItemData = artistasEnItemData.has(obj.Artist);

        let estiloFondo = '';

        if (esFavorito) {
            estiloFondo = 'background-color: rgba(252, 229, 26, 0.4);'; // Color favoritos
        } else if (enItemData) {
            estiloFondo = 'background-color: rgba(26, 229, 252, 0.4);'; // Color nuevo para json_ItemData
        }

        html += `
            <div class="rectangle" data-index="${index}" title="${obj.Artist}"
                style="left: ${obj.x}px; top: ${obj.y}px; width: ${obj.w}px; height: ${obj.h}px; ${estiloFondo}"
                onclick="handleRectClick(event)">
                <p class="Rectangle_Title">${obj.Artist}</p>
            </div>
        `;
    });

    overlay.innerHTML = html;
}


var index = 0;

function handleRectClick(event) {
    document.getElementById('CloseSellerContainer').style.display = "flex"

    index = event.currentTarget.getAttribute('data-index');
    const seller = json_sellers[index];

    document.getElementById('Seller_Icon').src = "Images/Icons/" + seller.Icon;
    document.getElementById('Seller_Name').innerText = seller.Artist;
    document.getElementById('Seller_Stand').innerText = "Stall: " + seller.Stall;
    document.getElementById('RRSS_Button').href = seller.Link;

    const favoritos = new Set(json_FavSellers.map(fav => fav.Artist));
    const esFavorito = favoritos.has(json_sellers[index].Artist);

    console.log(esFavorito)

    if(esFavorito) {
        document.getElementById('heart').style.setProperty('--c', '#ff0000');
    } else {
        document.getElementById('heart').style.setProperty('--c', '#aaaaaa');
    }

    showItemData()
}

function CloseSellerContainer() {
    document.getElementById('CloseSellerContainer').style.display = "none"

    document.getElementById('TextInput').value = ''
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    base64Data = ''; 
}

function showItemData() {
    var ItemInput = ''

    json_ItemData.forEach(item => {
        
        if(item.Artist == json_sellers[index].Artist) {
            if(item.FileInput != '') {
                ItemInput += `
                    <div class="ItemContainer">
                        <div style="margin-left: 20px; width: 90%; overflow: hidden;">
                            <p style="display: flex;" class="ItemText">${item.TextInput}</p>
                            <button class="Download_Button" onclick="DownloadImage('${item.FileInput}', '${item.FileInputName}')">Download image</button>
                        </div>
                    </div>
                `
            } else {
                ItemInput += `
                    <div class="ItemContainer">
                        <div style="margin-left: 20px; width: 90%; overflow: hidden;">
                            <p style="display: flex;" class="ItemText">${item.TextInput}</p>
                        </div>
                    </div>
                `
            }
        }
        
    })

    document.getElementById('ItemList').innerHTML = ItemInput
    dibujarRectangulos()
}

function DownloadImage(base64, FileInputName) {  
    // Crea un elemento <a> para simular la descarga
    const enlace = document.createElement("a");
    enlace.href = base64;
    enlace.download = FileInputName; // Cambia el nombre del archivo si deseas

    // Simula el clic en el enlace
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}


/* FUNCION - ACTUALIZAR TRANSFORMACIONES
=============================================================================== */
function updateTransform() {
    const transformValue = `translate(${originX}px, ${originY}px) scale(${scale})`;
    imagen.style.transform = transformValue;
    overlay.style.transform = transformValue;
}


/* FUNCION - CLAMP DE POSICIÓN (opcional)
=============================================================================== */
function clampPosition() {
    const containerWidth = DD_Container.clientWidth;
    const containerHeight = DD_Container.clientHeight;
    const imageWidth = imagen.naturalWidth * scale;
    const imageHeight = imagen.naturalHeight * scale;

    if (imageWidth <= containerWidth) {
        originX = (containerWidth - imageWidth) / 2;
    } else {
        originX = Math.min(0, Math.max(originX, containerWidth - imageWidth));
    }

    if (imageHeight <= containerHeight) {
        originY = (containerHeight - imageHeight) / 2;
    } else {
        originY = Math.min(0, Math.max(originY, containerHeight - imageHeight));
    }
}


/* FUNCION - ZOOM
=============================================================================== */
function zoom(delta) {
    const newScale = scale * (1 + delta);
    if (newScale < minScale) return;

    const centerX = DD_Container.clientWidth / 2;
    const centerY = DD_Container.clientHeight / 2;

    const rect = imagen.getBoundingClientRect();
    const offsetX = centerX - rect.left;
    const offsetY = centerY - rect.top;

    const dx = offsetX / scale;
    const dy = offsetY / scale;

    scale = newScale;

    originX = centerX - dx * scale;
    originY = centerY - dy * scale;

    clampPosition();
    updateTransform();
}


/* EVENTOS DE ZOOM
=============================================================================== */
DD_Container.addEventListener('wheel', function (e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? zoomStep : -zoomStep;
    zoom(delta);
});

zoomInBtn.addEventListener('click', () => zoom(zoomStep));
zoomOutBtn.addEventListener('click', () => zoom(-zoomStep));


/* EVENTOS - ARRASTRAR
=============================================================================== */
DD_Container.addEventListener('mousedown', function (e) {
    isDragging = true;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
});

DD_Container.addEventListener('mousemove', function (e) {
    if (isDragging) {
        originX = e.clientX - startX;
        originY = e.clientY - startY;
        clampPosition();
        updateTransform();
    }

    mostrarCoordenadas(e);
});

DD_Container.addEventListener('mouseup', () => isDragging = false);
DD_Container.addEventListener('mouseleave', () => isDragging = false);


/* FUNCION - MOSTRAR COORDENADAS
=============================================================================== */
function mostrarCoordenadas(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const imgX = (mouseX - originX) / scale;
    const imgY = (mouseY - originY) / scale;

    if (
        imgX >= 0 && imgX <= imagen.naturalWidth &&
        imgY >= 0 && imgY <= imagen.naturalHeight
    ) {
        coordDisplay.textContent = `X: ${Math.floor(imgX)}, Y: ${Math.floor(imgY)}`;
    } else {
        coordDisplay.textContent = `Out of bounds`;
    }
}

/* FUNCIONES - TRATAR LAS IMAGENES
=============================================================================== */
const fileInput = document.getElementById('FileInput');
const fileNameDisplay = document.getElementById('FileName');
let base64Data = ''; // Aquí se guardará el Base64

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];

    if (file) {
        // Mostrar nombre del archivo
        fileNameDisplay.textContent = file.name;

        // Leer como Base64
        const reader = new FileReader();
        reader.onload = function (e) {
            base64Data = e.target.result; // Incluye data:<tipo>;base64,...
        };
        reader.readAsDataURL(file);
    } else {
        fileNameDisplay.textContent = '';
        base64Data = '';
    }
});

function HandleInputData() {

    json_ItemData.push({
            "User":"...",
            "Artist":json_sellers[index].Artist,
            "Stall":json_sellers[index].Stall,
            "TextInput": document.getElementById('TextInput').value,
            "FileInput": base64Data,
            "FileInputName": fileNameDisplay.textContent
        })

    const reference = database.ref('json_ItemData/' + "UserName");
    reference.push({
        User:"UserName",
        Artist:json_sellers[index].Artist,
        Stall:json_sellers[index].Stall,
        TextInput: document.getElementById('TextInput').value,
        FileInput: base64Data,
        FileInputName: fileNameDisplay.textContent
    });
    
    document.getElementById('TextInput').value = ''
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    base64Data = ''; 

    showItemData()

    console.log(json_ItemData)
}


/* DOWNLOAD ITEMS
=============================================================================== */
function dibujarRectangulosEn(overlayElemento) {
    const favoritos = new Set(json_FavSellers.map(fav => fav.Artist));
    const artistasEnItemData = new Set(json_ItemData.map(item => item.Artist));

    const imagen = overlayElemento.previousElementSibling; // La <img> justo antes del overlay

    // Esperar a que la imagen cargue para obtener su tamaño real
    if (!imagen.complete) {
        imagen.onload = () => dibujarRectangulosEn(overlayElemento);
        return;
    }

    const escala = imagen.clientWidth / imagen.naturalWidth;

    let html = '';

    json_sellers.forEach((obj) => {
        const esFavorito = favoritos.has(obj.Artist);
        const enItemData = artistasEnItemData.has(obj.Artist);

        let estiloFondo = '';
        if (esFavorito) {
            estiloFondo = 'background-color: rgba(252, 229, 26, 0.4);';
        } else if (enItemData) {
            estiloFondo = 'background-color: rgba(26, 229, 252, 0.4);';
        } else {
            return; // No pintar si no pertenece a ningún grupo
        }

        const left = obj.x * escala;
        const top = obj.y * escala;
        const width = obj.w * escala;
        const height = obj.h * escala;

        html += `
            <div class="rectangle"
                style="left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px; ${estiloFondo}">
            </div>
        `;
    });

    overlayElemento.innerHTML = html;
}



function handleDownloadItemContainer() {
    document.getElementById('DownloadItemContainer').style.display = "flex";
    let ItemInput = '';

    // Crear el contenedor de mapa con overlay e imagen
    const imagenOriginal = document.getElementById('imagen');
    const imagenSrc = imagenOriginal.src;

    ItemInput += `
        <div class="MapaDescarga">
            <img src="${imagenSrc}" alt="Mapa" class="MiniMapaDescarga">
            <div class="overlayDownload"></div>
        </div>
    `;


    json_ItemData.forEach(element => {
        ItemInput += `
            <div class="DownloadItemElement">
                <div class="Seller_Info_Download">
                    <p class="Download_Title" style="margin-bottom: 5px;">${element.Artist}</p>
                    <p class="Download_Title" style="font-weight: 500; margin-bottom: 5px;">- Stall: ${element.Stall}</p>
                </div>
                <div class="Content_Download">
                    <p style="margin: 0 0 5px 0;" class="Download_Text">${element.TextInput}</p>
                </div>
                <div class="Content_Download">
                    <img src="${element.FileInput}" style="width: 150px; page-break-inside: avoid; break-inside: avoid;">
                </div>
                <hr>
            </div>
        `;
    });

    const container = document.getElementById('DownloadItemList_Container');
    container.innerHTML = ItemInput;

    // Ahora que ya está en el DOM, seleccionamos el nuevo overlay y dibujamos encima
    const nuevoOverlay = container.querySelector('.overlayDownload');
    if (nuevoOverlay) {
        dibujarRectangulosEn(nuevoOverlay);
    }
}



function CloseDownloadItemContainer() {
    document.getElementById('DownloadItemContainer').style.display = "none";

}

function DownloadPDF() {
    const elemento = document.getElementById('DownloadItemList_Container');

    const opciones = {
    margin:       10,
    filename:     'Dealers Den List.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opciones).from(elemento).save();
}

/* INICIAR APLICACIÓN
=============================================================================== */
window.addEventListener('load', () => {
    const containerWidth = DD_Container.clientWidth;
    const containerHeight = DD_Container.clientHeight;
    const imageWidth = imagen.naturalWidth * scale;
    const imageHeight = imagen.naturalHeight * scale;

    if (imageHeight < containerHeight) {
        scale = containerHeight / imagen.naturalHeight;
    }

    originX = (containerWidth - imagen.naturalWidth * scale) / 2;
    originY = (containerHeight - imagen.naturalHeight * scale) / 2;

    updateTransform();
    dibujarRectangulos();

    StartData();
});