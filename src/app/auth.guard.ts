import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './services/storage/storage.service';
 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

      

    // İstenilen rolü route'dan al
    const expectedRole = route.data['expectedRole'];

    // Token yoksa login sayfasına yönlendir
    if (!StorageService.getToken()) {
      return this.router.parseUrl('/login');
    }

    // Kullanıcının rolünü al
    const userRole = StorageService.getUserRole();
    

    // Eğer beklenen rol varsa kontrol et
    if (expectedRole) {
      
      if (Array.isArray(expectedRole)) {
        if (!expectedRole.includes(userRole)) {
          return this.router.parseUrl('/access-denied');
        }
      } else {
        if (userRole !== expectedRole) {
          return this.router.parseUrl('/access-denied');
        }
      }
    }

    if (!StorageService.isAdminLoggedIn()) {
      // yönlendirme yap, yetki yoksa
      // this.router.navigate(['/login']);
    }

    // Yetki tamam, route'a devam et
    return true;
  }

}
