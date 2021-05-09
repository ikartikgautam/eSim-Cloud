import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ExitConfirmDialogComponent } from '../exit-confirm-dialog/exit-confirm-dialog.component';
import { SaveTemporarily } from '../Libs/SaveTemporarily';

/**
 * For Handling Time ie. Prevent moment error
 */
declare var moment;

/**
 * Class For Galley Page (Component)
 */
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  /**
   * Store Samples
   */
  samples: any[] = [];
  /**
   * Gallery Page Constructor
   * @param api API Service
   */
  constructor(
    private api: ApiService,
    private _router: Router,
    private _dialog: MatDialog,
  ) { }

  /**
   * On Init Page
   */
  ngOnInit() {
    // Add Page Title
    document.title = 'Gallery | Arduino On Cloud';
    // Show Loading animation
    window['showLoading']();
    // Fetch Samples
    this.api.fetchSamples().subscribe(samples => {
      this.samples = samples;
      // Hide Loading Animation
      window['hideLoading']();
    }, err => {
      // show error and hide animation
      console.log(err);
      window['hideLoading']();
    });

    // TODO: Fetch Published Circuit
  }
  /**
   * Returns the time difference from now in a string
   * @param item Gallery Card item
   */
  DateTime(item) {
    item.time = moment(item.create_time).fromNow();
  }

  openFromGallery(index) {
    // [routerLink]="['/simulator']" [queryParams]="{gallery:i}"

    SaveTemporarily.checkAvailableProjects().then(result => {

      if (result.length != 0)
        this._dialog.open(ExitConfirmDialogComponent, { data: { dbResult: result[0], type: 'gallery', index: index }, maxWidth: '300px' })
      else
        this._router.navigate(['simulator'], { queryParams: { gallery: index } })

    }).catch(err => { console.log(err) })

  }
}
