import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {}
