import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { DashboardService, DashboardStatsResponse } from '../../../services/dashboard.service';
import { UserContextService } from '../../../services/user-context.service';
import { QuickActions } from '../quick-actions/quick-actions';
import { AuthUser } from '../../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, QuickActions],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  protected userId = '';
  protected user!: AuthUser;
  protected lastUpdated: Date = new Date();

  protected totalUsers = 0;
  protected totalRecipes = 0;
  protected inventoryItems = 0;
  protected myRecipeCount = 0;
  protected cuisineCount = 0;

  protected error: string | null = null;

  private readonly router = inject(Router);
  private readonly dashboard = inject(DashboardService);
  private readonly userContext = inject(UserContextService);
  private refreshInterval: any;
  private dataSubscription: Subscription | null = null;

  constructor() {
    const contextUserId = this.userContext.getUserId();
    if (!contextUserId) {
      this.redirectToWelcome();
      return;
    }

    this.userId = contextUserId;
    const currentUser = this.userContext.getUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  ngOnInit() {
    this.loadData();

    // Set up auto-refresh every 30 seconds (30000 ms)
    this.refreshInterval = setInterval(() => {this.loadData();}, 30000);
  }

  loadData() {
    this.dataSubscription = this.dashboard.getStats(this.userId).subscribe(
      (stats) => this.handleStats(stats),
      (err) => this.handleError(err)
    );
  }
  private handleError(err: any): void {
    this.userContext.clear();

    if (err.status === 401 || err.status === 403) {
      this.redirectToWelcome();
      return;
    }

    const message = err.error?.error || 'Unable to load dashboard data.';
    this.error = message;
  }
  
  ngOnDestroy() {
    // Clear the interval and subscription when the component is destroyed
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private handleStats(stats: DashboardStatsResponse): void {
    this.user = stats.currentUser;
    this.userContext.setUser(stats.currentUser);
    this.totalUsers = stats.users;
    this.totalRecipes = stats.recipes;
    this.inventoryItems = stats.inventory;
    this.myRecipeCount = stats.myRecipeCount;
    this.cuisineCount = stats.cuisineCount;

    this.error = null;
    this.lastUpdated = new Date(); // date updates when data loads
  }


  private redirectToWelcome(): void {
    this.userContext.clear();
    this.router.navigate(['/welcome-34076352'], { replaceUrl: true });
  }
}
