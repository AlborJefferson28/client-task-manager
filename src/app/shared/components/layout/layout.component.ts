import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from "../menubar/menubar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarComponent
],
  templateUrl: './layout.component.html',
  styles: ``
})
export class LayoutComponent {

}
