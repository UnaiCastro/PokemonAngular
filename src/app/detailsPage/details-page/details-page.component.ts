import { Component, OnInit } from '@angular/core';
import { RouterOutlet,ActivatedRoute  } from '@angular/router';
import { AppService } from '../../service/app.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.scss'
})
export class DetailsPageComponent implements OnInit {
  pokemonId: string | null = null;
  pokemon: any; // Aquí almacenarás los datos del Pokémon

  constructor(
    private route: ActivatedRoute,
    private apiService: AppService // Tu servicio para obtener datos de la API
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id'); // Obtén el ID del Pokémon desde la ruta
      if (this.pokemonId) {
        this.loadPokemonDetails(this.pokemonId);
      }
    });
  }

  async loadPokemonDetails(id: string) {
    try {
      this.pokemon = await this.apiService.getPokemonByUrl(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise();
    } catch (error) {
      console.error('Error al cargar los detalles del Pokémon:', error);
    }
  } 

}
