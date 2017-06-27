import {Route} from '@angular/router';

import {JhiConfigurationComponent} from './configuration.component';

export const configurationRoute: Route = {
    path: 'smart-configuration',
    component: JhiConfigurationComponent,
    data: {
        pageTitle: 'configuration.title'
    }
};
