import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { FormsModule } from '@angular/forms';
import { PlatformComponent } from './platform/platform.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { ThemeModule } from './theme/theme.module';
import { lightTheme } from './theme/light-theme';
import { darkTheme } from './theme/dark-theme';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HighchartsService } from './highcharts.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IpComponent } from './ip/ip.component';


@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    PlatformComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    IpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light'
    }),
    MDBBootstrapModule.forRoot()
    ],
  providers: [ApiService, HighchartsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
