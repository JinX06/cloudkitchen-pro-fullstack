import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

import { DashboardService } from '../services/dashboard.service';
import { UserContextService } from '../services/user-context.service';

export const authGuard = (route: any) => {
  const router = inject(Router);
  const dashboard = inject(DashboardService);
  const userContext = inject(UserContextService);

  const userId = route.queryParamMap.get('userId');
  if (!userId) {
    userContext.clear();
    router.navigate(['/welcome-34076352'], { replaceUrl: true });
    return false;
  }

  return dashboard.getStats(userId).pipe(
    map((result) => {
      if (result) {
        userContext.setUser(result.currentUser);
        return true;
      } else {
        userContext.clear();
        router.navigate(['/welcome-34076352'], { replaceUrl: true });
        return false;
      }
    }),
    catchError(() => {
      userContext.clear();
      return router.navigate(['/welcome-34076352'], { replaceUrl: true }).then(() => false);
    })
  );
};
