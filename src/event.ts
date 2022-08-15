// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

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
	RequestID,
	Uint16,
	Uint32,
	Uint64,
	Uint8
} from "./index"
import {Base58} from "./crypto";

export class Event {
	private index = 0;
	private readonly msg: string[];
	public readonly timestamp: Int32;

	protected constructor(msg: string[]) {
		this.msg = msg;
		this.timestamp = Number(this.next());
	}

	private next(): string {
		return this.msg[this.index++];
	}

	protected nextAddress(): Address {
		return this.next();
	}

	protected nextAgentID(): AgentID {
		return this.next();
	}

	protected nextBool(): Bool {
		return this.next() != "0";
	}

	protected nextBytes(): Bytes {
		return Base58.decode(this.next());
	}

	protected nextChainID(): ChainID {
		return this.next();
	}

	protected nextColor(): Color {
		return this.next();
	}

	protected nextHash(): Hash {
		return this.next();
	}

	protected nextHname(): Hname {
		return Number(this.next());
	}

	protected nextInt8(): Int8 {
		return Number(this.next());
	}

	protected nextInt16(): Int16 {
		return Number(this.next());
	}

	protected nextInt32(): Int32 {
		return Number(this.next());
	}

	protected nextInt64(): Int64 {
		return BigInt(this.next());
	}

	protected nextRequestID(): RequestID {
		return this.next();
	}

	protected nextString(): string {
		return this.next();
	}

	protected nextUint8(): Uint8 {
		return Number(this.next());
	}

	protected nextUint16(): Uint16 {
		return Number(this.next());
	}

	protected nextUint32(): Uint32 {
		return Number(this.next());
	}

	protected nextUint64(): Uint64 {
		return BigInt(this.next());
	}
}
