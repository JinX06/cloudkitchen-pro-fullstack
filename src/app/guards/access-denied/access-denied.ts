import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserContextService } from '../../services/user-context.service';

@Component({
  selector: 'app-access-denied',
  imports: [],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css'
})
export class AccessDenied {
  protected readonly activeModal = inject(NgbActiveModal);
  protected readonly userContext = inject(UserContextService);

  protected confirm(): void {
    this.activeModal.close('confirm');
  }

  protected cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
