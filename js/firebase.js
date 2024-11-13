import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, addDoc, setDoc, getDoc, getDocs, collection, query, where} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "",
    authDomain: "desarrollo-web-agenda.firebaseapp.com",
    projectId: "desarrollo-web-agenda",
    storageBucket: "desarrollo-web-agenda.firebasestorage.app",
    messagingSenderId: "983827071013",
    appId: "1:983827071013:web:356784b7dd6da1b3aebfcc"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth= getAuth(app);
  const db=getFirestore(app);

    // Función para registrar usuarios
 export async function registerUser(email,password,firstName,lastName){
  try{
      const userCredencial=await createUserWithEmailAndPassword(auth,email,password);
      const user=userCredencial.user;
      await setDoc(doc(db,"users",user.uid),{
        firstName,
        lastName,
        email,
        role:"user"
      })
      console.log('Usuario registrado exitosamente: ', userCredencial.user);
      return true;
    }
  catch(error){
      console.log('Error:' , error.message);
      return false;
  }
}

// Función para iniciar sesión
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos del usuario desde la base de datos
    const dataUser = await getDoc(doc(db, 'users', user.uid));

    if (dataUser.exists()) {
      console.log("Inicio de sesión exitoso:", dataUser.data().role);
      return dataUser.data(); // Devolver los datos del usuario
    } else {
      // Si el usuario no existe en la base de datos, lanzar un error
      throw new Error("El usuario no existe en la base de datos.");
    }
  } catch (error) {
    // Manejar los errores de inicio de sesión, ya sea por credenciales incorrectas o cualquier otro error
    console.error("Error en el inicio de sesión:", error.message);
    return null; // Retornar null en caso de error (esto evitará redirección)
  }
}


  

  export const getUsers = async () => {
    const result = await getDocs(collection(db, 'users'));
    return result.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  export const getUser = async (id) => {
    const result = await getDoc(doc(db, 'users', id));
    return result.exists() ? { id: result.id, ...result.data() } : null;
  };

  export async function getContactsByUser() {
    return new Promise((resolve, reject) => {
      // Esperar a que el estado de autenticación esté disponible
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        // Desuscribirse del listener para evitar múltiples llamadas
        unsubscribe();
  
        if (!user) {
          console.log("Usuario no autenticado");
          resolve([]);  // Si no está autenticado, retornamos un arreglo vacío
          return;
        }
  
        const contactsRef = collection(db, "contacts");
        const q = query(contactsRef, where("userId", "==", user.uid));
  
        try {
          const querySnapshot = await getDocs(q);
          
          // Si no hay contactos, devolvemos un arreglo vacío
          if (querySnapshot.empty) {
            console.log("No se encontraron contactos.");
            resolve([]);  // Devuelve un arreglo vacío si no hay contactos
            return;
          }
  
          // Mapear los documentos a un arreglo con los datos de los contactos
          const contacts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
  
          resolve(contacts);  // Devolvemos los contactos
        } catch (error) {
          console.error("Error al obtener los contactos:", error);
          resolve([]);  // Si hay un error, devolvemos un arreglo vacío
        }
      });
    });

  }

  export function saveContactToFirebase(contact) {
    return db.collection("contacts").add(contact)
      .then(() => {
        alert('Contacto guardado exitosamente');
      })
      .catch((error) => {
        console.error("Error al guardar el contacto: ", error);
        alert('Hubo un error al guardar el contacto. Inténtalo de nuevo.');
      });
  }

  // Función para guardar los datos del contacto en Firebase
export async function saveContact(contact) {
  try {
    await addDoc(collection(db, "contacts"), contact);
    alert('Contacto guardado exitosamente');
  } catch (error) {
    console.error("Error al guardar el contacto: ", error);
    alert('Hubo un error al guardar el contacto. Inténtalo de nuevo.');
  }
}

// Función para obtener el ID del usuario autenticado
export function getCurrentUserId() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}