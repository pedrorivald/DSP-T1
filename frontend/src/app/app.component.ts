import {HttpClientModule} from '@angular/common/http';
import {Component, inject, LOCALE_ID, model, OnInit, signal} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Vaga } from '../models/vaga';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { VagasTotal } from '../models/vagas-total';
import { VagasHash256 } from '../models/vagas-hash-256';
import { VagasService } from '../services/vagas.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Filters } from '../models/filters';
import { MatSelectModule } from '@angular/material/select';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  imports: [
    MatProgressSpinnerModule, 
    MatTableModule, 
    MatSelectModule,
    MatSortModule, 
    MatPaginatorModule, 
    DatePipe, 
    HttpClientModule, 
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);
  private vagasService = inject(VagasService);

  displayedColumns: string[] = ["id", "tipo", "categoria", "empresa", "status", "data_criacao"];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any = null;

  data: Vaga[] = [];

  hash: VagasHash256 = { hash_sha256: "" };
  total: VagasTotal = { total: 0 };
  filters: Filters = {} as Filters;

  isLoadingResults = true;

  ngOnInit(): void {
    this.list();
  }

  openSnackBar(msg: string) {
    const config: MatSnackBarConfig = { duration: 5000 };
    this._snackBar.open(msg, "Ok", config);
  }

  list() {
    this.getTotal();
    this.isLoadingResults = true;

    this.vagasService.list(this.filters).subscribe(
      (next) => {
        this.data = next;
        this.isLoadingResults = false;
      },
      (error) => {
        this.openSnackBar("Não foi possível listar.");
        this.isLoadingResults = false;
      }
    );
  }

  edit(vaga: Vaga) {
    this.vagasService.edit(vaga).subscribe(
      (next) => {
        this.list();
        this.openSnackBar("Vaga editada com sucesso!!");
      },
      (error) => {
        this.openSnackBar("Não foi possível editar.");
      }
    );
  }

  create(vaga: Vaga) {
    this.vagasService.create(vaga).subscribe(
      (next) => {
        this.list();
        this.openSnackBar("Vaga cadastrada com sucesso!!");
      },
      (error) => {
        this.openSnackBar("Não foi possível cadastrar.");
      }
    );
  }

  remove(id: string) {
    this.vagasService.remove(id).subscribe(
      (next) => {
        this.list();
        this.openSnackBar("Vaga removida com sucesso!!");
      },
      (error) => {
        this.openSnackBar("Não foi possível remover.");
      }
    );
  }

  downloadZip() {
    this.vagasService.downloadZip().subscribe({
      next: (response) => {
        const hashValue = response.headers.get('Zip-File-Hash') ?? ''; 
        console.log(response.headers.get('Zip-File-Hash'))

        const url = window.URL.createObjectURL(response.body!);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vagas.zip';
        a.click();

        window.URL.revokeObjectURL(url);

        this.openSnackBar("ZIP gerado com sucesso!!");
        this.openHashDialog(hashValue);
      },
      error: (err) => {
        this.openSnackBar("Não foi possível baixar o ZIP.");
      }
    });
  }

  getTotal() {
    this.vagasService.getTotal().subscribe(
      (next) => {
        this.total = next;
      },
      (error) => {
        this.openSnackBar("Não foi possível obter o total.");
      }
    );
  }

  getHash256() {
    this.vagasService.getHash256().subscribe(
      (next) => {
        this.hash = next;
        this.openHashDialog(this.hash.hash_sha256);
      },
      (error) => {
        this.openSnackBar("Não foi possível obter o hash do CSV.");
      }
    );
  }

  readonly dialog = inject(MatDialog);

  openEditDialog(vaga: Vaga): void {
    let vagaRef: Vaga = { ...vaga };
    const dialogRef = this.dialog.open(DialogVagasEdit, { data: vagaRef });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.edit(result);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DialogVagasCreate);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.create(result);
      }
    });
  }

  openHashDialog(hash: string): void {
    const dialogRef = this.dialog.open(DialogVagasHash, { data: hash, width: "600px" });
    dialogRef.afterClosed().subscribe(result => {});
  }
}

@Component({
  selector: 'vagas-edit-dialog',
  templateUrl: 'vagas-edit-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogVagasEdit {
  readonly dialogRef = inject(MatDialogRef<DialogVagasEdit>);
  data = inject<Vaga>(MAT_DIALOG_DATA);

  form() {
    return this.data;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'vagas-create-dialog',
  templateUrl: 'vagas-create-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogVagasCreate {
  readonly dialogRef = inject(MatDialogRef<DialogVagasCreate>);
  data: Vaga = {} as Vaga;

  form() {
    return this.data;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'vagas-hash-dialog',
  templateUrl: 'vagas-hash-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogVagasHash {
  readonly dialogRef = inject(MatDialogRef<DialogVagasHash>);
  data = inject<Vaga>(MAT_DIALOG_DATA);
}