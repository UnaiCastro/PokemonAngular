import { TuiRoot } from "@taiga-ui/core";
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './service/app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'PokemonGuarro';
  pokemonName : string = "";
  pokemon:any;
  svgUrl : string = "";

  constructor(private apiService:AppService){}
  ngOnInit(): void {
    
  }
}
