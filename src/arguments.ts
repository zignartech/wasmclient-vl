// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {
	AgentID,
	ChainID, Color,
	Hash,
	Hname,
	Int16,
	Int64,
	Int8,
	panic,
	RequestID, TYPE_ADDRESS, TYPE_AGENT_ID, TYPE_CHAIN_ID, TYPE_COLOR, TYPE_HASH,
	TYPE_REQUEST_ID,
	TYPE_SIZES,
	Uint16,
	Uint32,
	Uint64,
	Uint8
} from "./index"
import {Base58} from "./crypto";
import {Buffer} from "./buffer";
import {Bytes, Int32} from "./types";

// The Arguments struct is used to gather all arguments for this smart
// contract function call and encode it into this deterministic byte array
export class Arguments {
	private args = new Map<string, Bytes>();

	private set(key: string, val: Bytes): void {
		this.args.set(key, val);
	}

	private setBase58(key: string, val: string, typeID: Int32): void {
		const bytes = Base58.decode(val);
		if (bytes.length != TYPE_SIZES[typeID]) {
			panic("invalid byte size");
		}
		this.set(key, bytes);
	}

	indexedKey(key: string, index: Int32): string {
		return key + "." + index.toString();
	}

	mandatory(key: string): void {
		if (!this.args.has(key)) {
			panic("missing mandatory " + key)
		}
	}

	setAddress(key: string, val: AgentID): void {
		this.setBase58(key, val, TYPE_ADDRESS);
	}

	setAgentID(key: string, val: AgentID): void {
		this.setBase58(key, val, TYPE_AGENT_ID);
	}

	setBool(key: string, val: boolean): void {
		const bytes = Buffer.alloc(1);
		if (val) {
			bytes.writeUInt8(1, 0);
		}
		this.set(key, bytes)
	}

	setBytes(key: string, val: Bytes): void {
		this.set(key, Buffer.from(val));
	}

	setColor(key: string, val: Color): void {
		this.setBase58(key, val, TYPE_COLOR);
	}

	setChainID(key: string, val: ChainID): void {
		this.setBase58(key, val, TYPE_CHAIN_ID);
	}

	setHash(key: string, val: Hash): void {
		this.setBase58(key, val, TYPE_HASH);
	}

	setHname(key: string, val: Hname): void {
		this.setUint32(key, val);
	}

	setInt8(key: string, val: Int8): void {
		const bytes = Buffer.alloc(1);
		bytes.writeInt8(val, 0);
		this.set(key, bytes);
	}

	setInt16(key: string, val: Int16): void {
		const bytes = Buffer.alloc(2);
		bytes.writeInt16LE(val, 0);
		this.set(key, bytes);
	}

	setInt32(key: string, val: Int32): void {
		const bytes = Buffer.alloc(4);
		bytes.writeInt32LE(val, 0);
		this.set(key, bytes);
	}

	setInt64(key: string, val: Int64): void {
		const bytes = Buffer.alloc(8);
		bytes.writeBigInt64LE(val, 0);
		this.set(key, bytes);
	}

	setRequestID(key: string, val: RequestID): void {
		this.setBase58(key, val, TYPE_REQUEST_ID);
	}

	setString(key: string, val: string): void {
		this.set(key, Buffer.from(val));
	}

	setUint8(key: string, val: Uint8): void {
		const bytes = Buffer.alloc(1);
		bytes.writeUInt8(val, 0);
		this.set(key, bytes);
	}

	setUint16(key: string, val: Uint16): void {
		const bytes = Buffer.alloc(2);
		bytes.writeUInt16LE(val, 0);
		this.set(key, bytes);
	}

	setUint32(key: string, val: Uint32): void {
		const bytes = Buffer.alloc(4);
		bytes.writeUInt32LE(val, 0);
		this.set(key, bytes);
	}

	setUint64(key: string, val: Uint64): void {
		const bytes = Buffer.alloc(8);
		bytes.writeBigUInt64LE(val, 0);
		this.set(key, bytes);
	}

	// Encode returns a byte array that encodes the Arguments as follows:
	// Sort all keys in ascending order (very important, because this data
	// will be part of the data that will be signed, so the order needs to
	// be 100% deterministic). Then emit the 4-byte argument count.
	// Next for each argument emit the 2-byte key length, the key prepended
	// with the minus sign, the 4-byte value length, and then the value bytes.
	encode(): Bytes {
		const keys = new Array<string>();
		for (const key of this.args.keys()) {
			keys.push(key);
		}
		keys.sort((lhs, rhs) => lhs.localeCompare(rhs));

		let buf = Buffer.alloc(4);
		buf.writeUInt32LE(keys.length, 0);
		for (const key of keys) {
			const keyBuf = Buffer.from("-" + key);
			const keyLen = Buffer.alloc(2);
			keyLen.writeUInt16LE(keyBuf.length, 0);
			const valBuf = this.args.get(key);
			if (!valBuf) {
				throw new Error("Arguments.encode: missing value");
			}
			const valLen = Buffer.alloc(4);
			valLen.writeUInt32LE(valBuf.length, 0);
			buf = Buffer.concat([buf, keyLen, keyBuf, valLen, valBuf]);
		}
		return buf;
	}
}
