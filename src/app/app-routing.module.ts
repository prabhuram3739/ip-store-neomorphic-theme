import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IpComponent } from './ip/ip.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: HomeComponent},
  { path: 'platform/:platformName/:releaseName', component: DetailComponent },
  { path: 'ip/:ipName/:modelDescShort/:buildTime', component: IpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [HomeComponent, DetailComponent];
