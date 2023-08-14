import { Component, OnInit, AfterViewInit, Optional, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { getMessaging, getToken } from "firebase/messaging";
import { Messaging, MessagingInstances, MessagingModule, onMessage } from '@angular/fire/messaging';
import { getApp } from '@angular/fire/app';
import { EMPTY, Observable, from, share, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Auth } from '@angular/fire/auth';

import 'firebase/messaging';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nudger-au';

  token$: Observable<any> = EMPTY;
  message$: Observable<any> = EMPTY;
  showRequest = false;

  constructor(@Optional() messaging: Messaging) {
    console.log('messaging', messaging);
    if (messaging) {
      this.token$ = from(
        navigator.serviceWorker.register('firebase-messaging-sw.js', { type: 'module', scope: '__' }).
          then(serviceWorkerRegistration =>
            getToken(messaging, {
              serviceWorkerRegistration,
              vapidKey: environment.vapidKey,
            })
          )).pipe(
            tap(token => console.log('FCM', { token })),
            share(),
          );
      this.message$ = new Observable(sub => onMessage(messaging, it => sub.next(it))).pipe(
        tap(token => console.log('FCM', { token })),
      );
    }
  }

  ngOnInit(): void {
  }

  request() {
    Notification.requestPermission();
  }

}
