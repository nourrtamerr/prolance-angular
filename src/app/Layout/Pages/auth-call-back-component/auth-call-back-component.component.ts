import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Shared/Services/Auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-call-back-component',
  imports: [],
  templateUrl: './auth-call-back-component.component.html',
  styleUrl: './auth-call-back-component.component.css'
})
export class AuthCallBackComponentComponent implements OnInit {
  
   constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr:ToastrService
  ) {}
  
    ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        console.error('Auth callback error:', error);
        this.toastr.error(decodeURIComponent(error), 'Authentication Failed');
        this.router.navigate(['/login']);
        return;
      }

      if (token) {
        try {
          // Decode the token and set user data
          this.authService.deCodeUserData(decodeURIComponent(token));
          this.toastr.success('Login successful!', 'Welcome');
          
          // Small delay to ensure auth state is updated
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 100);
        } catch (error) {
          console.error('Token processing error:', error);
          this.toastr.error('Authentication failed', 'Error');
          this.router.navigate(['/login']);
        }
      } else {
        console.error('No token received in auth callback');
        this.toastr.error('No authentication token received', 'Error');
        this.router.navigate(['/login']);
      }
    });
  }

}
