import { Injectable } from '@angular/core';
import { collectionData, Firestore, addDoc, collection, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public res: any[] = [];
  public actores: any[] = [];
  public countRes: number = 0;

  constructor(private fireStore: Firestore) {}

  setData(obj: any, coleccion: string) {
    const col = collection(this.fireStore, coleccion);
    addDoc(col, obj);
  }

  obtenerUsuarios(): Observable<any[]> {
    const usuarios = collection(this.fireStore, 'usuarios');
    return collectionData(usuarios) as Observable<any[]>;
  }  

  obtenerDatoSinId(coleccion: string): Observable<any[]> {
    const lista = collection(this.fireStore, coleccion);
    console.log("obtenerDatoSinId conteo: ", lista);
    return collectionData(lista) as Observable<any[]>;
  }

  obtenerDato(coleccion: string): Observable<any[]> {
    const lista = collection(this.fireStore, coleccion);
    console.log("obtenerDato conteo: ", lista);
    return collectionData(lista, { idField: 'id' }) as Observable<any[]>;
  }

  actualizarPelicula(id: string, nombre: string, tipo: string, fechaEstreno: string, cantidadPublico: number, foto: string, actor: string) {
    const dataRef = doc(this.fireStore, 'peliculas', id);
    updateDoc(dataRef, {
      nombre,
      tipo,
      fechaEstreno,
      cantidadPublico,
      foto,
      actor
    });
  }

  deleteDato(obj: any, collection: string) {
    const docRef = doc(this.fireStore, collection, obj.id);
    return deleteDoc(docRef);
  }   
}
