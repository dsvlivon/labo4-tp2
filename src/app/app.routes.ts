import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';

export const routes: Routes = [
    { path: 'bienvenido', component: BienvenidoComponent },
    { path: '', pathMatch: 'full', redirectTo: 'bienvenido' },
    { path: '', redirectTo: '/bienvenido', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'registro', component: RegistroComponent }
];
