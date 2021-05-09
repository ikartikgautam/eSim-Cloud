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
  galleryIndex = null

  constructor(public dialogRef: MatDialogRef<ExitConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _router: Router) {
    if (data.type == 'gallery') {
      this.galleryIndex = data.index
      this.dbProject = data.dbResult;
    }else{
      this.dbProject = data;
    }
  }

  ngOnInit() {
  }

  /**
   * Open already existing project from temporary DB
   */
  GoToOld() {
    console.log('old')
    console.log(this.dbProject)
    this._router.navigate(['/simulator'], { queryParams: { id: this.dbProject.id, temporary: true } })
    this.dialogRef.close();
  }

  /**
   * Open New project after clearing DB
   */
  openNew() {
    SaveTemporarily.getDbInstanceAndClearDb().then(res => {
      if (this.galleryIndex)
        this._router.navigate(['simulator'], { queryParams: { gallery: this.galleryIndex } })
      else
        this._router.navigate(['/simulator'])

      this.dialogRef.close();
    }).catch(err => {
      console.log(err)
      // Report Error
    })
  }

}
