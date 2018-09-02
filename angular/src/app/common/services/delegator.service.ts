import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { Environment } from '../../config/config';

/**
 * This class handles REST interaction with server, send REST to server and recieve response from server
 *
 */
@Injectable()
export class DelegatorService {

    headers: Headers;
    // server: string;
    lockedForRefresh = false;
    delayRequests: Object = {};
    runningRequests: Object = {};
    requestCounter = 0;
    restUrl;
    server;

    constructor(
        private _http: Http,
        private localStorageService: LocalStorageService,
        private environment: Environment,
        private _router: Router
    ) {
        this.server = this.environment.variables.profile.SERVER;
        this.restUrl = this.environment.variables.common.REST_URL;
    }

    /**
     * Get request config and send request to server
     * Return observer
     * 
     * @param  {} config
     */
    public http = <T>(config) => {
        if (this.lockedForRefresh && !config.noDelay) {
            this.storeDelayedRequest(config);
        } else {
            const requestId = this.nextRequestId();
            let observer;

            if (config.method === 'get' || config.method === 'delete') {
                observer = this._http[config.method](config.url, config.options); // ...using get/delete request
            } else {
                observer = this._http[config.method](config.url, config.data, config.options); // ...using post/put request
            }

            // store request's config and store it in runningRequests
            const tracker = {
                requestId: requestId,
                config: config
            };
            this.runningRequests[requestId] = tracker;

            return this.handleRespone(<T>observer, tracker);
        }
    }
    /**
     * Build config object of request
     *
     * @param  {} url
     * @param  {} data
     * @param  {} method
     * @param  {} successCallback
     */
    public buildConfig = (url, data, method, successCallback, errorCallback) => {

        const config: any = {};

        // Prepare header
        const headers: Headers = this.prepareHeader(data);

        if (data && data.isSOAP) {
            data = data.body;
        }

        // Create a request option
        const options = new RequestOptions({ headers: headers });

        config.url = url;
        config.options = options;
        config.data = data;
        config.method = method;
        config.successCallback = successCallback;
        config.errorCallback = errorCallback;

        return config;
    }

    /**
     * Post requets
     *
     * @param  {} data
     * @param  {} url
     * @param  {} customConfig
     * @param  {} successCallback
     * @returns Observable
     */
    public post = <T>(data: { new(): T; }, url: string, customConfig, successCallback, errorCallback): Observable<T[]> => {

        const config = this.buildConfig(url, data, 'post', successCallback, errorCallback);
        if (customConfig) {
            config.noDelay = customConfig.noDelay;
        }
        return this.http<T>(config);
    }

    /**
     * Get requets
     *
     * @param  {} url
     * @param  {} customConfig
     * @param  {} successCallback
     * @returns Observable
     */
    public get = <T>(url: string, successCallback, errorCallback): Observable<T[]> => {

        const config = this.buildConfig(url, '', 'get', successCallback, errorCallback);
        return this.http<T>(config);
    }

    /**
     * SOAP Get requets
     *
     * @param  {} url
     * @param  {} customConfig
     * @param  {} successCallback
     * @returns Observable
     */
    public soapGet = <T>(url: string, credentials, successCallback, errorCallback): Observable<T[]> => {
        let data = {
            isSOAP: true,
            credentials: credentials
        }

        const config = this.buildConfig(url, data, 'get', successCallback, errorCallback);
        return this.http<T>(config);
    }

    /**
     * SOAP Post requets
     *
     * @param  {} data
     * @param  {} url
     * @param  {} customConfig
     * @param  {} successCallback
     * @returns Observable
     */
    public soapPost = <T>(data: { new(): T; }, url: string, customConfig, successCallback, errorCallback): Observable<T[]> => {

        data['isSOAP'] = true;

        const config = this.buildConfig(url, data, 'post', successCallback, errorCallback);

        if (customConfig) {
            config.noDelay = customConfig.noDelay;
        }

        return this.http<T>(config);
    }

    /**
     * Post requets
     * 
     * @param  {} data
     * @param  {} url
     * @param  {} customConfig
     * @param  {} successCallback
     * @returns Observable
     */
    public put = <T>(data: { new(): T; }, url: string, successCallback, errorCallback): Observable<T[]> => {

        const config = this.buildConfig(url, data, 'put', successCallback, errorCallback);
        return this.http<T>(config);
    }

    /**
     * Post requets
     * 
     * @param  {} data
     * @param  {} url
     * @param  {} customConfig
     * @param  {} successCallback
     * @returns Observable
     */
    public delete = <T>(url: string, successCallback, errorCallback): Observable<T[]> => {

        const config = this.buildConfig(url, '', 'delete', successCallback, errorCallback);
        return this.http<T>(config);
    }

    /**
     * Prepare header for request
     *
     * @param  {} data
     */
    private prepareHeader = (data) => {

        // Set content type to JSON
        let headers: Headers;
        headers = new Headers();
        // TODO: REMOVE STATIC AUTHORIZATION
        if (data && data.isSOAP) {
            headers.append('Content-Type', 'text/xml');
            if (data.credentials && data.credentials.username && data.credentials.password) {
                headers.append('Authorization', 'Basic ' + window.btoa(data.credentials.username + ':' + data.credentials.password));
            } else {
                // 
            }
        } else if ((data && !data.isSOAP) || !data) {
            headers.append('Content-Type', 'application/json');
            if (data && data.email && data.password) {
                // basic header for requesting access token
                headers.append('Authorization', 'Basic ' + window.btoa(data.email + ':' + data.password));
            } else if (data && data.refreshToken) {
                // Bearer with refresh token
                headers.append('Authorization', 'Bearer ' + data.refreshToken);
            } else {
                // get access token from session
                const accessToken = this.localStorageService.getValue('accessToken');
                headers.append('Authorization', 'Bearer ' + accessToken);
            }
        }
        return headers;
    }


    /**
     * handle observer after compeltion of request
     * 
     * @param  {} observer
     * @param  {} tracker
     */
    private handleRespone = <T>(observer, tracker) => {
        return observer.subscribe(
            (result: Response) => {
                delete this.runningRequests[tracker.requestId];
                let data = <any>result.json();
                tracker.config.successCallback(data);
            },
            error => {
                // Internal Server Error
                // if (error.status === 500) {
                //     delete this.runningRequests[tracker.requestId];
                //     // this.notificationService.smallBox({
                //     //     title: "Error!",
                //     //     content: `<i>${error.message}</i>`,
                //     //     color: "#C46A69",
                //     //     iconSmall: "fa fa-times fa-2x fadeInRight animated",
                //     //     timeout: 4000
                //     // });
                //     tracker.config.errorCallback(error);
                //     return;
                // };
                // if session time out status
                if (error.status === 599) {
                    this.unLockRequestFlag();
                    this.localStorageService.clearLocalStorage();
                    this._router.navigate(['login']);
                    return
                }
                // error in getting response
                // if (error.status !== 419 && !this.lockedForRefresh) {
                //     // if error's status is not 419 then delete request from runningRequests
                //     delete this.runningRequests[tracker.requestId];
                //     tracker.config.errorCallback(error);
                //     return;
                // }
                if (error.status === 419 && !this.lockedForRefresh) { // Session Time Out
                    this.interceptSessionExpired();
                    const err = <any>error.json();
                } else if (error.status === 401) {
                    delete this.runningRequests[tracker.requestId];
                    this.localStorageService.clearLocalStorage();
                    tracker.config.errorCallback(error);
                    this._router.navigate(['login']);
                } else if (error.status === 403) { // User has not access rights (Forbidden)
                    delete this.runningRequests[tracker.requestId];
                    tracker.config.errorCallback(error);
                } else if(!this.lockedForRefresh) {
                    delete this.runningRequests[tracker.requestId];
                    tracker.config.errorCallback(error);
                }
            }
        );
    }
    /**
     * Lock requests, it won't interact to server and store requests
     */
    public lockRequest = () => {
        this.lockedForRefresh = true;
    }

    public unLockRequestFlag = () => {
        this.lockedForRefresh = false;
        this.runningRequests = [];
        this.delayRequests = [];
    }

    /**
     * Lock requests, execute requests from executeDelayedRequests and executeRunningRequests
     */
    public unLockRequest = () => {
        this.lockedForRefresh = false;
        this.executeRunningRequests();
        this.executeDelayedRequests();
    }
    /**
     * Store requets after locked
     * 
     * @param  {} config
     */
    public storeDelayedRequest = (config) => {
        const requestId = this.nextRequestId();
        const tracker = {
            requestId: requestId,
            config: config
        };
        this.delayRequests[requestId] = tracker;
    }

    /**
     * Increment requestCounter and return new number as a string
     */
    private nextRequestId = () => {
        return this.requestCounter += 1;
    }

    /**
     * Execute running requests
     */
    private executeRunningRequests = () => {
        for (const key in this.runningRequests) {
            if (this.runningRequests.hasOwnProperty(key)) {
                this.executeRequests(this.runningRequests[key]);
                delete this.runningRequests[key];
            }
        }
    }

    /**
     * Executes delayed requests
     */
    private executeDelayedRequests = () => {
        for (const key in this.delayRequests) {
            if (this.delayRequests.hasOwnProperty(key)) {
                this.executeRequests(this.delayRequests[key]);
                delete this.runningRequests[key];
            }
        }
    }

    /**
     * Execute requests
     * 
     * @param  {} request
     */
    private executeRequests = (request) => {
        const config = this.buildConfig(
            request.config.url,
            request.config.data,
            request.config.method,
            request.config.successCallback,
            request.config.errorCallback);
        return this.http<any>(config);
    }

    private refreshAccessToken = () => {
        const refreshToken = this.localStorageService.getValue('refreshToken');

        /**
         * Sets new access token and refresh token to localStorage and
         * Unlocks the requests from delegator service
         *
         * @param  {} result
         */

        // Send request for new access token
        let data: any = {
            refreshToken: refreshToken,
            grantType: 'accessToken'
        };
        const url = this.server.brainHost + this.server.myprofile + this.restUrl.authenticate;
        this.post(data, url, { noDelay: true }, this.refreshAccessTokenSuccess, this.refreshAccessTokenError);
    }

    public refreshAccessTokenSuccess = (result) => {
        this.localStorageService.setValue('accessToken', result.accessToken);
        this.localStorageService.setValue('refreshToken', result.refreshToken);
        this.lockedForRefresh = false;
        this.unLockRequest();
    }

    public refreshAccessTokenError = (error) => {
        this.unLockRequestFlag();
        this.lockedForRefresh = false;
        this.localStorageService.clearAllLocalStorage();
        this._router.navigate(['login']);
    }

    /**
     * Set lockedForRefresh as true
     * Lock all the upcoming request in delegator service
     */
    private interceptSessionExpired = () => {
        if (!this.lockedForRefresh) {
            this.lockedForRefresh = true;

            // queue the requests
            this.lockRequest();
            this.refreshAccessToken();
        }
    }
}
