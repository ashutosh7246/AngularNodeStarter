import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../common/services/local-storage.service';

@Injectable()
export class AuthGuard implements CanActivate {

    public count = 0;
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.localStorageService.getValue('accessToken')) {
            return true;
        }
        this.router.navigate(['login']);
        return false;
    }
}
