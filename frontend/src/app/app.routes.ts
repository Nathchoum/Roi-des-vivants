import { Routes } from '@angular/router';
import { AcceuilComponent } from './pages/acceuil/acceuil';
import { PlateauComponent } from './pages/plateau/plateau';
export const routes: Routes = [
    { path: '', component: AcceuilComponent },
    { path: 'plateau', component: PlateauComponent },
];
