import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme/theme.service';
import { Router } from '@angular/router';
import { transition, trigger, query, style, animate, group, animateChild } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('myAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [style({ opacity: 0 })],
          { optional: true }
        ),
        query(
          ':leave',
           [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
          { optional: true }
        ),
        query(
          ':enter',
          [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
          { optional: true }
        )
      ])
    ])
  ] // register the animations
})
export class AppComponent implements OnInit {
  title = 'ip-store';
  addLightColor = false;
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const active = this.themeService.getActiveTheme();
  }

  toggle() {
    const active = this.themeService.getActiveTheme() ;
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
      this.addLightColor = true;
    } else {
      this.themeService.setTheme('light');
      this.addLightColor = false;
    }
  }
}
