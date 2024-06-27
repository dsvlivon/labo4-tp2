import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { User, sendEmailVerification } from 'firebase/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loginsCollection:any[] = [];
  public user:string = "";
  public countLogins:number = 0;
  private sub!:Subscription;
  
  constructor(private auth: Auth) {}

  async registrarConVerificacion({ email, clave }: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, clave);
      const user = this.auth.currentUser;

      if (user) {
        await sendEmailVerification(user);
        alert("El usuario ha sido creado con éxito! \nPor favor, verifique en su casilla de correo el mail de verificación.");
        signOut(this.auth);
      }    
      // console.error("credenciales during registration:", userCredential);
      return userCredential;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }


  async registrar({email, clave}: any){
    return createUserWithEmailAndPassword(this.auth, email, clave)
  }

  login({ email, clave }: any) {
    return signInWithEmailAndPassword(this.auth, email, clave);
  }

  setAuth(auth:Auth){
    this.auth=auth;
  }

  getAuth (){
    return this.auth;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    localStorage.removeItem('user');
    return signOut(this.auth);
  }


}
