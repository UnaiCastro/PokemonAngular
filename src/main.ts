import { provideAnimations } from "@angular/platform-browser/animations";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';

bootstrapApplication(AppComponent, {
  providers: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    provideAnimations(),
    ...appConfig.providers,
  ]
}).catch(err => console.error(err));


