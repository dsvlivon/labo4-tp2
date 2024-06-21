import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { HabilitarUsuariosComponent } from './componentes/habilitar-usuarios/habilitar-usuarios.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'bienvenido', component: BienvenidoComponent },
    { path: '', pathMatch: 'full', redirectTo: 'bienvenido' },
    { path: '', redirectTo: '/bienvenido', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'registro', component: RegistroComponent },
    { path: 'habilitar-usuarios', component: HabilitarUsuariosComponent, canActivate: [adminGuard] },
];
