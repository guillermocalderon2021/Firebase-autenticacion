import { getContactsByUser, auth, saveContact, getCurrentUserId} from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";;

  // Cargar usuarios al cargar la página
  window.addEventListener("load", loadUsers);
  const saveButton = document.getElementById("saveContactButton");
  saveButton.addEventListener("click", save);


 // Escucha el estado de autenticación
 onAuthStateChanged(auth,async (user) => {
    
      if (user) {
      } else {
        // Si el usuario no está autenticado, redirige al login
        window.location.href = "login.html";
      }
    
  });

  // Función para validar y enviar los datos del formulario
function save() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const birthDate = document.getElementById('birthDate').value;
  const phone = document.getElementById('phone').value.trim();

  if (!firstName || !lastName || !birthDate || !phone) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  // Obtener el ID del usuario autenticado
  const userId = getCurrentUserId();
  if (!userId) {
    alert('No se ha podido obtener el ID del usuario. Asegúrate de estar autenticado.');
    return;
  }

  // Crear el objeto de contacto con el userId incluido
  const contactData = {
    firstName,
    lastName,
    birthDate,
    phone,
    userId,          // Agregar el userId del usuario autenticado
  };

  // Llamar a la función de firebase.js para guardar el contacto
  saveContact(contactData).then(() => {
    document.getElementById('contactForm').reset(); // Limpiar el formulario
    const modalElement = document.getElementById('contactModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide(); // Cerrar el modal
    loadUsers();
  });
}



// Cargar usuarios al cargar la página
async function loadUsers() {
    const userList = document.getElementById("contactList");
    userList.innerHTML = ""; // Limpiar la tabla
  
    const snapshot = await getContactsByUser();
    snapshot.forEach((contact) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.birthDate}</td>
        <td>${contact.phone}</td>
      `;
      userList.appendChild(row);
    });
  }

    // Cerrar sesión
    document.getElementById("logoutButton").addEventListener("click", async () => {
        try {
          await signOut(auth);
          window.location.href = "login.html";
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      });
  