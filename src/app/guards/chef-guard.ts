import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserContextService } from '../services/user-context.service';
import { AccessDenied } from './access-denied/access-denied';

@Injectable({
  providedIn: 'root'
})
export class ChefGuard implements CanActivate {
  private readonly userContext = inject(UserContextService);
  private modalService: NgbModal = inject(NgbModal);

  canActivate(): boolean {
    const user = this.userContext.getUser();
    if (!user) {
      return true;
    }

    const allowed = user.role === 'chef';
    if (!allowed) {
      this.showModal();
    }
    return allowed;
  }

  private showModal() {
    const modalRef = this.modalService.open(AccessDenied);
  }
}
