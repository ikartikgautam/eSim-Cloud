import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-exit-confirm-dialog',
  templateUrl: './exit-confirm-dialog.component.html',
  styleUrls: ['./exit-confirm-dialog.component.css']
})
export class ExitConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExitConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

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

}
