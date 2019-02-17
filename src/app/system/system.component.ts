import { Component, OnInit } from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  constructor( private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.stop();

    /*    Notification.requestPermission(function(permission) {
    // переменная permission содержит результат запроса
          console.log('Результат запроса прав:', permission);
        });

        let notification = new Notification('Сколько ТЫЖ программистов нужно чтобы вкрутить лампочку?',
          { body: 'Только ты!', dir: 'auto', icon: 'icon.jpg' }
        );
      }*/
  }

}
