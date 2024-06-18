import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { sendEmailVerification } from 'firebase/auth';
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

  async registrar({ email, clave }: any) {
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, clave);

      // Get the current user
      const user = this.auth.currentUser;

      // Send email verification
      if (user) {
        await sendEmailVerification(user);
        alert("Su usuario ha sido creado con exito! \nPor favor verifique en su casilla de correo el mail de verificación.");
        signOut(this.auth);
      }

      

      return userCredential;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }

  login({ email, clave }: any) {
    let x = signInWithEmailAndPassword(this.auth, email, clave); 
    // console.log(x);
    return x;
  }

  setAuth(auth:Auth){
    this.auth=auth;
  }

  getAuth (){
    return this.auth;
  }
  getCurrentUser (){
    return this.auth.currentUser  ;
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  getUser() {
    let localstorage = localStorage.getItem('user');
    if( localstorage != null) {
      return JSON.parse(localstorage);
    }
  }

}
