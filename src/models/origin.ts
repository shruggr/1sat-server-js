// import { Outpoint } from "./outpoint";

// export class Origin {
//     origin: Outpoint = new Outpoint();
//     num: number = 0;
//     height?: number;
//     idx?: number;
//     MAP?: {[key: string]:string};

//     static fromRow(row: any) {
//         const origin = new Origin();
//         origin.origin = row.origin && Outpoint.fromBuffer(row.origin);
//         origin.num = row.num;
//         origin.height = row.height;
//         origin.idx = row.idx;
//         origin.MAP = row.map && JSON.parse(row.map);
//         return origin;
//     }
// }
