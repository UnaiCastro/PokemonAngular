import { Component, OnInit } from '@angular/core';
import { RouterOutlet,ActivatedRoute  } from '@angular/router';
import { AppService } from '../../service/app.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface VersionGroupDetail {
  level_learned_at: number;
  // agrega más propiedades aquí si es necesario
}

interface Pokemon {
  name: string;
  types: PokemonType[];
  stats: PokemonStat[];
  // Agrega otros atributos relevantes según tus necesidades
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.scss'
})
export class DetailsPageComponent implements OnInit {

  colors: { [key: string]: string } = {
    grass: '#78C850',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878',
  };


  pokemonId: string | null = null;
  pokemon: any;
  pokemonStats: any[]=[];
  abilities: any[] = [];
  heldItems: any[] = [];
  levelZeroMoves: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: AppService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id');
      if (this.pokemonId) {
        this.loadPokemonDetails(this.pokemonId);
      }
    });
  }

  async loadPokemonDetails(id: string) {
    try {
      this.pokemon = await this.apiService.getPokemonByUrl(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise();
      console.log(this.pokemon)
      await this.loadStats()
      await this.loadTypeIcons();
      await this.loadAbilitiesDetails();
      if (this.pokemon.held_items) {
        await this.loadHeldItemsDetails(this.pokemon.held_items);
      }
      if (this.pokemon.moves) {
        await this.loadLevelZeroMoves(this.pokemon.moves);
      }
    } catch (error) {
      console.error('Error al cargar los detalles del Pokémon:', error);
    }
  } 

  async loadHeldItemsDetails(heldItems: any[]) {
    this.heldItems = await Promise.all(
      heldItems.map(async (itemData) => {
        const itemDetails = await this.apiService.getItemByUrl(itemData.item.url).toPromise();
        return {
          name: itemData.item.name,
          attribute: itemDetails.attributes?.[0]?.name || '',
          cost: itemDetails.cost,
          category: itemDetails.category.name,
          effect: itemDetails.effect_entries.find((e: any) => e.language.name === 'en')?.effect || '',
          sprite: itemDetails.sprites.default || ''
        };
      })
    );
  }

  async loadAbilitiesDetails() {
    this.abilities = [];

    for (let abilityInfo of this.pokemon.abilities) {
      const abilityUrl = abilityInfo.ability.url;

      try {
        const abilityData = await this.apiService.getAbilityByUrl(abilityUrl).toPromise();
        const englishEffect = abilityData.effect_entries.find(
          (entry: any) => entry.language.name === 'en'
        );

        if (englishEffect) {
          this.abilities.push({
            name: abilityInfo.ability.name,
            effect: englishEffect.effect,
            shortEffect: englishEffect.short_effect
          });
        }
      } catch (error) {
        console.error(`Error al cargar detalles de la habilidad ${abilityInfo.ability.name}:`, error);
      }
    }
  }

  async loadLevelZeroMoves(moves: any[]) {
    const levelZeroMoves = moves.filter(moveData =>
      moveData.version_group_details.some((vgd: VersionGroupDetail) => vgd.level_learned_at === 0)
    );

    this.levelZeroMoves = await Promise.all(
      levelZeroMoves.map(async (moveData) => {
        const moveDetails = await this.apiService.getMoveByUrl(moveData.move.url).toPromise();
        return {
          name: moveData.move.name,
          type: moveDetails.type.name,
          power: moveDetails.power,
          accuracy: moveDetails.accuracy,
          pp: moveDetails.pp,
          priority: moveDetails.priority,
          effect: moveDetails.effect_entries.find((e: any) => e.language.name === 'en')?.short_effect || '',
          damageInfo: moveDetails.damage_class.name
        };
      })
    );
  }


  async loadStats(){
    this.pokemonStats = this.pokemon.stats
  }

  async loadTypeIcons() {
      if (this.pokemon.types) {
        for (let type of this.pokemon.types) {
          const typeDetails = await this.apiService.getTypeByName(type.type.name).toPromise();
          type.iconUrl = typeDetails.sprites['generation-viii']['legends-arceus'].name_icon;
        }
      }
    }

    getStatColorClass(): string {
      const primaryType = this.pokemon.types[0]?.type.name;
      
      switch (primaryType) {
        case 'grass': return 'bg-grass';
        case 'fire': return 'bg-fire';
        case 'water': return 'bg-water';
        case 'electric': return 'bg-electric';
        case 'ice': return 'bg-ice';
        case 'fighting': return 'bg-fighting';
        case 'poison': return 'bg-poison';
        case 'ground': return 'bg-ground';
        case 'flying': return 'bg-flying';
        case 'psychic': return 'bg-psychic';
        case 'bug': return 'bg-bug';
        case 'rock': return 'bg-rock';
        case 'ghost': return 'bg-ghost';
        case 'dragon': return 'bg-dragon';
        case 'dark': return 'bg-dark';
        case 'steel': return 'bg-steel';
        case 'fairy': return 'bg-fairy';
        default: return 'bg-normal'; // Color por defecto si el tipo no coincide
      }
    }

    getPokemonColor(): string {
      const typeColors = this.pokemon.types.map((type: PokemonType) => this.colors[type.type.name]); // Añade el tipo explícitamente aquí
      return `linear-gradient(to right, ${typeColors.join(', ')})`;
    }
    
}


