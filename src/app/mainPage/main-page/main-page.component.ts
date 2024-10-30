import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet,ActivatedRoute  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppService } from '../../service/app.service';
import { TuiScrollbar } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TuiDataList } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


import {NgForOf} from '@angular/common';
import {TuiButton, TuiDropdown} from '@taiga-ui/core';
import {TuiCheckbox, TuiChevron, TuiSwitch} from '@taiga-ui/kit';


import {FormControl, ReactiveFormsModule} from '@angular/forms';
import type {TuiBooleanHandler} from '@taiga-ui/cdk';
import {TUI_DEFAULT_MATCHER, tuiPure} from '@taiga-ui/cdk';
import {TuiDataListWrapper} from '@taiga-ui/kit';
 
const ITEMS: readonly string[] = [
    'Luke Skywalker',
    'Leia Organa Solo',
    'Darth Vader',
    'Han Solo',
    'Obi-Wan Kenobi',
    'Yoda',
];




@Component({
  selector: 'app-main-page',  
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, TuiScrollbar, FormsModule, NgForOf, TuiButton, TuiCheckbox, TuiChevron, TuiSwitch, TuiDataList, TuiDropdown],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {

  pokemonDetailsList: any[] = [];
  filteredPokemonList: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(
    private apiService:AppService,    
    private router: Router,
  ){}

  async ngOnInit(): Promise<void> {
    await this.loadPokemon()
  }


  async loadPokemon() {
    try {
      const data: any = await this.apiService.getAllPokemon(100).toPromise();
      const pokemonPromises = data.results.map((pokemon: any) =>
        this.apiService.getPokemonByUrl(pokemon.url).toPromise()
      );
      
      this.pokemonDetailsList = await Promise.all(pokemonPromises);
      this.filteredPokemonList = [...this.pokemonDetailsList]; // Inicializa la lista filtrada aquí
      await this.loadTypeIcons();
      console.log(this.pokemonDetailsList);
    } catch (error) {
      console.error('Error al cargar Pokémon:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.filteredPokemonList = this.pokemonDetailsList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPokemonList = [...this.pokemonDetailsList]; // Para mostrar todos si no hay término de búsqueda
    }
  }
  

  async loadTypeIcons() {
    for (let pokemon of this.pokemonDetailsList) {
      if (pokemon.types) {
        for (let type of pokemon.types) {
          const typeDetails = await this.apiService.getTypeByName(type.type.name).toPromise();
          type.iconUrl = typeDetails.sprites['generation-viii']['legends-arceus'].name_icon;
        }
      }
    }
  }

  goToDetail(pokemonId: number) {
    this.router.navigate(['detail', pokemonId]);
  }
  
}

