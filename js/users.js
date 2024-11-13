import { getUsers, auth, getUser} from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";;

 // Escucha el estado de autenticación
 onAuthStateChanged(auth,async (user) => {
    
      if (user) {
        let usuario= await getUser(user.uid);
        console.log(usuario.role);
       if(usuario.role!=="admin"){
            window.location.href = "contacts.html";
        }
      } else {
        // Si el usuario no está autenticado, redirige al login
        window.location.href = "login.html";
      }
    
  });



// Cargar usuarios al cargar la página
async function loadUsers() {
    const userList = document.getElementById("userList");
    userList.innerHTML = ""; // Limpiar la tabla
  
    const snapshot = await getUsers();
    snapshot.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.email}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.role}</td>
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
  
  // Cargar usuarios al cargar la página
  window.addEventListener("load", loadUsers);