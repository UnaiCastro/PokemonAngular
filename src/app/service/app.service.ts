import { Injectable } from '@angular/core';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppService {

   private apiUrl = 'https://pokeapi.co/api/v2/'

  constructor(private http: HttpClient) { }

  getPokemonByName(idOrName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${idOrName}`);
  }

  getAllPokemonsFromAType(typeNumber: Number): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${typeNumber}`);
  }

  getAllPokemon(limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=${limit}&offset=0`);
  }

  getPokemonByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

  getTypeByName(typeName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${typeName}`);
  }

  getAllPokemonTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type`);
  }
}
