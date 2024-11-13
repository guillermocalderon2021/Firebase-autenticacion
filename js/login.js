import { registerUser, loginUser } from "./firebase.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  let correo = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  
  const status = await registerUser(correo, password, firstName, lastName);

  if (status) {
    alert("Usuario creado exitosamente");

    // Limpiar los controles del formulario
    document.getElementById("registerEmail").value = '';
    document.getElementById("registerPassword").value = '';
    document.getElementById("firstName").value = '';
    document.getElementById("lastName").value = '';
  } else {
    alert("Ya existe un usuario asociado a este correo");
  }
});
  

// Manejo del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    // Intentar iniciar sesión
    const userData = await loginUser(email, password);
    
    if (userData) {
      // Redirigir a la página de contactos si el inicio de sesión fue exitoso
      window.location.href = "contacts.html";
    } else {
      alert("Usuario y/o contraseña incorrectos.");
    }
  } catch (error) {
    alert("Hubo un problema al iniciar sesión.");
    console.error("Error al iniciar sesión:", error.message);
  }
});

  