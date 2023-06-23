/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CollectionsController } from './../controllers/collectionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DnsController } from './../controllers/dnsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FilesController } from './../controllers/filesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FungiblesController } from './../controllers/fungiblesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InscriptionsController } from './../controllers/incriptionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarketController } from './../controllers/marketController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrdfsController } from './../controllers/ordfsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatsController } from './../controllers/statsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UtxosController } from './../controllers/utxosController';
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Outpoint": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "File": {
        "dataType": "refObject",
        "properties": {
            "hash": {"dataType":"string","default":""},
            "size": {"dataType":"double","default":0},
            "type": {"dataType":"string","default":""},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Sigma": {
        "dataType": "refObject",
        "properties": {
            "algorithm": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "signature": {"dataType":"string","required":true},
            "vin": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Inscription": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "num": {"dataType":"double"},
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "outpoint": {"ref":"Outpoint"},
            "file": {"ref":"File"},
            "origin": {"ref":"Outpoint"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "lock": {"dataType":"string","default":""},
            "spend": {"dataType":"string","default":""},
            "MAP": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"string"}},
            "B": {"ref":"File"},
            "SIGMA": {"dataType":"array","array":{"dataType":"refObject","ref":"Sigma"},"default":[]},
            "listing": {"dataType":"boolean","default":false},
            "price": {"dataType":"double"},
            "payout": {"dataType":"string"},
            "script": {"dataType":"string"},
            "bsv20": {"dataType":"boolean","default":false},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Bsv20": {
        "dataType": "refObject",
        "properties": {
            "id": {"ref":"Outpoint"},
            "txid": {"dataType":"string"},
            "vout": {"dataType":"double"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "tick": {"dataType":"string","default":""},
            "op": {"dataType":"string"},
            "max": {"dataType":"double"},
            "lim": {"dataType":"double"},
            "dec": {"dataType":"double"},
            "supply": {"dataType":"double"},
            "amt": {"dataType":"double"},
            "lock": {"dataType":"string","default":""},
            "spend": {"dataType":"string","default":""},
            "MAP": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "B": {"ref":"File"},
            "valid": {"dataType":"boolean"},
            "accounts": {"dataType":"double"},
            "reason": {"dataType":"string","default":""},
            "unconfirmed": {"dataType":"double"},
            "available": {"dataType":"double"},
            "pctMinted": {"dataType":"double"},
            "price": {"dataType":"double"},
            "payout": {"dataType":"string"},
            "script": {"dataType":"string"},
            "listing": {"dataType":"boolean","default":false},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Status": {
        "dataType": "refEnum",
        "enums": ["invalid","valid","pending","valid_pending","all"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Bsv20Sort": {
        "dataType": "refEnum",
        "enums": ["pct_minted","available","tick","max","height"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SortDirection": {
        "dataType": "refEnum",
        "enums": ["asc","desc","ASC","DESC"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BalanceItem": {
        "dataType": "refObject",
        "properties": {
            "confirmed": {"dataType":"double","default":0},
            "pending": {"dataType":"double","default":0},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenBalance": {
        "dataType": "refObject",
        "properties": {
            "all": {"ref":"BalanceItem"},
            "listed": {"ref":"BalanceItem"},
            "tick": {"dataType":"string","default":""},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListingSort": {
        "dataType": "refEnum",
        "enums": ["recent","num","price"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Listing": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "price": {"dataType":"double","default":0},
            "payout": {"dataType":"string","default":""},
            "script": {"dataType":"string","default":""},
            "origin": {"ref":"Outpoint"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Txo": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "satoshis": {"dataType":"double","default":0},
            "accSats": {"dataType":"double","default":0},
            "lock": {"dataType":"string","default":""},
            "script": {"dataType":"string","default":""},
            "spend": {"dataType":"string","default":""},
            "origin": {"ref":"Outpoint"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "listing": {"dataType":"boolean","default":false},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/api/collections/recent',
            ...(fetchMiddlewares<RequestHandler>(CollectionsController)),
            ...(fetchMiddlewares<RequestHandler>(CollectionsController.prototype.getRecentListings)),

            function CollectionsController_getRecentListings(request: any, response: any, next: any) {
            const args = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CollectionsController();


              const promise = controller.getRecentListings.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/collections/sigma/:address',
            ...(fetchMiddlewares<RequestHandler>(CollectionsController)),
            ...(fetchMiddlewares<RequestHandler>(CollectionsController.prototype.searchSigmaCollections)),

            function CollectionsController_searchSigmaCollections(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CollectionsController();


              const promise = controller.searchSigmaCollections.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/collections/:collectionId/stats',
            ...(fetchMiddlewares<RequestHandler>(CollectionsController)),
            ...(fetchMiddlewares<RequestHandler>(CollectionsController.prototype.getCollection)),

            function CollectionsController_getCollection(request: any, response: any, next: any) {
            const args = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CollectionsController();


              const promise = controller.getCollection.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/collections/:collectionId/items',
            ...(fetchMiddlewares<RequestHandler>(CollectionsController)),
            ...(fetchMiddlewares<RequestHandler>(CollectionsController.prototype.getCollectionItems)),

            function CollectionsController_getCollectionItems(request: any, response: any, next: any) {
            const args = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CollectionsController();


              const promise = controller.getCollectionItems.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/',
            ...(fetchMiddlewares<RequestHandler>(DnsController)),
            ...(fetchMiddlewares<RequestHandler>(DnsController.prototype.getDnsInscription)),

            function DnsController_getDnsInscription(request: any, response: any, next: any) {
            const args = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DnsController();


              const promise = controller.getDnsInscription.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/:filename',
            ...(fetchMiddlewares<RequestHandler>(DnsController)),
            ...(fetchMiddlewares<RequestHandler>(DnsController.prototype.getOrdfs)),

            function DnsController_getOrdfs(request: any, response: any, next: any) {
            const args = {
                    filename: {"in":"path","name":"filename","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DnsController();


              const promise = controller.getOrdfs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/:origin/:filename',
            ...(fetchMiddlewares<RequestHandler>(DnsController)),
            ...(fetchMiddlewares<RequestHandler>(DnsController.prototype.getOrdfsFile)),

            function DnsController_getOrdfsFile(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
                    filename: {"in":"path","name":"filename","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DnsController();


              const promise = controller.getOrdfsFile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/files/inscriptions/:origin',
            ...(fetchMiddlewares<RequestHandler>(FilesController)),
            ...(fetchMiddlewares<RequestHandler>(FilesController.prototype.getInscription)),

            function FilesController_getInscription(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FilesController();


              const promise = controller.getInscription.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getRecent)),

            function FungiblesController_getRecent(request: any, response: any, next: any) {
            const args = {
                    status: {"default":"valid_pending","in":"query","name":"status","ref":"Status"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    sort: {"default":"height","in":"query","name":"sort","ref":"Bsv20Sort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getRecent.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/outpoint/:txid/:vout',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getByOutpoint)),

            function FungiblesController_getByOutpoint(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
                    vout: {"in":"path","name":"vout","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getByOutpoint.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/id/:id',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getById)),

            function FungiblesController_getById(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:ticker',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getByTicker)),

            function FungiblesController_getByTicker(request: any, response: any, next: any) {
            const args = {
                    ticker: {"in":"path","name":"ticker","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getByTicker.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:ticker/activity',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getByTickerActivity)),

            function FungiblesController_getByTickerActivity(request: any, response: any, next: any) {
            const args = {
                    ticker: {"in":"path","name":"ticker","required":true,"dataType":"string"},
                    fromHeight: {"default":0,"in":"query","name":"fromHeight","dataType":"double"},
                    fromIdx: {"default":0,"in":"query","name":"fromIdx","dataType":"double"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    status: {"default":"valid_pending","in":"query","name":"status","ref":"Status"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getByTickerActivity.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/address/:address',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getByAddress)),

            function FungiblesController_getByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    status: {"default":"valid_pending","in":"query","name":"status","ref":"Status"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/lock/:lock',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getByLock)),

            function FungiblesController_getByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
                    status: {"default":"valid_pending","in":"query","name":"status","ref":"Status"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/address/:address/balance',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBalanceByAddress)),

            function FungiblesController_getBalanceByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBalanceByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/lock/:lock/balance',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBalanceByLock)),

            function FungiblesController_getBalanceByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBalanceByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/address/:address/balance/sorted',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getSortedBalanceByAddress)),

            function FungiblesController_getSortedBalanceByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getSortedBalanceByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/lock/:lock/balance/sorted',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getSortedBalanceByLock)),

            function FungiblesController_getSortedBalanceByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getSortedBalanceByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/origin/:origin',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getByOrigin)),

            function InscriptionsController_getByOrigin(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getByOrigin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/origin/:origin/latest',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getOneByOrigin)),

            function InscriptionsController_getOneByOrigin(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getOneByOrigin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/origin/:origin/metadata',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getMetadataByOrigin)),

            function InscriptionsController_getMetadataByOrigin(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getMetadataByOrigin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/outpoint/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getByOutpoint)),

            function InscriptionsController_getByOutpoint(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getByOutpoint.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/txid/:txid',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getByTxid)),

            function InscriptionsController_getByTxid(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getByTxid.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/count',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getCount)),

            function InscriptionsController_getCount(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getCount.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:id',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getOneById)),

            function InscriptionsController_getOneById(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getOneById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/search/text',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.searchText)),

            function InscriptionsController_searchText(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body-prop","name":"query","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.searchText.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/search/map',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.searchMap)),

            function InscriptionsController_searchMap(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body-prop","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.searchMap.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/sigma/:address',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.searchSigma)),

            function InscriptionsController_searchSigma(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.searchSigma.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/market',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.getOpenListings)),

            function MarketController_getOpenListings(request: any, response: any, next: any) {
            const args = {
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MarketController();


              const promise = controller.getOpenListings.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/market/search/map',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.searchMap)),

            function MarketController_searchMap(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body-prop","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MarketController();


              const promise = controller.searchMap.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/market/bsv20',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.getOpenBsv20)),

            function MarketController_getOpenBsv20(request: any, response: any, next: any) {
            const args = {
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MarketController();


              const promise = controller.getOpenBsv20.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/market/recent',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.getRecentListings)),

            function MarketController_getRecentListings(request: any, response: any, next: any) {
            const args = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":true,"in":"query","name":"bsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MarketController();


              const promise = controller.getRecentListings.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/market/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.getByOutpoint)),

            function MarketController_getByOutpoint(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MarketController();


              const promise = controller.getByOutpoint.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/ordfs/:origin/:filename',
            ...(fetchMiddlewares<RequestHandler>(OrdfsController)),
            ...(fetchMiddlewares<RequestHandler>(OrdfsController.prototype.getOrdfsFile)),

            function OrdfsController_getOrdfsFile(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
                    filename: {"in":"path","name":"filename","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrdfsController();


              const promise = controller.getOrdfsFile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/stats',
            ...(fetchMiddlewares<RequestHandler>(StatsController)),
            ...(fetchMiddlewares<RequestHandler>(StatsController.prototype.getOpenListings)),

            function StatsController_getOpenListings(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new StatsController();


              const promise = controller.getOpenListings.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/lock/:lock',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getByLock)),

            function UtxosController_getByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/address/:address',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getByAddress)),

            function UtxosController_getByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/lock/:lock/history',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getHistoryByLock)),

            function UtxosController_getHistoryByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getHistoryByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getHistoryByAddress)),

            function UtxosController_getHistoryByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getHistoryByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/lock/:lock/inscriptions',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getInscriptionsByLock)),

            function UtxosController_getInscriptionsByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    excludeBsv20: {"default":false,"in":"query","name":"excludeBsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getInscriptionsByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/address/:address/inscriptions',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getInscriptionsByAddress)),

            function UtxosController_getInscriptionsByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    excludeBsv20: {"default":false,"in":"query","name":"excludeBsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getInscriptionsByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/address/:address/tick/:tick',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getBsv20sByAddress)),

            function UtxosController_getBsv20sByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    tick: {"default":"","in":"path","name":"tick","required":true,"dataType":"string"},
                    fromHeight: {"default":0,"in":"query","name":"fromHeight","dataType":"double"},
                    fromIdx: {"default":0,"in":"query","name":"fromIdx","dataType":"double"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getBsv20sByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/lock/:lock/tick/:tick',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getBsv20sByLock)),

            function UtxosController_getBsv20sByLock(request: any, response: any, next: any) {
            const args = {
                    lock: {"in":"path","name":"lock","required":true,"dataType":"string"},
                    tick: {"default":"","in":"path","name":"tick","required":true,"dataType":"string"},
                    fromHeight: {"default":0,"in":"query","name":"fromHeight","dataType":"double"},
                    fromIdx: {"default":0,"in":"query","name":"fromIdx","dataType":"double"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getBsv20sByLock.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/utxos/origin/:origin',
            ...(fetchMiddlewares<RequestHandler>(UtxosController)),
            ...(fetchMiddlewares<RequestHandler>(UtxosController.prototype.getTxoByOrigin)),

            function UtxosController_getTxoByOrigin(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UtxosController();


              const promise = controller.getTxoByOrigin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
