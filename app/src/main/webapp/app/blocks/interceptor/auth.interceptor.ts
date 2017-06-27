import {RequestOptionsArgs, Response} from '@angular/http';
import {JhiHttpInterceptor} from 'ng-jhipster';
import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';
import {Observable} from 'rxjs/Observable';

export class AuthInterceptor extends JhiHttpInterceptor {

    constructor(private localStorage: LocalStorageService,
                private sessionStorage: SessionStorageService) {
        super();
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
        if (!!token) {
            options.headers.append(
                'Authorization',
                'Bearer ' + token
            );
        }
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        return observable; // by pass
    }

}
