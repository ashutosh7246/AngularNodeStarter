import { Injectable } from '@angular/core';
import * as sjcl from 'sjcl';

/**
 * 
 */
@Injectable()
export class LocalStorageService {

  public storage = {
    user: {},
    auth: {}
    // product: {}
  };
  private isStorage = false;
  private secret: String = '1@Alpha-'

  constructor() { }

  /**
   * Creates localstorage
   */
  public create() {
    localStorage.setItem('auth', JSON.stringify(this.storage.auth));
    localStorage.setItem('user', JSON.stringify(this.storage.user));
    // localStorage.setItem('product', JSON.stringify(this.storage.product));
    this.isStorage = true;
    return localStorage;
  }

  /**
   * Set value to localstorage
   * 
   * @param  {} key
   * @param  {} value
   */
  public setValue = (key, value) => {
    const objectKey = this.storageForKey(key);
    this.storage[objectKey] = Object.assign(JSON.parse(localStorage.getItem(objectKey)), this.storage[objectKey]);
    if (typeof (value) !== 'boolean' && typeof (value) !== 'object' && typeof (value) !== 'number') {
      // if (typeof (value) !== 'boolean' && typeof (value) !== 'object') {
      this.storage[objectKey][key] = window.btoa(value);
      // this.storage[objectKey][key] = sjcl.encrypt(this.secret + key, value);
    } else if (typeof (value) === 'object') {
        for(let oKey in value) {
            this.setValue(oKey, value[oKey]);
        }
    } else {
      this.storage[objectKey][key] = value;
    }
    localStorage.setItem(objectKey, JSON.stringify(this.storage[objectKey]));
  }

  /**
   * Get value from localstorage
   *
   * @param  {} key
   * @returns any
   */
  public getValue(key): any {
    const objectKey = this.storageForKey(key);
    if (localStorage && localStorage[objectKey]) {
      // if (key === 'user' || key === 'product') {
      if (key === 'user') {
        let value = JSON.parse(localStorage[objectKey]);
        if (typeof (value) === 'object') {
          for(let vKey in value) {
            if (typeof value[vKey] !== 'boolean' && typeof (value[vKey]) !== 'number') {
            // if (typeof value[vKey] !== 'boolean') {
              value[vKey] = window.atob(value[vKey]);
              // value[vKey] = sjcl.decrypt(this.secret + vKey, value[vKey]);
            }
          }
          return value;
        } else {
          return window.atob(value);
          // return sjcl.decrypt(this.secret + objectKey, value)
        }
      };
      if (JSON.parse(localStorage[objectKey])[key]) {
        const value = JSON.parse(localStorage[objectKey])[key];
        if (typeof (value) !== 'boolean' && typeof (value) !== 'number') {
        // if (typeof (value) !== 'boolean') {
          return window.atob(JSON.parse(localStorage[objectKey])[key]);
          // return sjcl.decrypt(this.secret + key, JSON.parse(localStorage[objectKey])[key]);
        } else {
          return value;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Clear local storage
   */
  clearLocalStorage() {
    //prevent to remove language settings
    //localStorage.clear();
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
  }
  clearAllLocalStorage() {
    localStorage.clear();
  }

  public remove(key): any {
    localStorage.removeItem(key);
  }

  /**
   * Check if localsorage is created or not
   */
  public isLocalStorage() {
    return this.isStorage;
  }

  /**
   * Identify key of localstorage
   * 
   * @param  {} key
   */
  private storageForKey(key) {
    // if(key.indexOf('licensedProduct.') === 0) {
    //   return 'product';
    // };
    switch (key) {
      case 'accessToken':
        return 'auth';
      case 'refreshToken':
        return 'auth';
      default:
        return 'user';
    }
  }
}
