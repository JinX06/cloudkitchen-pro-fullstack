import { Injectable, signal } from '@angular/core';

import { AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private readonly userSignal = signal<AuthUser | null>(null);

  readonly currentUser = this.userSignal.asReadonly();

  setUser(user: AuthUser | null) {
    this.userSignal.set(user);
  }

  clear() {
    this.userSignal.set(null);
  }

  getUser(): AuthUser | null {
    return this.userSignal();
  }

  getUserId(): string | null {
    return this.userSignal()?.userId ?? null;
  }
}
