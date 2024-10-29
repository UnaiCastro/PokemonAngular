import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../../service/app.service';
import { TuiScrollbar } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiSelect } from '@taiga-ui/core';
import { NgForOf } from '@angular/common';

import {FormControl, ReactiveFormsModule} from '@angular/forms';
import type {TuiBooleanHandler} from '@taiga-ui/cdk';
import {TUI_DEFAULT_MATCHER, tuiPure} from '@taiga-ui/cdk';
import {TuiDataList} from '@taiga-ui/core';
import {TuiDataListWrapper} from '@taiga-ui/kit';
import { TuiTextfield } from '@taiga-ui/core';


@Component({
  selector: 'app-root',  
  standalone: true,
  imports: [NgForOf, TuiScrollbar, FormsModule, TuiSelect ,ReactiveFormsModule, TuiDataList, TuiDataListWrapper,  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {

  pokemonDetailsList: any[] = [];
  filteredPokemonList: any[] = [];
  searchTerm: string = '';
  selectedTypes: string[] = [];
  selectedStat: string = '';
  pokemonTypes: string[] = []; 
  typeControl = new FormControl([]);
  search: string | null = '';
  statOptions = ['Attack', 'Defense', 'HP', 'Speed', 'Special-attack', 'Special-defense'];

  constructor(
    private apiService:AppService,    
    private router: Router,
  ){}

  async ngOnInit(): Promise<void> {
    await this.loadPokemon()
    await this.loadPokemonTypes
  }


  async loadPokemon() {
    try {
      const data: any = await this.apiService.getAllPokemon(100).toPromise();
      const pokemonPromises = data.results.map((pokemon: any) =>
        this.apiService.getPokemonByUrl(pokemon.url).toPromise()
      );
      this.pokemonDetailsList = await Promise.all(pokemonPromises);
      this.filteredPokemonList = [...this.pokemonDetailsList];
    } catch (error) {
      console.error('Error al cargar Pokémon:', error);
    }
  }

  async loadPokemonTypes() {
    try {
      const typesData: any = await this.apiService.getAllPokemonTypes().toPromise();
      this.pokemonTypes = typesData.results.map((type: any) => type.name);
    } catch (error) {
      console.error('Error al cargar los tipos de Pokémon:', error);
    }
  }

  filterPokemon() {
    this.filteredPokemonList = this.pokemonDetailsList.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedTypes.length === 0 || pokemon.types.some((type: any) => this.selectedTypes.includes(type.type.name));

      // Lógica de filtro para estadística, esta sección está comentada para que pruebes con nombre y tipo primero
      // const matchesStat = this.selectedStat === '' || pokemon.stats.some(
      //   (stat: any) => stat.stat.name === this.selectedStat.toLowerCase() && stat.base_stat > 50
      // );

      // return matchesName && matchesType && matchesStat;
      return matchesName && matchesType;
    });
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

  onSearch() {
    this.filterPokemon();
  }

  onFilterChange() {
    this.filterPokemon();
  }

  @tuiPure
  filter(search: string | null): readonly string[] {
    return this.pokemonTypes.filter((type) => TUI_DEFAULT_MATCHER(type, search || ''));
  }
  
}

