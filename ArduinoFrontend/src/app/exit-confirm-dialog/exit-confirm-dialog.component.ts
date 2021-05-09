import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { SaveTemporarily } from '../Libs/SaveTemporarily';

@Component({
  selector: 'app-exit-confirm-dialog',
  templateUrl: './exit-confirm-dialog.component.html',
  styleUrls: ['./exit-confirm-dialog.component.css']
})
export class ExitConfirmDialogComponent implements OnInit {

  dbProject = null

  constructor(public dialogRef: MatDialogRef<ExitConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _router: Router) {
    this.dbProject = data;
  }

  ngOnInit() {
  }

  exit(choice: string = null) {
    this.dialogRef.close('ws')
    if (choice == 'ws') {
    } else if (choice == 'ts') {
      this.dialogRef.close('ts')
    } else if (choice == 'cs') {
      this.dialogRef.close('cs')
    } else {
      this.dialogRef.close(null)
    }
  }

  GoToOld() {
    console.log('old')
    console.log(this.dbProject)
    this._router.navigate(['/simulator'], { queryParams: { id: this.dbProject.id, temporary: true } })
    this.dialogRef.close();
    /**
     * Navigate to simulator
     * load project from memory
     * clear temporary DB
     */
  }

  openNew() {
    SaveTemporarily.getDbInstanceAndClearDb().then(res => {
      this._router.navigate(['/simulator'])
      this.dialogRef.close();
    }).catch(err => {
      console.log(err)
      // Report Error
    })
  }

}
