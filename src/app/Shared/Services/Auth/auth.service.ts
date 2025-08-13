import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Environment } from '../../../base/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private apiUrl = `${Environment.baseUrl}Account`;
   userData = new BehaviorSubject<any>(null);
   private _isLoggedIn = signal<boolean>(false);

   //isLoggedIn = this._isLoggedIn;
  // isLoggedIn$ = toObservable(this._isLoggedIn);

  // constructor(private httpClient: HttpClient, private router: Router) {
  //   this.checkToken();
  // }

  // getTokenFromCookie(): string | null {
  //   const name = 'user_Token=';
  //   const decodedCookie = decodeURIComponent(document.cookie);
  //   const cookieArray = decodedCookie.split(';');

  //   for (let cookie of cookieArray) {
  //     while (cookie.charAt(0) === ' ') {
  //       cookie = cookie.substring(1);
  //     }
  //     if (cookie.indexOf(name) === 0) {
  //       return cookie.substring(name.length, cookie.length);
  //     }
  //   }
  //   return null;
  // }

    private tokenKey = 'user_Token';
  private userSubject = new BehaviorSubject<any>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private httpClient: HttpClient,private router: Router) {
    // Check for token on service initialization
    this.initializeAuthState();
  }

  private checkToken(): void {
    const token = this.getTokenFromCookie();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.userData.next(decoded);
        this._isLoggedIn.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=Lax`;
  }

  // logout(): void {
  //   this.deleteCookie('user_Token');
  //   this.userData.next(null);
  //   this._isLoggedIn.set(false);
  //   this.router.navigate(['/login']);
  // }

  login(userData: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login`, userData);
  }

  // deCodeUserData(token: string): void {
  //   try {
  //     const decoded = jwtDecode(token);
  //     this.userData.next(decoded);
  //     this._isLoggedIn.set(true);
  //   } catch {
  //     this.logout();
  //   }
  // }

  // getRole(): string | null {
  //   const token = this.getTokenFromCookie();
  //   if (!token) return null;

  //   try {
  //     const decoded: any = jwtDecode(token);
  //     return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  //   } catch {
  //     return null;
  //   }
  // }


  getRoles(): string[] | null {
    const token = this.getTokenFromCookie();
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      const rolesClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
      if (!rolesClaim) return null;
      return Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim];
    } catch {
      return null;
    }
  }



  getUserName(): string | null {
    const token = this.getTokenFromCookie();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
    } catch {
      return null;
    }
  }



  


  private initializeAuthState(): void {
    // First check localStorage (for manual login)
    let token = localStorage.getItem(this.tokenKey);
    
    // If no token in localStorage, check cookies (for external login)
    if (!token) {
      token = this.getTokenFromCookie();
    }

    if (token && !this.isTokenExpired(token)) {
      this.deCodeUserData(token);
      // Optionally save to localStorage for consistency
      localStorage.setItem(this.tokenKey, token);
    } else {
      this.logout();
    }
  }

   getTokenFromCookie(): string | null {
   
    const cookies = document.cookie.split(';');
    console.log(`cookies from getTokenFromCookie:${cookies}`)
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.tokenKey) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // deCodeUserData(token: string): void {
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
      
  //     const userData = {
  //       id: payload[Object.keys(payload).find(key => 
  //         key.includes('nameidentifier')) || ''],
  //       username: payload[Object.keys(payload).find(key => 
  //         key.includes('unique_name') || key.includes('name')) || ''],
  //       email: payload[Object.keys(payload).find(key => 
  //         key.includes('email')) || ''],
  //       role: payload[Object.keys(payload).find(key => 
  //         key.includes('role')) || '']
  //     };

  //     this.userSubject.next(userData);
  //     this.loggedInSubject.next(true);
      
  //     // Store in localStorage for consistency
  //     localStorage.setItem(this.tokenKey, token);
      
  //     console.log('User authenticated:', userData);
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     this.logout();
  //   }
  // }

  // Update your AuthService deCodeUserData method


    getUserId(): string | null {
    const token = this.getTokenFromCookie();
    if (!token) return null;

    try {
      // const decoded: any = jwtDecode(token);
      // return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    const payload = JSON.parse(atob(token.split('.')[1]));
      return payload[Object.keys(payload).find(key => key.includes('nameidentifier')) || '']
    } 
    
    catch {
      return null;
    }
  }


deCodeUserData(token: string): void {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const userData = {
      id: payload[Object.keys(payload).find(key => key.includes('nameidentifier')) || ''],

      username: payload[Object.keys(payload).find(key => 
        key.includes('unique_name') || key === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name') || ''],
      email: payload[Object.keys(payload).find(key => 
        key.includes('email')) || ''],
      role: payload[Object.keys(payload).find(key => 
        key.includes('role')) || '']
    };

    console.log('Decoded user data:', userData);
    console.log('Full token payload:', payload);

    this.userSubject.next(userData);
    this.loggedInSubject.next(true);
    
    // Store token in localStorage
    localStorage.setItem('user_Token', token);
    
  } catch (error) {
    console.error('Error decoding token:', error);
    this.logout();
  }
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    // Clear cookie as well
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    this.userSubject.next(null);
    this.loggedInSubject.next(false);

    // this.router.navigate(['/home']);

  }

  getRole(): string | null {
    const user = this.userSubject.value;
    return user?.role || null;
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  // Add this method to get current token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || this.getTokenFromCookie();
  }
  
}