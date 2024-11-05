import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet,ActivatedRoute  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppService } from '../../service/app.service';
import { TuiScrollbar } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TuiDataList } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

import {NgForOf} from '@angular/common';
import {TuiButton, TuiDropdown} from '@taiga-ui/core';
import {TuiCheckbox, TuiChevron, TuiSwitch} from '@taiga-ui/kit';

interface Type {
  name: string,
  code: string
}


@Component({
  selector: 'app-main-page',  
  standalone: true,
  imports: [ButtonModule, MultiSelectModule, RouterLink, RouterOutlet, CommonModule, TuiScrollbar, FormsModule, NgForOf, TuiButton, TuiCheckbox, TuiChevron, TuiSwitch, TuiDataList, TuiDropdown],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {


  types!: Type[];

  selectedTypes!: Type[];

  pokemonDetailsList: any[] = [];
  filteredPokemonList: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(
    private apiService:AppService,    
    private router: Router,
  ){}

  async ngOnInit(): Promise<void> {
    this.loadType()
    await this.loadPokemon()
  }

  loadType() : void{
    this.types = [
      { name: 'Normal', code: 'N' },
      { name: 'Fighting', code: 'F' },
      { name: 'Flying', code: 'FL' },
      { name: 'Poison', code: 'P' },
      { name: 'Ground', code: 'G' },
      { name: 'Rock', code: 'R' },
      { name: 'Bug', code: 'B' },
      { name: 'Ghost', code: 'GH' },
      { name: 'Steel', code: 'S' },
      { name: 'Fire', code: 'FI' },
      { name: 'Water', code: 'W' },
      { name: 'Grass', code: 'GR' },
      { name: 'Electric', code: 'E' },
      { name: 'Psychic', code: 'PS' },
      { name: 'Ice', code: 'I' },
      { name: 'Dragon', code: 'D' },
      { name: 'Dark', code: 'DK' },
      { name: 'Fairy', code: 'FA' },
      { name: 'Unknown', code: 'U' },
      { name: 'Shadow', code: 'SH' }
    ];
  }

  onTypeSelect(event: Event) {
    /* const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    this.selectedTypes = Array.from(selectedOptions).map(option => option.value);
    
    this.filteredPokemonList = this.pokemonDetailsList.filter(pokemon => 
      this.selectedTypes.length === 0 || pokemon.types.some(type => this.selectedTypes.includes(type.type.name))
    ); */
  }
  


  async loadPokemon() {
    try {
      const data: any = await this.apiService.getAllPokemon(100).toPromise();
      const pokemonPromises = data.results.map((pokemon: any) =>
        this.apiService.getPokemonByUrl(pokemon.url).toPromise()
      );
      
      this.pokemonDetailsList = await Promise.all(pokemonPromises);
      this.filteredPokemonList = [...this.pokemonDetailsList];
      
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
      this.filteredPokemonList = [...this.pokemonDetailsList];
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

