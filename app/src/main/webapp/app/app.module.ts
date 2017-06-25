import './vendor.ts';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Ng2Webstorage} from 'ng2-webstorage';

import {AppSharedModule, UserRouteAccessService} from './shared';
import {AppHomeModule} from './home/home.module';
import {AppAdminModule} from './admin/admin.module';
import {AppAccountModule} from './account/account.module';
import {AppEntityModule} from './entities/entity.module';

import {customHttpProvider} from './blocks/interceptor/http.provider';
import {PaginationConfig} from './blocks/config/uib-pagination.config';
import {ActiveMenuDirective, ErrorComponent, FooterComponent, JhiMainComponent, LayoutRoutingModule, NavbarComponent, PageRibbonComponent, ProfileService} from './layouts';

// jhipster-needle-angular-add-module-import JHipster will add new module here

@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({prefix: 'jhi', separator: '-'}),
        AppSharedModule,
        AppHomeModule,
        AppAdminModule,
        AppAccountModule,
        AppEntityModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [JhiMainComponent]
})
export class AppAppModule {
}
