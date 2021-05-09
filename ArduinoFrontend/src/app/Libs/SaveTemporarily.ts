import { AlertService } from '../alert/alert-service/alert.service';

/**
 * Declare window so that custom created function don't throw error
 */
declare var window;

/**
 * Class to Save Progress of Project in IndexedDB
 */
export class SaveTemporarily {

    /**
 * Check if IndexedDB exist if not show alert
 * @param callback If IndexedDB exist call the callback
 */
    static Check(callback: (result: any) => void = null) {
        // check db exist
        if (window.indexedDB) {
        } else {
            // support for other browser
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        }

        // if exist create/open project database
        if (window.indexedDB) {

            const request = window.indexedDB.open('projects', 1);

            // Database was not able to open/create
            request.onerror = (err) => {
                console.error(err);
                AlertService.showAlert('Error Occurred for Ofline Circuit (Private Window Can be a Reason)');
            };

            // if everything works call the callback with result
            request.onsuccess = () => {
                if (callback) {
                    callback(request.result);
                }
            };
            // Create Object Store on success
            request.onupgradeneeded = (event) => {
                const datab = event.target.result;
                if (!datab.objectStoreNames.contains('projects')) {
                    datab.createObjectStore('temporary', { keyPath: 'id' });
                }
            };

            return true;
        }

        // IndexedDB not found
        AlertService.showAlert('Save Offline Feature Will Not Work');
        return false;
    }

    /**
     * Function to clear DB
     * @param db 
     * @returns Promise
     */
    static clearDb(db) {
        return new Promise((resolve, reject) => {
            const ok = db.transaction(['temporary'], 'readwrite')
                .objectStore('temporary').clear();
            ok.onsuccess = (_) => {
                resolve(true)
            }
            ok.onerror = (_) => {
                reject(false)
            }

        })
    }

    static getDbInstanceAndClearDb() {
        return new Promise((resolve, reject) => {
            if (!SaveTemporarily.Check(db => {
                this.clearDb(db).then(res => resolve(true)).catch(err => reject(false))
            })) { }
        })
    }

    /**
     * Function to save progress of project
     */
    static SaveProgress(mydata, callback: (data: any) => void = null) {
        return new Promise((resolve, reject) => {

            if (!SaveTemporarily.Check(db => {

                SaveTemporarily.clearDb(db).then(res => {
                    const ok = db.transaction(['temporary'], 'readwrite')
                        .objectStore('temporary')
                        .put(mydata);

                    ok.onsuccess = (_) => {
                        // AlertService.showAlert('Done updating.');
                        resolve(true);
                        if (callback) {
                            callback(mydata);
                        }
                    };
                }).catch(err => {
                    reject(false)
                })

            })) {
                return;
            }

        })
    }

    static checkAvailableProjects() {
        return new Promise<any[]>((resolve, reject) => {
            if (!SaveTemporarily.Check(db => {
                const ok = db.transaction(['temporary'], 'readwrite')
                    .objectStore('temporary').getAll();
                ok.onsuccess = (_) => { resolve(ok.result); }
                ok.onerror = (_) => { AlertService.showAlert('Unable to retrieve data from database!'); reject(false); }
            })) {
            }
        })
    }

    static ReadTemporaryProject(id, callback: (data: any) => void = null) {
        if (!SaveTemporarily.Check(db => {
            const transaction = db.transaction(['temporary']);
            const objectStore = transaction.objectStore('temporary');
            const ok = objectStore.get(parseInt(id, 10));

            ok.onerror = () => {
                AlertService.showAlert('Unable to retrieve data from database!');
            };

            ok.onsuccess = () => {
                callback(ok.result);
            };
        })) {
            return;
        }
    }

}