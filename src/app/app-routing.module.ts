import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'home',
    // loadChildren: './home/home.module#HomePageModule',
    loadChildren: './pages/Homepage/hpage.module#HpagePageModule',
    canActivate: [AuthGuard]
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  {
    path: 'setting',
    loadChildren: './pages/setting/setting.module#SettingPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'hpage',
    loadChildren: './pages/Homepage/hpage.module#HpagePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list-create',
    loadChildren: './pages/list-create/list-create.module#ListCreatePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list-detail/:id',
    loadChildren: './pages/list-detail/list-detail.module#ListDetailPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'search/:keyword',
    loadChildren: './pages/search/search.module#SearchPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'task-create',
    loadChildren: './pages/task-create/task-create.module#TaskCreatePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: './pages/about/about.module#AboutPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'archive',
    loadChildren: './pages/archive/archive.module#ArchivePageModule',
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
