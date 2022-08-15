// The Results struct is used to gather all arguments for a smart
// contract function call and encode it into a deterministic byte array
import {
    Address,
    AgentID,
    Bool,
    Bytes,
    ChainID,
    Color,
    Hash,
    Hname,
    Int16,
    Int32,
    Int64,
    Int8,
    panic,
    RequestID, TYPE_ADDRESS,
    TYPE_AGENT_ID,
    TYPE_BOOL,
    TYPE_BYTES,
    TYPE_CHAIN_ID,
    TYPE_COLOR,
    TYPE_HASH,
    TYPE_HNAME,
    TYPE_INT16,
    TYPE_INT32,
    TYPE_INT64,
    TYPE_INT8,
    TYPE_REQUEST_ID, TYPE_SIZES,
    TYPE_STRING,
    Uint16,
    Uint32,
    Uint64,
    Uint8
} from "./index";
import {Base58} from "./crypto";
import {Buffer} from "./buffer";

export class ViewResults {
    res: Results;

    constructor(res: Results) {
        this.res = res;
    }
}

export class Results {
    res = new Map<string, Bytes>();

    exists(key: string): Bool {
        return this.res.has(key);
    }

    private get(key: string, typeID: Int32): Bytes {
        const size = TYPE_SIZES[typeID];
        const bytes = this.res.get(key);
        if (bytes !== undefined) {
            if (size != 0 && bytes.length != size) {
                panic("invalid type size");
            }
            return bytes;
        }
        // return default all-zero bytes value
        return Buffer.alloc(size);
    }

    private getBase58(key: string, typeID: Int32): string {
        return Base58.encode(this.get(key, typeID));
    }

    getAddress(key: string): Address {
        return this.getBase58(key, TYPE_ADDRESS);
    }

    getAgentID(key: string): AgentID {
        return this.getBase58(key, TYPE_AGENT_ID);
    }

    getBytes(key: string): Bytes {
        return this.get(key, TYPE_BYTES)
    }

    getBool(key: string): Bool {
        return this.get(key, TYPE_BOOL)[0] != 0;
    }

    getChainID(key: string): ChainID {
        return this.getBase58(key, TYPE_CHAIN_ID);
    }

    getColor(key: string): Color {
        return this.getBase58(key, TYPE_COLOR);
    }

    getHash(key: string): Hash {
        return this.getBase58(key, TYPE_HASH);
    }

    getHname(key: string): Hname {
		return this.get(key, TYPE_HNAME).readUInt32LE(0);
    }

    getInt8(key: string): Int8 {
        return this.get(key, TYPE_INT8).readInt8(0);
    }

    getInt16(key: string): Int16 {
        return this.get(key, TYPE_INT16).readInt16LE(0);
    }

    getInt32(key: string): Int32 {
        return this.get(key, TYPE_INT32).readInt32LE(0);
    }

    getInt64(key: string): Int64 {
        return this.get(key, TYPE_INT64).readBigInt64LE(0);
    }

    getRequestID(key: string): RequestID {
        return this.getBase58(key, TYPE_REQUEST_ID);
    }

    getString(key: string): String {
        return this.get(key, TYPE_STRING).toString();
    }

    getUint8(key: string): Uint8 {
        return this.get(key, TYPE_INT8).readUInt8(0);
    }

    getUint16(key: string): Uint16 {
        return this.get(key, TYPE_INT16).readUInt16LE(0);
    }

    getUint32(key: string): Uint32 {
        return this.get(key, TYPE_INT32).readUInt32LE(0);
    }

    getUint64(key: string): Uint64 {
        return this.get(key, TYPE_INT64).readBigUInt64LE(0);
    }

	// TODO Decode() from view call response into map
}
