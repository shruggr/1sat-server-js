export interface BlockHeader {
    hash: string
    height: number
    version: number
    prevHash: string
    merkleroot: string
    time: number
    bits: number
    nonce: number
}