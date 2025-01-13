/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TxosController } from './../controllers/txosController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TxController } from './../controllers/txController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatsController } from './../controllers/statsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SPendsController } from './../controllers/spendsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OriginsController } from './../controllers/originsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OpnsController } from './../controllers/opnsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarketController } from './../controllers/marketController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LocksController } from './../controllers/locksController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InscriptionsController } from './../controllers/inscriptionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FungiblesController } from './../controllers/fungiblesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EventsController } from './../controllers/eventsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ContentController } from './../controllers/contentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CollectionsController } from './../controllers/collectionsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BlocksController } from './../controllers/blocksController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



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
            "parent": {"dataType":"string"},
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
    "Bsv20Status": {
        "dataType": "refEnum",
        "enums": [-1,0,1],
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
            "list": {"dataType":"nestedObjectLiteral","nestedProperties":{"sale":{"dataType":"boolean"},"payout":{"dataType":"string"},"price":{"dataType":"double"}}},
            "bsv20": {"dataType":"nestedObjectLiteral","nestedProperties":{"implied":{"dataType":"boolean"},"status":{"ref":"Bsv20Status"},"amt":{"dataType":"string"},"sym":{"dataType":"string"},"tick":{"dataType":"string"},"op":{"dataType":"string"},"p":{"dataType":"string"},"id":{"ref":"Outpoint"}}},
            "lock": {"dataType":"nestedObjectLiteral","nestedProperties":{"until":{"dataType":"double","required":true},"address":{"dataType":"string","required":true}}},
            "sigil": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "opns": {"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"double"},"domain":{"dataType":"string"},"genesis":{"dataType":"string"}}},
            "opnsMine": {"dataType":"nestedObjectLiteral","nestedProperties":{"pow":{"dataType":"string"},"status":{"dataType":"double"},"domain":{"dataType":"string"},"genesis":{"dataType":"string"}}},
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
            "inum": {"dataType":"double"},
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
            "spend_height": {"dataType":"double"},
            "spend_idx": {"dataType":"double"},
            "origin": {"ref":"Origin"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "data": {"ref":"TxoData"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SortDirection": {
        "dataType": "refEnum",
        "enums": ["asc","desc","ASC","DESC"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxLog": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","required":true},
            "height": {"dataType":"double"},
            "idx": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OpnsResponse": {
        "dataType": "refObject",
        "properties": {
            "outpoint": {"ref":"Outpoint","required":true},
            "origin": {"ref":"Outpoint","required":true},
            "owner": {"dataType":"string","required":true},
            "domain": {"dataType":"string","required":true},
            "map": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OpnsMine": {
        "dataType": "refObject",
        "properties": {
            "outpoint": {"ref":"Outpoint","required":true},
            "origin": {"ref":"Outpoint","required":true},
            "domain": {"dataType":"string","required":true},
            "pow": {"dataType":"string","required":true},
            "script": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListingSort": {
        "dataType": "refEnum",
        "enums": ["recent","price","num"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxidsResponse": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","required":true},
            "height": {"dataType":"double","required":true},
            "idx": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
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
            "pendingOps": {"dataType":"double","default":0},
            "included": {"dataType":"boolean","default":false},
            "fundAddress": {"dataType":"string"},
            "fundTotal": {"dataType":"double","default":0},
            "fundUsed": {"dataType":"double","default":0},
            "fundBalance": {"dataType":"double","default":0},
            "data": {"ref":"TxoData"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BSV20Txo": {
        "dataType": "refObject",
        "properties": {
            "txid": {"dataType":"string","default":""},
            "vout": {"dataType":"double","default":0},
            "outpoint": {"ref":"Outpoint"},
            "owner": {"dataType":"string"},
            "satoshis": {"dataType":"double","default":1},
            "script": {"dataType":"string"},
            "spend": {"dataType":"string"},
            "spendHeight": {"dataType":"double"},
            "spendIdx": {"dataType":"double"},
            "height": {"dataType":"double","default":0},
            "idx": {"dataType":"double","default":0},
            "op": {"dataType":"string","default":""},
            "tick": {"dataType":"string"},
            "id": {"dataType":"string"},
            "sym": {"dataType":"string"},
            "dec": {"dataType":"double"},
            "icon": {"dataType":"string"},
            "amt": {"dataType":"string","default":""},
            "status": {"ref":"Bsv20Status","default":0},
            "reason": {"dataType":"string","default":""},
            "listing": {"dataType":"boolean","default":false},
            "price": {"dataType":"double"},
            "pricePer": {"dataType":"double"},
            "payout": {"dataType":"string"},
            "pricePerUnit": {"dataType":"double"},
            "sale": {"dataType":"boolean"},
            "lock": {"dataType":"nestedObjectLiteral","nestedProperties":{"until":{"dataType":"double","required":true},"address":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenBalanceResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"listed":{"dataType":"nestedObjectLiteral","nestedProperties":{"pending":{"dataType":"string","required":true},"confirmed":{"dataType":"string","required":true}},"required":true},"all":{"dataType":"nestedObjectLiteral","nestedProperties":{"pending":{"dataType":"string","required":true},"confirmed":{"dataType":"string","required":true}},"required":true},"icon":{"dataType":"string"},"dec":{"dataType":"double"},"sym":{"dataType":"string"},"id":{"dataType":"string"},"tick":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"height":{"dataType":"double","required":true},"status":{"ref":"Bsv20Status","required":true},"tick":{"dataType":"string"},"id":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Event": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "data": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlockHeader": {
        "dataType": "refObject",
        "properties": {
            "hash": {"dataType":"string","required":true},
            "height": {"dataType":"double","required":true},
            "version": {"dataType":"double","required":true},
            "prevHash": {"dataType":"string","required":true},
            "merkleroot": {"dataType":"string","required":true},
            "time": {"dataType":"double","required":true},
            "bits": {"dataType":"double","required":true},
            "nonce": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras"});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/api/txos/address/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getUnspentByAddress)),

            function TxosController_getUnspentByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    q: {"in":"query","name":"q","dataType":"string"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
                    refresh: {"default":false,"in":"query","name":"refresh","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'getUnspentByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/address/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postUnspentByAddress)),

            function TxosController_postUnspentByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
                    refresh: {"default":false,"in":"query","name":"refresh","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'postUnspentByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getHistoryByAddress)),

            function TxosController_getHistoryByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    q: {"in":"query","name":"q","dataType":"string"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'getHistoryByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postHistoryByAddress)),

            function TxosController_postHistoryByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    bsv20: {"default":false,"in":"query","name":"bsv20","dataType":"boolean"},
                    origins: {"default":false,"in":"query","name":"origins","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'postHistoryByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/address/:address/sync',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.syncAddress)),

            function TxosController_syncAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'syncAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/address/:address/balance',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getBalanceByAddress)),

            function TxosController_getBalanceByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    refresh: {"default":false,"in":"query","name":"refresh","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'getBalanceByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/search',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getTxoSearchAll)),

            function TxosController_getTxoSearchAll(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
                    type: {"in":"query","name":"type","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'getTxoSearchAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/search',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postTxoSearchAll)),

            function TxosController_postTxoSearchAll(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
                    type: {"in":"query","name":"type","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'postTxoSearchAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/search/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getTxoSearchUnspent)),

            function TxosController_getTxoSearchUnspent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
                    type: {"in":"query","name":"type","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'getTxoSearchUnspent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/search/unspent',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postTxoSearchUnspent)),

            function TxosController_postTxoSearchUnspent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
                    type: {"in":"query","name":"type","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'postTxoSearchUnspent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/txos/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.getTxoByOutpoint)),

            function TxosController_getTxoByOutpoint(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'getTxoByOutpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/txos/outpoints',
            ...(fetchMiddlewares<RequestHandler>(TxosController)),
            ...(fetchMiddlewares<RequestHandler>(TxosController.prototype.postOutpoints)),

            function TxosController_postOutpoints(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoints: {"in":"body","name":"outpoints","required":true,"dataType":"array","array":{"dataType":"string"}},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxosController();

              templateService.apiHandler({
                methodName: 'postOutpoints',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx/bin',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.broadcastBuf)),

            function TxController_broadcastBuf(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txbuf: {"in":"body","name":"txbuf","required":true,"dataType":"buffer"},
                    format: {"default":"tx","in":"query","name":"format","dataType":"union","subSchemas":[{"dataType":"enum","enums":["tx"]},{"dataType":"enum","enums":["ef"]},{"dataType":"enum","enums":["beef"]}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'broadcastBuf',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.broadcast)),

            function TxController_broadcast(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    rawtx: {"in":"body-prop","name":"rawtx","required":true,"dataType":"string"},
                    format: {"default":"tx","in":"query","name":"format","dataType":"union","subSchemas":[{"dataType":"enum","enums":["tx"]},{"dataType":"enum","enums":["ef"]},{"dataType":"enum","enums":["beef"]}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'broadcast',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/:txid/submit',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTxSubmit)),

            function TxController_getTxSubmit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getTxSubmit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx/:txid/submit',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.postTxSubmit)),

            function TxController_postTxSubmit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'postTxSubmit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/:txid/status',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTxStatus)),

            function TxController_getTxStatus(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getTxStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/:txid/raw',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTxRawtx)),

            function TxController_getTxRawtx(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getTxRawtx',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/:txid/proof',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTxProof)),

            function TxController_getTxProof(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getTxProof',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/:txid',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTx)),

            function TxController_getTx(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getTx',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/batch',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getTxBatch)),

            function TxController_getTxBatch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txids: {"in":"query","name":"txids","required":true,"dataType":"array","array":{"dataType":"string"}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getTxBatch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx/batch',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.postTxBatch)),

            function TxController_postTxBatch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txids: {"in":"body","name":"txids","required":true,"dataType":"array","array":{"dataType":"string"}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'postTxBatch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/tx/address/:address/from/:blockHeight',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.getAddressTxids)),

            function TxController_getAddressTxids(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    blockHeight: {"in":"path","name":"blockHeight","required":true,"dataType":"double"},
                    auth: {"in":"header","name":"Authorization","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'getAddressTxids',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/tx/address/:address/:txid/$:ts',
            ...(fetchMiddlewares<RequestHandler>(TxController)),
            ...(fetchMiddlewares<RequestHandler>(TxController.prototype.SaveTxPost)),

            function TxController_SaveTxPost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
                    ts: {"in":"path","name":"ts","required":true,"dataType":"double"},
                    auth: {"in":"header","name":"Authorization","required":true,"dataType":"string"},
                    txbuf: {"in":"body","name":"txbuf","dataType":"buffer"},
                    format: {"default":"tx","in":"query","name":"format","dataType":"union","subSchemas":[{"dataType":"enum","enums":["tx"]},{"dataType":"enum","enums":["ef"]},{"dataType":"enum","enums":["beef"]}]},
                    tags: {"default":[],"in":"query","name":"tags","dataType":"array","array":{"dataType":"string"}},
                    broadcast: {"default":false,"in":"query","name":"broadcast","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TxController();

              templateService.apiHandler({
                methodName: 'SaveTxPost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/stats',
            ...(fetchMiddlewares<RequestHandler>(StatsController)),
            ...(fetchMiddlewares<RequestHandler>(StatsController.prototype.getOpenListings)),

            function StatsController_getOpenListings(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StatsController();

              templateService.apiHandler({
                methodName: 'getOpenListings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/spends/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(SPendsController)),
            ...(fetchMiddlewares<RequestHandler>(SPendsController.prototype.getSpend)),

            function SPendsController_getSpend(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SPendsController();

              templateService.apiHandler({
                methodName: 'getSpend',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/spends',
            ...(fetchMiddlewares<RequestHandler>(SPendsController)),
            ...(fetchMiddlewares<RequestHandler>(SPendsController.prototype.getSpends)),

            function SPendsController_getSpends(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoints: {"in":"body","name":"outpoints","required":true,"dataType":"array","array":{"dataType":"string"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SPendsController();

              templateService.apiHandler({
                methodName: 'getSpends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/origins/count',
            ...(fetchMiddlewares<RequestHandler>(OriginsController)),
            ...(fetchMiddlewares<RequestHandler>(OriginsController.prototype.getCount)),

            function OriginsController_getCount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OriginsController();

              templateService.apiHandler({
                methodName: 'getCount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/origins/num/:num',
            ...(fetchMiddlewares<RequestHandler>(OriginsController)),
            ...(fetchMiddlewares<RequestHandler>(OriginsController.prototype.getOriginByNum)),

            function OriginsController_getOriginByNum(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    num: {"in":"path","name":"num","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OriginsController();

              templateService.apiHandler({
                methodName: 'getOriginByNum',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/origins/:origin/map',
            ...(fetchMiddlewares<RequestHandler>(OriginsController)),
            ...(fetchMiddlewares<RequestHandler>(OriginsController.prototype.getOriginMap)),

            function OriginsController_getOriginMap(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OriginsController();

              templateService.apiHandler({
                methodName: 'getOriginMap',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/opns/:domain',
            ...(fetchMiddlewares<RequestHandler>(OpnsController)),
            ...(fetchMiddlewares<RequestHandler>(OpnsController.prototype.getOpns)),

            function OpnsController_getOpns(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    domain: {"in":"path","name":"domain","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OpnsController();

              templateService.apiHandler({
                methodName: 'getOpns',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/opns/:domain/mine',
            ...(fetchMiddlewares<RequestHandler>(OpnsController)),
            ...(fetchMiddlewares<RequestHandler>(OpnsController.prototype.getOpnsMine)),

            function OpnsController_getOpnsMine(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    domain: {"in":"path","name":"domain","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OpnsController();

              templateService.apiHandler({
                methodName: 'getOpnsMine',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/market',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.getOpenListings)),

            function MarketController_getOpenListings(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
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
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarketController();

              templateService.apiHandler({
                methodName: 'getOpenListings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/market',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.postMarketSearch)),

            function MarketController_postMarketSearch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
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
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarketController();

              templateService.apiHandler({
                methodName: 'postMarketSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/market/sales',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.getMarketSales)),

            function MarketController_getMarketSales(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    q: {"in":"query","name":"q","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    text: {"default":"","in":"query","name":"text","dataType":"string"},
                    minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                    maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
                    address: {"in":"query","name":"address","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarketController();

              templateService.apiHandler({
                methodName: 'getMarketSales',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/market/sales',
            ...(fetchMiddlewares<RequestHandler>(MarketController)),
            ...(fetchMiddlewares<RequestHandler>(MarketController.prototype.postMarketSalesSearch)),

            function MarketController_postMarketSalesSearch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    data: {"in":"body","name":"data","dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
                    sort: {"default":"recent","in":"query","name":"sort","ref":"ListingSort"},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    text: {"default":"","in":"query","name":"text","dataType":"string"},
                    minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                    maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
                    address: {"in":"query","name":"address","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarketController();

              templateService.apiHandler({
                methodName: 'postMarketSalesSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/txid/:txid',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getLocksByTxid)),

            function LocksController_getLocksByTxid(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LocksController();

              templateService.apiHandler({
                methodName: 'getLocksByTxid',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/address/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getUnspentLocks)),

            function LocksController_getUnspentLocks(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LocksController();

              templateService.apiHandler({
                methodName: 'getUnspentLocks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/address/:address/history',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getLocksHistory)),

            function LocksController_getLocksHistory(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LocksController();

              templateService.apiHandler({
                methodName: 'getLocksHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/locks/search',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.getLocksSearch)),

            function LocksController_getLocksSearch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LocksController();

              templateService.apiHandler({
                methodName: 'getLocksSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/locks/search',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.postLocksSearch)),

            function LocksController_postLocksSearch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"body","name":"query","required":true,"ref":"TxoData"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LocksController();

              templateService.apiHandler({
                methodName: 'postLocksSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/locks/address/:address/search',
            ...(fetchMiddlewares<RequestHandler>(LocksController)),
            ...(fetchMiddlewares<RequestHandler>(LocksController.prototype.postLocksSearchByAddress)),

            function LocksController_postLocksSearchByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    query: {"in":"body","name":"query","required":true,"ref":"TxoData"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LocksController();

              templateService.apiHandler({
                methodName: 'postLocksSearchByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/search',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getInscriptionSearch)),

            function InscriptionsController_getInscriptionSearch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    q: {"in":"query","name":"q","dataType":"string"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getInscriptionSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/search',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.postInscriptionSearch)),

            function InscriptionsController_postInscriptionSearch(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"body","name":"query","ref":"TxoData"},
                    tag: {"in":"query","name":"tag","dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'postInscriptionSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/recent',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getRecentInscriptions)),

            function InscriptionsController_getRecentInscriptions(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getRecentInscriptions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/txid/:txid',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getInscriptionsByTxid)),

            function InscriptionsController_getInscriptionsByTxid(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getInscriptionsByTxid',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/geohash/:geohashes',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.searchGeohashes)),

            function InscriptionsController_searchGeohashes(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    geohashes: {"in":"path","name":"geohashes","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'searchGeohashes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getTxoByOutpoint)),

            function InscriptionsController_getTxoByOutpoint(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getTxoByOutpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:outpoint/ancestors',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getAncestorsByOutpoint)),

            function InscriptionsController_getAncestorsByOutpoint(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getAncestorsByOutpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/ancestors',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getAncestorsByOutpoints)),

            function InscriptionsController_getAncestorsByOutpoints(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoints: {"in":"body","name":"outpoints","required":true,"dataType":"array","array":{"dataType":"string"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getAncestorsByOutpoints',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/num/:num',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getTxoByNum)),

            function InscriptionsController_getTxoByNum(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    num: {"in":"path","name":"num","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getTxoByNum',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:origin/latest',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getLatestByOrigin)),

            function InscriptionsController_getLatestByOrigin(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
                    script: {"default":false,"in":"query","name":"script","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getLatestByOrigin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/address/:address/ancestors',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getOriginTxidsByAddress)),

            function InscriptionsController_getOriginTxidsByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":1000,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getOriginTxidsByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:origin/history',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getHistoryByOrigin)),

            function InscriptionsController_getHistoryByOrigin(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getHistoryByOrigin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/inscriptions/:origin/txids',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getOriginTxids)),

            function InscriptionsController_getOriginTxids(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getOriginTxids',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/inscriptions/latest',
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController)),
            ...(fetchMiddlewares<RequestHandler>(InscriptionsController.prototype.getLatestByOrigins)),

            function InscriptionsController_getLatestByOrigins(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    origins: {"in":"body","name":"origins","required":true,"dataType":"array","array":{"dataType":"string"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InscriptionsController();

              templateService.apiHandler({
                methodName: 'getLatestByOrigins',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Stats)),

            function FungiblesController_getBsv20Stats(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    sort: {"default":"height","in":"query","name":"sort","dataType":"union","subSchemas":[{"dataType":"enum","enums":["pct_minted"]},{"dataType":"enum","enums":["available"]},{"dataType":"enum","enums":["tick"]},{"dataType":"enum","enums":["max"]},{"dataType":"enum","enums":["height"]}]},
                    dir: {"default":"desc","in":"query","name":"dir","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                    included: {"default":true,"in":"query","name":"included","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Stats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/v2',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getAllBsv20V2Stats)),

            function FungiblesController_getAllBsv20V2Stats(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    sort: {"default":"fund_total","in":"query","name":"sort","dataType":"union","subSchemas":[{"dataType":"enum","enums":["fund_total"]},{"dataType":"enum","enums":["fund_used"]},{"dataType":"enum","enums":["fund_balance"]},{"dataType":"enum","enums":["height"]}]},
                    dir: {"default":"desc","in":"query","name":"dir","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                    included: {"default":true,"in":"query","name":"included","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getAllBsv20V2Stats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/outpoint/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Outpoint)),

            function FungiblesController_getBsv20Outpoint(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Outpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/txid/:txid',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20ByTxid)),

            function FungiblesController_getBsv20ByTxid(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20ByTxid',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/spends/:txid',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Spends)),

            function FungiblesController_getBsv20Spends(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    txid: {"in":"path","name":"txid","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Spends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/balance',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBalanceByAddress)),

            function FungiblesController_getBalanceByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBalanceByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/balance',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBalanceByAddresses)),

            function FungiblesController_getBalanceByAddresses(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    addresses: {"in":"query","name":"addresses","required":true,"dataType":"array","array":{"dataType":"string"}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBalanceByAddresses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/tick/:tick',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosByTick)),

            function FungiblesController_getBsv20UtxosByTick(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
                    listing: {"in":"query","name":"listing","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20UtxosByTick',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/tick/:tick/status',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Status)),

            function FungiblesController_getBsv20Status(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
                    since: {"default":0,"in":"query","name":"since","dataType":"double"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Status',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/tick/:tick/history',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxoHistoryByTick)),

            function FungiblesController_getBsv20UtxoHistoryByTick(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
                    listing: {"in":"query","name":"listing","dataType":"boolean"},
                    sale: {"in":"query","name":"sale","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20UtxoHistoryByTick',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosById)),

            function FungiblesController_getBsv20UtxosById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
                    listing: {"in":"query","name":"listing","dataType":"boolean"},
                    includePending: {"default":false,"in":"query","name":"includePending","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20UtxosById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id/status',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv21Status)),

            function FungiblesController_getBsv21Status(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    since: {"default":0,"in":"query","name":"since","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv21Status',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id/deps',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosByIdWithDeps)),

            function FungiblesController_getBsv20UtxosByIdWithDeps(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20UtxosByIdWithDeps',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id/history',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxoHistoryById)),

            function FungiblesController_getBsv20UtxoHistoryById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
                    listing: {"in":"query","name":"listing","dataType":"boolean"},
                    sale: {"in":"query","name":"sale","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20UtxoHistoryById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/locks',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Locks)),

            function FungiblesController_getBsv20Locks(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Locks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/id/:id/locked',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20LocksById)),

            function FungiblesController_getBsv20LocksById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20LocksById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/id/:id/burned',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20BurnsById)),

            function FungiblesController_getBsv20BurnsById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20BurnsById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id/locks',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getAddressBsv20LocksById)),

            function FungiblesController_getAddressBsv20LocksById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getAddressBsv20LocksById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/tick/:tick/locks',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getAddressBsv20LocksByTick)),

            function FungiblesController_getAddressBsv20LocksByTick(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getAddressBsv20LocksByTick',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/unspent',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20UtxosByAddress)),

            function FungiblesController_getBsv20UtxosByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    status: {"in":"query","name":"status","ref":"Bsv20Status"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
                    type: {"default":"all","in":"query","name":"type","dataType":"union","subSchemas":[{"dataType":"enum","enums":["v1"]},{"dataType":"enum","enums":["v2"]},{"dataType":"enum","enums":["all"]}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20UtxosByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/history',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20HistoryByAddress)),

            function FungiblesController_getBsv20HistoryByAddress(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    status: {"in":"query","name":"status","ref":"Bsv20Status"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    dir: {"default":"DESC","in":"query","name":"dir","ref":"SortDirection"},
                    type: {"default":"all","in":"query","name":"type","dataType":"union","subSchemas":[{"dataType":"enum","enums":["v1"]},{"dataType":"enum","enums":["v2"]},{"dataType":"enum","enums":["all"]}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20HistoryByAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/tick/:tick',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20TickStats)),

            function FungiblesController_getBsv20TickStats(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20TickStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/tick/:tick/holders',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20TickHolders)),

            function FungiblesController_getBsv20TickHolders(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tick: {"in":"path","name":"tick","required":true,"dataType":"string"},
                    limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20TickHolders',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/id/:id',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20V2Stats)),

            function FungiblesController_getBsv20V2Stats(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20V2Stats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/id/:id/holders',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20V2Holders)),

            function FungiblesController_getBsv20V2Holders(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20V2Holders',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/market',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Market)),

            function FungiblesController_getBsv20Market(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sort: {"default":"height","in":"query","name":"sort","dataType":"union","subSchemas":[{"dataType":"enum","enums":["price"]},{"dataType":"enum","enums":["price_per_token"]},{"dataType":"enum","enums":["height"]}]},
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"default":"all","in":"query","name":"type","dataType":"union","subSchemas":[{"dataType":"enum","enums":["v1"]},{"dataType":"enum","enums":["v2"]},{"dataType":"enum","enums":["all"]}]},
                    id: {"in":"query","name":"id","dataType":"string"},
                    tick: {"in":"query","name":"tick","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Market',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/market/sales',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Sales)),

            function FungiblesController_getBsv20Sales(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    dir: {"default":"desc","in":"query","name":"dir","ref":"SortDirection"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    type: {"default":"all","in":"query","name":"type","dataType":"union","subSchemas":[{"dataType":"enum","enums":["v1"]},{"dataType":"enum","enums":["v2"]},{"dataType":"enum","enums":["all"]}]},
                    id: {"in":"query","name":"id","dataType":"string"},
                    tick: {"in":"query","name":"tick","dataType":"string"},
                    pending: {"default":false,"in":"query","name":"pending","dataType":"boolean"},
                    address: {"in":"query","name":"address","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Sales',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:address/id/:id/ancestors',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv21Ancestors)),

            function FungiblesController_getBsv21Ancestors(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    address: {"in":"path","name":"address","required":true,"dataType":"string"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv21Ancestors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/bsv20/:outpoint/ancestors',
            ...(fetchMiddlewares<RequestHandler>(FungiblesController)),
            ...(fetchMiddlewares<RequestHandler>(FungiblesController.prototype.getBsv20Ancestors)),

            function FungiblesController_getBsv20Ancestors(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new FungiblesController();

              templateService.apiHandler({
                methodName: 'getBsv20Ancestors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/events/:channel/:lastEventId',
            ...(fetchMiddlewares<RequestHandler>(EventsController)),
            ...(fetchMiddlewares<RequestHandler>(EventsController.prototype.getChaintip)),

            function EventsController_getChaintip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    channel: {"in":"path","name":"channel","required":true,"dataType":"string"},
                    lastEventId: {"in":"path","name":"lastEventId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventsController();

              templateService.apiHandler({
                methodName: 'getChaintip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/content/:outpoint',
            ...(fetchMiddlewares<RequestHandler>(ContentController)),
            ...(fetchMiddlewares<RequestHandler>(ContentController.prototype.getOrdfsFile)),

            function ContentController_getOrdfsFile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    outpoint: {"in":"path","name":"outpoint","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    fuzzy: {"default":false,"in":"query","name":"fuzzy","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ContentController();

              templateService.apiHandler({
                methodName: 'getOrdfsFile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/content/:origin/latest',
            ...(fetchMiddlewares<RequestHandler>(ContentController)),
            ...(fetchMiddlewares<RequestHandler>(ContentController.prototype.getLatestFile)),

            function ContentController_getLatestFile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    origin: {"in":"path","name":"origin","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ContentController();

              templateService.apiHandler({
                methodName: 'getLatestFile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/collections/:collectionId/stats',
            ...(fetchMiddlewares<RequestHandler>(CollectionsController)),
            ...(fetchMiddlewares<RequestHandler>(CollectionsController.prototype.getCollection)),

            function CollectionsController_getCollection(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CollectionsController();

              templateService.apiHandler({
                methodName: 'getCollection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/collections/:collectionId/holders',
            ...(fetchMiddlewares<RequestHandler>(CollectionsController)),
            ...(fetchMiddlewares<RequestHandler>(CollectionsController.prototype.getCollectionHolders)),

            function CollectionsController_getCollectionHolders(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CollectionsController();

              templateService.apiHandler({
                methodName: 'getCollectionHolders',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/blocks/tip',
            ...(fetchMiddlewares<RequestHandler>(BlocksController)),
            ...(fetchMiddlewares<RequestHandler>(BlocksController.prototype.getChaintip)),

            function BlocksController_getChaintip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlocksController();

              templateService.apiHandler({
                methodName: 'getChaintip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/blocks/list/:height',
            ...(fetchMiddlewares<RequestHandler>(BlocksController)),
            ...(fetchMiddlewares<RequestHandler>(BlocksController.prototype.listBlocks)),

            function BlocksController_listBlocks(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    height: {"in":"path","name":"height","required":true,"dataType":"double"},
                    limit: {"default":1000,"in":"query","name":"limit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlocksController();

              templateService.apiHandler({
                methodName: 'listBlocks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/blocks/get/height/:height',
            ...(fetchMiddlewares<RequestHandler>(BlocksController)),
            ...(fetchMiddlewares<RequestHandler>(BlocksController.prototype.getBlock)),

            function BlocksController_getBlock(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    height: {"in":"path","name":"height","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BlocksController();

              templateService.apiHandler({
                methodName: 'getBlock',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
