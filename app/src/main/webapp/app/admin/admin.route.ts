import {Routes} from '@angular/router';

import {UserRouteAccessService} from '../shared';

import {auditsRoute, configurationRoute, docsRoute, gatewayRoute, healthRoute, logsRoute, metricsRoute, userDialogRoute, userMgmtRoute} from './';

const ADMIN_ROUTES = [
    auditsRoute,
    configurationRoute,
    docsRoute,
    healthRoute,
    logsRoute,
    gatewayRoute,
    ...userMgmtRoute,
    metricsRoute
];

export const adminState: Routes = [
    {
        path: '',
        data: {
            authorities: ['ROLE_ADMIN']
        },
        canActivate: [UserRouteAccessService],
        children: ADMIN_ROUTES
    },
    ...userDialogRoute
];
