import { Injectable } from '@angular/core';
import { collectionData, Firestore, addDoc, collection, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { query, where } from '@angular/fire/firestore';

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
 
  obtenerDatoSinId(coleccion: string): Observable<any[]> {
    const lista = collection(this.fireStore, coleccion);
    // console.log("obtenerDatoSinId conteo: ", lista);
    return collectionData(lista) as Observable<any[]>;
  }

  obtenerDato(coleccion: string): Observable<any[]> {
    const lista = collection(this.fireStore, coleccion);
    // console.log("obtenerDato conteo: ", lista);
    return collectionData(lista, { idField: 'id' }) as Observable<any[]>;
  }

  obtenerDatoPorCriterio(coleccion: string, criterio: string, index: string): Observable<any[]> {
    //obtenerDatoPorCriterio('usuarios', 'email', value);
    const col = collection(this.fireStore, coleccion);
    const q = query(col, where(criterio, '==', index));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  actualizarObj(coleccion:string ,id: string, estadoAcceso: any) {
    const dataRef = doc(this.fireStore, coleccion, id);
    updateDoc(dataRef, { estadoAcceso });
  }

  actualizarUser(coleccion:string ,id: string, estadoAcceso: any, historiaClinica?: boolean, ) {
    const dataRef = doc(this.fireStore, coleccion, id);
    const updateData: any = {};

    if (estadoAcceso != "") { updateData.estadoAcceso = estadoAcceso; }
    if (historiaClinica) { updateData.historiaClinica = historiaClinica; }

    return updateDoc(dataRef, updateData);    
  }

  actualizarHorarios(coleccion:string ,id: string, misHorarios: any) {
    const dataRef = doc(this.fireStore, coleccion, id);
    updateDoc(dataRef, {
      misHorarios
    });
  }

  actualizarTurnos(coleccion: string, id: string, estado: string, comentario?: string, resena?: string, rate?: number, encuesta?: any) {
    const dataRef = doc(this.fireStore, coleccion, id);
    const updateData: any = { estado };
    if (comentario != "") { updateData.comentario = comentario; }
    if (resena != "") { updateData.resena = resena; }
    if (rate != 999) { updateData.calificacion = rate; }
    if (encuesta != null) { updateData.encuesta = encuesta; }
    return updateDoc(dataRef, updateData);
  }


  deleteDato(obj: any, collection: string) {
    const docRef = doc(this.fireStore, collection, obj.id);
    return deleteDoc(docRef);
  }   
}
