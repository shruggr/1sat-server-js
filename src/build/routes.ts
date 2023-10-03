/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CollectionsController } from './../controllers/collectionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ContentController } from './../controllers/contentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FungiblesController } from './../controllers/fungiblesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InscriptionsController } from './../controllers/incriptionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarketController } from './../controllers/marketController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OriginsController } from './../controllers/originsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatsController } from './../controllers/statsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TxController } from './../controllers/txController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TxosController } from './../controllers/txosController';
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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
    "Bsv20Status": {
        "dataType": "refEnum",
        "enums": [-1,0,1],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxoData": {
        "dataType": "refObject",
        "properties": {
            "types": {"dataType":"array","array":{"dataType":"string"}},
            "insc": {"ref":"File"},
            "map": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "b": {"ref":"File"},
            "sigma": {"dataType":"array","array":{"dataType":"refObject","ref":"Sigma"}},
            "list": {"dataType":"nestedObjectLiteral","nestedProperties":{"payout":{"dataType":"string","required":true},"price":{"dataType":"double","required":true}}},
            "bsv20": {"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"ref":"Bsv20Status"},"amt":{"dataType":"string","required":true},"tick":{"dataType":"string"},"op":{"dataType":"string","required":true},"p":{"dataType":"string","required":true},"id":{"ref":"Outpoint"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Claim": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Origin": {
        "dataType": "refObject",
        "properties": {
            "outpoint": {"ref":"Outpoint"},
            "data": {"ref":"TxoData"},
            "num": {"dataType":"double"},
            "map": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "claims": {"dataType":"array","array":{"dataType":"refObject","ref":"Claim"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Txo": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "outpoint": {"ref":"Outpoint"},
            "satoshis": {"dataType":"double","default":0},
            "accSats": {"dataType":"double","default":0},
            "owner": {"dataType":"string"},
            "script": {"dataType":"string"},
            "spend": {"dataType":"string"},
            "origin": {"ref":"Origin"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "data": {"ref":"TxoData"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Token": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","required":true},
            "vout": {"dataType":"double","required":true},
            "height": {"dataType":"double","required":true},
            "idx": {"dataType":"double","required":true},
            "tick": {"dataType":"string","required":true},
            "max": {"dataType":"string","required":true},
            "lim": {"dataType":"string","required":true},
            "dec": {"dataType":"double","required":true},
            "supply": {"dataType":"string","required":true},
            "status": {"ref":"Bsv20Status","required":true},
            "available": {"dataType":"double","required":true},
            "pctMinted": {"dataType":"double","required":true},
            "accounts": {"dataType":"double","required":true},
            "pending": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SortDirection": {
        "dataType": "refEnum",
        "enums": ["asc","desc","ASC","DESC"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListingSort": {
        "dataType": "refEnum",
        "enums": ["recent","num","price"],
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
        app.get('/content/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(ContentController)),
            ...(fetchMiddlewares<RequestHandler>(ContentController.prototype.getOrdfsFile)),

            function ContentController_getOrdfsFile(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ContentController();


              const promise = controller.getOrdfsFile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/balance',
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
        app.get('/api/bsv20/:address/tick/:tick',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosByTick)),

            function FungiblesController_getBsv20UtxosByTick(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20UtxosByTick.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosById)),

            function FungiblesController_getBsv20UtxosById(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20UtxosById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/tick/:tick',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20TickStats)),

            function FungiblesController_getBsv20TickStats(request: any, response: any, next: any) {
            const args = {
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20TickStats.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/search',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getInscriptionSearch)),

            function InscriptionsController_getInscriptionSearch(request: any, response: any, next: any) {
            const args = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    sort: {"in":"query","name":"sort","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getInscriptionSearch.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/search',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.postInscriptionSearch)),

            function InscriptionsController_postInscriptionSearch(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    sort: {"in":"query","name":"sort","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.postInscriptionSearch.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/geohash/:geohashes',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.searchGeohashes)),

            function InscriptionsController_searchGeohashes(request: any, response: any, next: any) {
            const args = {
                    geohashes: {"in":"path","name":"geohashes","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.searchGeohashes.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getTxoByOutpoint)),

            function InscriptionsController_getTxoByOutpoint(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getTxoByOutpoint.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:origin/latest',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getLatestByOrigin)),

            function InscriptionsController_getLatestByOrigin(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getLatestByOrigin.apply(controller, validatedArgs as any);
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
                    q: {"in":"query","name":"q","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
                    text: {"default":"","in":"query","name":"text","dataType":"string"},
                    minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                    maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
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
        app.post('/api/market',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.searchMap)),

            function MarketController_searchMap(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
                    text: {"default":"","in":"query","name":"text","dataType":"string"},
                    minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                    maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
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
        app.get('/api/origins/:origin/claims',
            ...(fetchMiddlewares<RequestHandler>(OriginsController)),
            ...(fetchMiddlewares<RequestHandler>(OriginsController.prototype.getClaims)),

            function OriginsController_getClaims(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OriginsController();


              const promise = controller.getClaims.apply(controller, validatedArgs as any);
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
        app.post('/api/tx/:txid/submit',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTx)),

            function TxController_getTx(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxController();


              const promise = controller.getTx.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/address/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getUnspentByAddress)),

            function TxosController_getUnspentByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    q: {"in":"query","name":"q","dataType":"string"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.getUnspentByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/address/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postUnspentByAddress)),

            function TxosController_postUnspentByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.postUnspentByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getHistoryByAddress)),

            function TxosController_getHistoryByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    q: {"in":"query","name":"q","dataType":"string"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.getHistoryByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postHistoryByAddress)),

            function TxosController_postHistoryByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.postHistoryByAddress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getTxoByOutpoint)),

            function TxosController_getTxoByOutpoint(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.getTxoByOutpoint.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/outpoints',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postOutpoints)),

            function TxosController_postOutpoints(request: any, response: any, next: any) {
            const args = {
                    outpoints: {"in":"body","name":"outpoints","required":true,"dataType":"array","array":{"dataType":"string"}},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.postOutpoints.apply(controller, validatedArgs as any);
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
