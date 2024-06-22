import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {

  constructor(private fireStore: Firestore) {}

  async subirImagenAsync(carpeta: string, nombreImagen: string, file: any): Promise<any> {
    const dir = `/${carpeta}/${nombreImagen}`;
    try {
      const storage = getStorage();
      const storageRef = ref(storage, dir);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
  
  async getImagenAsync(carpeta: string, nombreImagen: string): Promise<string> {
    const dir = `/${carpeta}/${nombreImagen}`;
    try {
      const storage = getStorage();
      const imagesRef = ref(storage, dir);
      const url = await getDownloadURL(imagesRef);
      return url;
    } catch (error) {
      console.error('Error al obtener la URL de la imagen:', error);
      throw error;
    }
  }
}
