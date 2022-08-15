// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Buffer } from "./buffer";
import { Buffer as Buffer$0 } from "../buffer/index";
import { Buffer as Buffer$1 } from "../buffer/index.js";
declare const TYPE_ADDRESS = 1;
declare const TYPE_AGENT_ID = 2;
declare const TYPE_BOOL = 3;
declare const TYPE_BYTES = 4;
declare const TYPE_CHAIN_ID = 5;
declare const TYPE_COLOR = 6;
declare const TYPE_HASH = 7;
declare const TYPE_HNAME = 8;
declare const TYPE_INT8 = 9;
declare const TYPE_INT16 = 10;
declare const TYPE_INT32 = 11;
declare const TYPE_INT64 = 12;
declare const TYPE_MAP = 13;
declare const TYPE_REQUEST_ID = 14;
declare const TYPE_STRING = 15;
type Address = string;
type AgentID = string;
type Bool = boolean;
type Bytes = Buffer;
type ChainID = string;
type Color = string;
type Hash = string;
type Hname = number;
type Int8 = number;
type Int16 = number;
type Int32 = number;
type Int64 = bigint;
type RequestID = string;
type String = string;
type Uint8 = number;
type Uint16 = number;
type Uint32 = number;
type Uint64 = bigint;
declare const TYPE_SIZES: Uint8Array;
declare function panic(err: string): void;
// The Arguments struct is used to gather all arguments for this smart
// contract function call and encode it into this deterministic byte array
declare class Arguments {
    private args;
    private set;
    private setBase58;
    indexedKey(key: string, index: Int32): string;
    mandatory(key: string): void;
    setAddress(key: string, val: AgentID): void;
    setAgentID(key: string, val: AgentID): void;
    setBool(key: string, val: boolean): void;
    setBytes(key: string, val: Bytes): void;
    setColor(key: string, val: Color): void;
    setChainID(key: string, val: ChainID): void;
    setHash(key: string, val: Hash): void;
    setHname(key: string, val: Hname): void;
    setInt8(key: string, val: Int8): void;
    setInt16(key: string, val: Int16): void;
    setInt32(key: string, val: Int32): void;
    setInt64(key: string, val: Int64): void;
    setRequestID(key: string, val: RequestID): void;
    setString(key: string, val: string): void;
    setUint8(key: string, val: Uint8): void;
    setUint16(key: string, val: Uint16): void;
    setUint32(key: string, val: Uint32): void;
    setUint64(key: string, val: Uint64): void;
    // Encode returns a byte array that encodes the Arguments as follows:
    // Sort all keys in ascending order (very important, because this data
    // will be part of the data that will be signed, so the order needs to
    // be 100% deterministic). Then emit the 4-byte argument count.
    // Next for each argument emit the 2-byte key length, the key prepended
    // with the minus sign, the 4-byte value length, and then the value bytes.
    encode(): Bytes;
}
declare class Base58 {
    private static readonly ALPHABET;
    private static readonly ALPHABET_MAP;
    /**
     * Encode a buffer to base58.
     * @param buffer The buffer to encode as base 58.
     * @returns The encoded data as a string.
     */
    static encode(buffer: Buffer$0): string;
    /**
     * Decode a base58 string to a buffer.
     * @param encoded The buffer to encode as base 58.
     * @returns The encoded data as a string.
     */
    static decode(encoded: string): Buffer$0;
    /**
     * Is the encoded string valid base58.
     * @param encoded The encoded string as base 58.
     * @returns True is the characters are valid.
     */
    static isValid(encoded?: string): boolean;
    /**
     * Concatenate 2 base58 strings.
     * @param id1 The first id.
     * @param id2 The second id.
     * @returns The concatenated ids.
     */
    static concat(id1: string, id2: string): string;
    /**
     * Build the reverse lookup map.
     */
    private static buildMap;
}
interface IKeyPair {
    publicKey: Buffer$0;
    secretKey: Buffer$0;
}
/**
 * Class to help with ED25519 Signature scheme.
 */
declare class ED25519 {
    static VERSION: number;
    static PUBLIC_KEY_SIZE: number;
    static SIGNATURE_SIZE: number;
    /**
     * Generate a key pair from the seed.
     * @param seed The seed to generate the key pair from.
     * @returns The key pair.
     */
    static keyPairFromSeed(seed: Buffer$0): IKeyPair;
    /**
     * Privately sign the data.
     * @param keyPair The key pair to sign with.
     * @param buffer The data to sign.
     * @returns The signature.
     */
    static privateSign(keyPair: IKeyPair, buffer: Buffer$0): Buffer$0;
}
declare class Hash$0 {
    static from(bytes: Buffer$1): Buffer$1;
}
declare class Seed {
    /**
     * SeedSize is the size, in bytes, of private key seeds. These are the private key representations used by RFC 8032.
     */
    static SEED_SIZE: number;
    /**
     * Generate a new seed.
     * @returns The random seed.
     */
    static generate(): Buffer$0;
    /**
     * Generate the nth subseed.
     * @param seed The seed to generate from.
     * @param index The index of the subseed to generate.
     * @returns The subseed.
     */
    static subseed(seed: Buffer$0, index: number): Buffer$0;
    /**
     * Is the string a valid seed.
     * @param seed The seed to check.
     * @returns True is the seed is valid.
     */
    static isValid(seed?: string): boolean;
    /**
     * Generate a key pair for the seed index.
     * @param seed The seed.
     * @param index The index of the address to generate.
     * @returns The generated address key pair.
     */
    static generateKeyPair(seed: Buffer$0, index: number): IKeyPair;
    /**
     * Generate an address for the seed.
     * @param seed The seed.
     * @param index The index of the address to generate.
     * @returns The generated address.
     */
    static generateAddress(seed: Buffer$0, index: number): string;
    /**
     * XOR the two input buffers into the output.
     * @param srcA The first source buffer.
     * @param srcB The second source buffer,
     * @param dest The destination buffer.
     */
    private static xorBytes;
}
declare class ClientFunc {
    protected svc: Service;
    private keyPair;
    private xfer;
    constructor(svc: Service);
    // Sends a request to the smart contract service
    // You can wait for the request to complete by using the returned RequestID
    // as parameter to Service.waitRequest()
    post(hFuncName: Hname, args: Arguments | null): Promise<RequestID>;
    // Optionally overrides the default keypair from the service
    sign(keyPair: IKeyPair): void;
    // Optionally indicates which tokens to transfer as part of the request
    // The tokens are presumed to be available in the signing account on the chain
    transfer(xfer: Transfer): void;
}
declare class ClientView {
    private svc;
    constructor(svc: Service);
    protected callView(viewName: string, args: Arguments | null): Promise<Results>;
}
declare class Event {
    private index;
    private readonly msg;
    readonly timestamp: Int32;
    protected constructor(msg: string[]);
    private next;
    protected nextAddress(): Address;
    protected nextAgentID(): AgentID;
    protected nextBool(): Bool;
    protected nextBytes(): Bytes;
    protected nextChainID(): ChainID;
    protected nextColor(): Color;
    protected nextHash(): Hash;
    protected nextHname(): Hname;
    protected nextInt8(): Int8;
    protected nextInt16(): Int16;
    protected nextInt32(): Int32;
    protected nextInt64(): Int64;
    protected nextRequestID(): RequestID;
    protected nextString(): string;
    protected nextUint8(): Uint8;
    protected nextUint16(): Uint16;
    protected nextUint32(): Uint32;
    protected nextUint64(): Uint64;
}
declare class ViewResults {
    res: Results;
    constructor(res: Results);
}
declare class Results {
    res: Map<string, Buffer>;
    exists(key: string): Bool;
    private get;
    private getBase58;
    getAddress(key: string): Address;
    getAgentID(key: string): AgentID;
    getBytes(key: string): Bytes;
    getBool(key: string): Bool;
    getChainID(key: string): ChainID;
    getColor(key: string): Color;
    getHash(key: string): Hash;
    getHname(key: string): Hname;
    getInt8(key: string): Int8;
    getInt16(key: string): Int16;
    getInt32(key: string): Int32;
    getInt64(key: string): Int64;
    getRequestID(key: string): RequestID;
    getString(key: string): String;
    getUint8(key: string): Uint8;
    getUint16(key: string): Uint16;
    getUint32(key: string): Uint32;
    getUint64(key: string): Uint64;
}
type EventHandlers = {
    [key: string]: (message: string[]) => void;
};
declare class Service {
    private serviceClient;
    private webSocket;
    keyPair: IKeyPair | null;
    private eventHandlers;
    scHname: Hname;
    private waspWebSocketUrl;
    constructor(client: ServiceClient, scHname: Hname, eventHandlers: EventHandlers);
    callView(viewName: string, args: Arguments): Promise<Results>;
    postRequest(hFuncName: Int32, args: Arguments, transfer: Transfer, keyPair: IKeyPair): Promise<RequestID>;
    postOnLedgerRequest(hFuncName: Int32, args: Arguments, transfer: Transfer, keyPair: IKeyPair): Promise<RequestID>;
    waitRequest(reqID: RequestID): Promise<void>;
    private configureWebSocketsEventHandlers;
    disconnectWebSocket: () => void;
    connectWebSocket(): void;
    private handleIncomingMessage;
}
interface IConfiguration {
    seed: Buffer | null;
    waspWebSocketUrl: string;
    waspApiUrl: string;
    goShimmerApiUrl: string;
}
declare class Configuration implements IConfiguration {
    seed: Buffer | null;
    waspWebSocketUrl: string;
    waspApiUrl: string;
    goShimmerApiUrl: string;
    chainId: string;
    constructor(configuration: IConfiguration);
    toString: () => string;
}
declare class ServiceClient {
    waspClient: WaspClient;
    configuration: Configuration;
    constructor(config: Configuration);
    static default(): ServiceClient;
}
declare class Transfer {
    private xfer;
    static iotas(amount: Uint64): Transfer;
    static tokens(color: string, amount: Uint64): Transfer;
    set(color: string, amount: Uint64): void;
    // Encode returns a byte array that encodes the Transfer as follows:
    // Sort all nonzero transfers in ascending color order (very important,
    // because this data will be part of the data that will be signed,
    // so the order needs to be 100% deterministic). Then emit the 4-byte
    // transfer count. Next for each color emit the 32-byte color value,
    // and then the 8-byte amount.
    encode(): Bytes;
}
interface IResponse {
    error?: string;
}
interface ISendTransactionRequest {
    txn_bytes: string;
}
interface ISendTransactionResponse extends IResponse {
    transaction_id?: string;
}
declare class WaspClient {
    private readonly waspAPI;
    private readonly goshimmerAPI;
    constructor(waspAPI: string, goshimmerAPI: string);
    callView(chainID: string, contractHName: string, entryPoint: string, args: Buffer): Promise<Results>;
    postRequest(chainID: string, offLedgerRequest: Buffer): Promise<void>;
    postOnLedgerRequest(chainID: string, onLedgerRequest: Buffer): Promise<ISendTransactionResponse | null>;
    waitRequest(chainID: string, reqID: RequestID): Promise<void>;
    private static sendRequest;
}
export { Arguments, ClientFunc, ClientView, Event, ViewResults, Results, EventHandlers, Service, ServiceClient, Transfer, ISendTransactionRequest, ISendTransactionResponse, WaspClient, IConfiguration, Configuration, TYPE_ADDRESS, TYPE_AGENT_ID, TYPE_BOOL, TYPE_BYTES, TYPE_CHAIN_ID, TYPE_COLOR, TYPE_HASH, TYPE_HNAME, TYPE_INT8, TYPE_INT16, TYPE_INT32, TYPE_INT64, TYPE_MAP, TYPE_REQUEST_ID, TYPE_STRING, Address, AgentID, Bool, Bytes, ChainID, Color, Hash$0 as Hash, Hash$0 as BufferHash, Hname, Int8, Int16, Int32, Int64, RequestID, String, Uint8, Uint16, Uint32, Uint64, TYPE_SIZES, panic, Seed, ED25519, Base58, IKeyPair };
export * from './buffer';
