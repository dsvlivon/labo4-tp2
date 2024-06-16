import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
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

  registrar({email, clave}: any){
    return createUserWithEmailAndPassword(this.auth, email, clave)
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
