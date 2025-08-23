/* FIREBASE REALTIME DATABASE
=============================================================================== */

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
    const reference = firebase.database().ref('json_GroupCodes');

    reference.once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (data) {
                datosCargados = Object.entries(data); // asignación directa
                console.log(datosCargados);
            } else {
                console.log("No hay datos disponibles.");
                datosCargados = [];
            }
        })
        .catch(error => {
            console.error("Error al leer los datos:", error);
        });
}

/* VARIABLES
=============================================================================== */
var inputCode = ''
let selectedUser = '';


/* LOG IN
=============================================================================== */
function HandleUser() {
  inputCode = document.getElementById("groupCode").value.trim();

  // Buscar todos los registros que coincidan
  const resultados = datosCargados.filter(item => item[0] === inputCode);

  if (resultados.length > 0) {
    document.getElementById('Code').innerHTML = inputCode

    document.getElementById('LoginGroupCode').style.display = 'none'
    document.getElementById('SelectUser').style.display = 'block'

    ShowUsers(inputCode)
  } else {
    console.log(`No se encontró ningún registro con el código: "${inputCode}"`);
    document.getElementById('LogInError').style.opacity = 1

    setTimeout(function(){
      document.getElementById('LogInError').style.opacity = 0
    },2000)
  }
}

function ShowUsers(inputCode) {
  datosCargados.forEach(element => {

    if(element[0] == inputCode) {

      var options = ''

      Object.values(element[1]).forEach(entry => {
        console.log(entry.User);
        
        options += `
          <div class="option">${entry.User}</div>
        `
      });

      document.getElementById('options'). innerHTML = options
      setupDropdownEvents()
    }
  });
}

function CreateUser() {
  const newItem = {
    User: document.getElementById('InputText').value,
  };

  const input = document.getElementById('InputText').value.trim();
  const grupo = datosCargados.find(([nombre]) => nombre === inputCode);

  if (!grupo) {
    console.log(`Grupo "${grupoBuscado}" no encontrado.`);
    return;
  }

  const usuarios = Object.values(grupo[1]).map(obj => obj.User.toLowerCase());
  const encontrado = usuarios.includes(input.toLowerCase());

  if (encontrado) {
      document.getElementById('UserError').style.opacity = 1

      setTimeout(function(){
        document.getElementById('UserError').style.opacity = 0
      },2000)
  } else {
    const reference = firebase.database().ref('json_GroupCodes/' + inputCode);
    reference.push(newItem)
      .then(() => {
        console.error("Okay");
        window.location.href = `DealersDen.html?usuario=${document.getElementById('InputText').value}&groupcode=${inputCode}`;
        document.getElementById('InputText').value = ''
      })
      .catch(error => {
        console.error("Error al añadir item:", error);
      }); 
  }

  /* */
}

function setupDropdownEvents() {
    const selected = document.querySelector('.selected');
    const optionsContainer = document.querySelector('.options');
    const optionsList = document.querySelectorAll('.option');

    selected.addEventListener('click', () => {
        optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
        const arrow = document.getElementById('arrow');
        const currentRotation = arrow.style.transform;
        arrow.style.transform = currentRotation === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    optionsList.forEach(o => {
        o.addEventListener('click', () => {
            selectedUser = o.textContent;
            selected.innerHTML = `
                ${o.textContent}
                <div style="transition: .3s ease; margin-left: 10px;" id="arrow">
                    <i class="arrow down"></i>
                </div>
            `;
            optionsContainer.style.display = 'none';
        });
    });
}

/* CREATE GROUP
=============================================================================== */
function CreateGroupMenu() {
  document.getElementById('LoginGroupCode').style.display = 'none'
  document.getElementById('CreateGroupCode').style.display = 'block'
}

function CreateGroup() {
  const GroupName = document.getElementById('NewgroupCode').value
  const UserName = document.getElementById('NewUsername').value

  const resultados = datosCargados.filter(item => item[0] === GroupName);

  console.log(resultados)

  if (resultados.length > 0) {
    document.getElementById('GroupCodeError').style.opacity = 1

    setTimeout(function(){
      document.getElementById('GroupCodeError').style.opacity = 0
    },2000)
  } else {
    const newItem = {
      User: UserName,
    };

    const reference = firebase.database().ref('json_GroupCodes/' + GroupName);
    reference.push(newItem)
      .then(() => {
        console.error("Okay");
        window.location.href = `DealersDen.html?usuario=${UserName}&groupcode=${GroupName}`;
      })
      .catch(error => {
        console.error("Error al añadir item:", error);
      });
  }

}

/* CHANGE SITE
=============================================================================== */
function selectUser() {
  window.location.href = `DealersDen.html?usuario=${selectedUser}&groupcode=${inputCode}`;
}

/* CLOSE WINDOW
=============================================================================== */
function CloseLogIn() {
  document.getElementById('LoginGroupCode').style.display = 'block'
  document.getElementById('SelectUser').style.display = 'none'
}

function CloseSignIn() {
  document.getElementById('LoginGroupCode').style.display = 'block'
  document.getElementById('CreateGroupCode').style.display = 'none'
}

/* INICIAR APLICACIÓN
=============================================================================== */
window.addEventListener('load', () => {
    StartData()
});