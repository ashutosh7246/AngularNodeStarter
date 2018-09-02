import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { AuthGuard } from '../../shared/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: '../../dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard]  },
            { path: 'user-profile', loadChildren: '../../user-profile/user-profile.module#UserProfileModule', canActivate: [AuthGuard]  },
            { path: 'table-list', loadChildren: '../../table-list/table-list.module#TableListModule', canActivate: [AuthGuard]  },
            { path: 'icons', loadChildren: '../../icons/icon.module#IconsModule', canActivate: [AuthGuard]  },
            { path: 'maps', loadChildren: '../../maps/maps.module#MapsModule', canActivate: [AuthGuard]  },
            { path: 'reset-password', loadChildren: '../../change-password/reset-password.module#ResetPasswordModule', canActivate: [AuthGuard]  },
            { path: 'typography', loadChildren: '../../typography/typograpgy.module#TypographyModule', canActivate: [AuthGuard]  },
            {
                path: 'notifications', loadChildren: '../../notifications/notifications.module#NotificationsModule',
                canActivate: [AuthGuard]
            },
            { path: 'upgrade', loadChildren: '../../upgrade/upgrade.module#UpgradeModule', canActivate: [AuthGuard]  },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminLayoutRoutes { }
