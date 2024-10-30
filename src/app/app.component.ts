import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AppService } from './service/app.service';
import { CommonModule } from '@angular/common';
import { TuiRoot } from "@taiga-ui/core";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TuiRoot, RouterModule ],
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
