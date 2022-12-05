import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Heroe, Publisher } from '../../interfaces/heroe';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `]
})
export class AgregarComponent implements OnInit {
  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  };

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    // Comprobaciones antes de editar
    // Para saber si estamos en la página editar:
    // console.log(this.router.url); // nos dice la url que estamos
    // console.log(this.router.url.includes('editar')); // nos dice si la url que estamos contiene editar(nos dará TRUE si estamos en editar)

    if (!this.router.url.includes('editar')) { // si no contiene editar, no deja editar el personaje
      return
    }

    // Para realmente editar:
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroePorId(id))
      )
      .subscribe(heroe => this.heroe = heroe);

  }

  guardar() {

    if (this.heroe.superhero.trim().length === 0) {
      return;
    }

    if (this.heroe.id) { // si tiene id
      // Editar / Actualizar
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe(heroe => this.mostrarSnackBar('Registro Actualizado'));
    } else {
      // Crear
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]); // irá al apartado de ver heroe :D
          this.mostrarSnackBar('Registro Creado');
        })
    }
  }


  borrarHeroe() {
    // Hacer la pregunta, con el servicio de dialog
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    })

    dialog.afterClosed().subscribe( // despues de cerrar, se suscribirá y nos enviará la resultado
      (result) => {
        this.heroesService.borrarHeroe(this.heroe.id!)
          .subscribe(resp => {
            this.router.navigate(['/heroes'])
          })
      }
    )
  }

  mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Okay', {
      duration: 2500
    })
  }
}
