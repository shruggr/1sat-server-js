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
import { InscriptionsController } from './../controllers/inscriptionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LocksController } from './../controllers/locksController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarketController } from './../controllers/marketController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OriginsController } from './../controllers/originsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SPendsController } from './../controllers/spendsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatsController } from './../controllers/statsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TxController } from './../controllers/txController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TxosController } from './../controllers/txosController';
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Outpoint": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Bsv20Status": {
        "dataType": "refEnum",
        "enums": [-1,0,1],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Token": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "tick": {"dataType":"string"},
            "id": {"ref":"Outpoint"},
            "sym": {"dataType":"string"},
            "icon": {"dataType":"string"},
            "max": {"dataType":"string"},
            "lim": {"dataType":"string"},
            "dec": {"dataType":"double"},
            "amt": {"dataType":"string"},
            "supply": {"dataType":"string"},
            "status": {"ref":"Bsv20Status","default":0},
            "available": {"dataType":"string"},
            "pctMinted": {"dataType":"double"},
            "accounts": {"dataType":"double"},
            "pending": {"dataType":"string"},
            "pendingOps": {"dataType":"string"},
            "included": {"dataType":"boolean","default":false},
            "fundAddress": {"dataType":"string"},
            "fundTotal": {"dataType":"double"},
            "fundUsed": {"dataType":"double"},
            "fundBalance": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenBalanceResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"listed":{"dataType":"nestedObjectLiteral","nestedProperties":{"pending":{"dataType":"string","required":true},"confirmed":{"dataType":"string","required":true}},"required":true},"all":{"dataType":"nestedObjectLiteral","nestedProperties":{"pending":{"dataType":"string","required":true},"confirmed":{"dataType":"string","required":true}},"required":true},"icon":{"dataType":"string"},"dec":{"dataType":"double"},"sym":{"dataType":"string"},"id":{"dataType":"string"},"tick":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BSV20Txo": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "outpoint": {"ref":"Outpoint"},
            "owner": {"dataType":"string"},
            "script": {"dataType":"string"},
            "spend": {"dataType":"string"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "op": {"dataType":"string","default":""},
            "tick": {"dataType":"string"},
            "id": {"dataType":"string"},
            "amt": {"dataType":"string","default":""},
            "status": {"ref":"Bsv20Status","default":0},
            "reason": {"dataType":"string","default":""},
            "listing": {"dataType":"boolean","default":false},
            "price": {"dataType":"double"},
            "pricePer": {"dataType":"double"},
            "payout": {"dataType":"string"},
            "pricePerUnit": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SortDirection": {
        "dataType": "refEnum",
        "enums": ["asc","desc","ASC","DESC"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "File": {
        "dataType": "refObject",
        "properties": {
            "hash": {"dataType":"string"},
            "size": {"dataType":"double"},
            "type": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Inscription": {
        "dataType": "refObject",
        "properties": {
            "json": {"dataType":"any"},
            "text": {"dataType":"string"},
            "words": {"dataType":"array","array":{"dataType":"string"}},
            "file": {"ref":"File"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Sigma": {
        "dataType": "refObject",
        "properties": {
            "algorithm": {"dataType":"string"},
            "address": {"dataType":"string"},
            "signature": {"dataType":"string"},
            "vin": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxoData": {
        "dataType": "refObject",
        "properties": {
            "types": {"dataType":"array","array":{"dataType":"string"}},
            "insc": {"ref":"Inscription"},
            "map": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "b": {"ref":"File"},
            "sigma": {"dataType":"array","array":{"dataType":"refObject","ref":"Sigma"}},
            "list": {"dataType":"nestedObjectLiteral","nestedProperties":{"payout":{"dataType":"string"},"price":{"dataType":"double"}}},
            "bsv20": {"dataType":"nestedObjectLiteral","nestedProperties":{"implied":{"dataType":"boolean"},"status":{"ref":"Bsv20Status"},"amt":{"dataType":"string"},"sym":{"dataType":"string"},"tick":{"dataType":"string"},"op":{"dataType":"string"},"p":{"dataType":"string"},"id":{"ref":"Outpoint"}}},
            "lock": {"dataType":"nestedObjectLiteral","nestedProperties":{"until":{"dataType":"double","required":true},"address":{"dataType":"string","required":true}}},
            "sigil": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "opns": {"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"double"},"domain":{"dataType":"string"},"genesis":{"dataType":"string"}}},
            "opnsMine": {"dataType":"nestedObjectLiteral","nestedProperties":{"pow":{"dataType":"string"},"status":{"dataType":"double"},"domain":{"dataType":"string"},"genesis":{"dataType":"string"}}},
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
            "outpoint": {"ref":"Outpoint","required":true},
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
    "ListingSort": {
        "dataType": "refEnum",
        "enums": ["recent","price","num"],
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
                    fuzzy: {"default":false,"in":"query","name":"fuzzy","dataType":"boolean"},
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
        app.get('/content/:outpoint/latest',
            ...(fetchMiddlewares<RequestHandler>(ContentController)),
            ...(fetchMiddlewares<RequestHandler>(ContentController.prototype.getLatestFile)),

            function ContentController_getLatestFile(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ContentController();


              const promise = controller.getLatestFile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Stats)),

            function FungiblesController_getBsv20Stats(request: any, response: any, next: any) {
            const args = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    sort: {"default":"height","in":"query","name":"sort","dataType":"union","subSchemas":[{"dataType":"enum","enums":["pct_minted"]},{"dataType":"enum","enums":["available"]},{"dataType":"enum","enums":["tick"]},{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["height"]}]},
                    dir: {"default":"desc","in":"query","name":"dir","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                    included: {"default":true,"in":"query","name":"included","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20Stats.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/v2',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getAllBsv20V2Stats)),

            function FungiblesController_getAllBsv20V2Stats(request: any, response: any, next: any) {
            const args = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    sort: {"default":"fund_total","in":"query","name":"sort","dataType":"union","subSchemas":[{"dataType":"enum","enums":["fund_total"]},{"dataType":"enum","enums":["fund_used"]},{"dataType":"enum","enums":["fund_balance"]}]},
                    dir: {"default":"desc","in":"query","name":"dir","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                    included: {"default":true,"in":"query","name":"included","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getAllBsv20V2Stats.apply(controller, validatedArgs as any);
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
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
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
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
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
        app.get('/api/bsv20/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosByAddress)),

            function FungiblesController_getBsv20UtxosByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    status: {"in":"query","name":"status","ref":"Bsv20Status"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20UtxosByAddress.apply(controller, validatedArgs as any);
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
        app.get('/api/bsv20/id/:id',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20V2Stats)),

            function FungiblesController_getBsv20V2Stats(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20V2Stats.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/market',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Market)),

            function FungiblesController_getBsv20Market(request: any, response: any, next: any) {
            const args = {
                    sort: {"default":"height","in":"query","name":"sort","dataType":"union","subSchemas":[{"dataType":"enum","enums":["price"]},{"dataType":"enum","enums":["price_per_token"]},{"dataType":"enum","enums":["height"]}]},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    id: {"in":"query","name":"id","dataType":"string"},
                    tick: {"in":"query","name":"tick","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new FungiblesController();


              const promise = controller.getBsv20Market.apply(controller, validatedArgs as any);
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
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
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
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
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
        app.get('/api/inscriptions/recent',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getRecentInscriptions)),

            function InscriptionsController_getRecentInscriptions(request: any, response: any, next: any) {
            const args = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getRecentInscriptions.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/txid/:txid',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getInscriptionsByTxid)),

            function InscriptionsController_getInscriptionsByTxid(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getInscriptionsByTxid.apply(controller, validatedArgs as any);
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
        app.get('/api/inscriptions/:origin/history',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getHistoryByOrigin)),

            function InscriptionsController_getHistoryByOrigin(request: any, response: any, next: any) {
            const args = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getHistoryByOrigin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/latest',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getLatestByOrigins)),

            function InscriptionsController_getLatestByOrigins(request: any, response: any, next: any) {
            const args = {
                    origins: {"in":"body","name":"origins","required":true,"dataType":"array","array":{"dataType":"string"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new InscriptionsController();


              const promise = controller.getLatestByOrigins.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/txid/:txid',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getLocksByTxid)),

            function LocksController_getLocksByTxid(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LocksController();


              const promise = controller.getLocksByTxid.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/address/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getUnspentLocks)),

            function LocksController_getUnspentLocks(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LocksController();


              const promise = controller.getUnspentLocks.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getLocksHistory)),

            function LocksController_getLocksHistory(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LocksController();


              const promise = controller.getLocksHistory.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/search',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getLocksSearch)),

            function LocksController_getLocksSearch(request: any, response: any, next: any) {
            const args = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LocksController();


              const promise = controller.getLocksSearch.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/locks/search',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.postLocksSearch)),

            function LocksController_postLocksSearch(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body","name":"query","required":true,"ref":"TxoData"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LocksController();


              const promise = controller.postLocksSearch.apply(controller, validatedArgs as any);
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
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.postMarketSearch)),

            function MarketController_postMarketSearch(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    text: {"default":"","in":"query","name":"text","dataType":"string"},
                    minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                    maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MarketController();


              const promise = controller.postMarketSearch.apply(controller, validatedArgs as any);
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
        app.get('/api/origins/count',
            ...(fetchMiddlewares<RequestHandler>(OriginsController)),
            ...(fetchMiddlewares<RequestHandler>(OriginsController.prototype.getCount)),

            function OriginsController_getCount(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OriginsController();


              const promise = controller.getCount.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/origins/num/:num',
            ...(fetchMiddlewares<RequestHandler>(OriginsController)),
            ...(fetchMiddlewares<RequestHandler>(OriginsController.prototype.getOriginByNum)),

            function OriginsController_getOriginByNum(request: any, response: any, next: any) {
            const args = {
                    num: {"in":"path","name":"num","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OriginsController();


              const promise = controller.getOriginByNum.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/spends/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(SPendsController)),
            ...(fetchMiddlewares<RequestHandler>(SPendsController.prototype.getSpend)),

            function SPendsController_getSpend(request: any, response: any, next: any) {
            const args = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SPendsController();


              const promise = controller.getSpend.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/spends',
            ...(fetchMiddlewares<RequestHandler>(SPendsController)),
            ...(fetchMiddlewares<RequestHandler>(SPendsController.prototype.getSpends)),

            function SPendsController_getSpends(request: any, response: any, next: any) {
            const args = {
                    outpoints: {"in":"body","name":"outpoints","required":true,"dataType":"array","array":{"dataType":"string"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SPendsController();


              const promise = controller.getSpends.apply(controller, validatedArgs as any);
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
        app.post('/api/tx/bin',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.broadcastBuf)),

            function TxController_broadcastBuf(request: any, response: any, next: any) {
            const args = {
                    txbuf: {"in":"body","name":"txbuf","required":true,"dataType":"buffer"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxController();


              const promise = controller.broadcastBuf.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.broadcast)),

            function TxController_broadcast(request: any, response: any, next: any) {
            const args = {
                    rawtx: {"in":"body-prop","name":"rawtx","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxController();


              const promise = controller.broadcast.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/:txid/submit',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTxSubmit)),

            function TxController_getTxSubmit(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxController();


              const promise = controller.getTxSubmit.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx/:txid/submit',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.postTxSubmit)),

            function TxController_postTxSubmit(request: any, response: any, next: any) {
            const args = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxController();


              const promise = controller.postTxSubmit.apply(controller, validatedArgs as any);
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
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
                    refresh: {"default":false,"in":"query","name":"refresh","dataType":"boolean"},
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
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
                    refresh: {"default":false,"in":"query","name":"refresh","dataType":"boolean"},
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
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
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
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
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
        app.get('/api/txos/address/:address/balance',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getBalanceByAddress)),

            function TxosController_getBalanceByAddress(request: any, response: any, next: any) {
            const args = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    refresh: {"default":false,"in":"query","name":"refresh","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.getBalanceByAddress.apply(controller, validatedArgs as any);
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
        app.get('/api/txos/search',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getTxoSearchAll)),

            function TxosController_getTxoSearchAll(request: any, response: any, next: any) {
            const args = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.getTxoSearchAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/search',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postTxoSearchAll)),

            function TxosController_postTxoSearchAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.postTxoSearchAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/search/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getTxoSearchUnspent)),

            function TxosController_getTxoSearchUnspent(request: any, response: any, next: any) {
            const args = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.getTxoSearchUnspent.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/search/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postTxoSearchUnspent)),

            function TxosController_postTxoSearchUnspent(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TxosController();


              const promise = controller.postTxoSearchUnspent.apply(controller, validatedArgs as any);
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
