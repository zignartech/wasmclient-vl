// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {Arguments, Hname, Int32, RequestID, Results, ServiceClient, Transfer} from "./index"
import {Base58, ED25519, IKeyPair, Hash} from "./crypto";
import {Buffer} from "./buffer";

export type EventHandlers = { [key: string]: (message: string[]) => void };

export class Service {
	private serviceClient: ServiceClient;
	private webSocket: WebSocket | null = null;
	public keyPair: IKeyPair | null = null;
	private eventHandlers: EventHandlers | null = null;
	public scHname: Hname;
	private waspWebSocketUrl: string = "";

	constructor(client: ServiceClient, scHname: Hname, eventHandlers: EventHandlers) {
		this.serviceClient = client;
		this.scHname = scHname;
		this.configureWebSocketsEventHandlers(eventHandlers);
	}

	public async callView(viewName: string, args: Arguments): Promise<Results> {
		return await this.serviceClient.waspClient.callView(
			this.serviceClient.configuration.chainId,
			this.scHname.toString(16),
			viewName,
			args.encode(),
		);
	}

	public async postRequest(hFuncName: Int32, args: Arguments, transfer: Transfer, keyPair: IKeyPair): Promise<RequestID> {
		// get request essence ready for signing
		const chainID = this.serviceClient.configuration.chainId;
		let essence = Base58.decode(chainID);
		const hNames = Buffer.alloc(8)
		hNames.writeUInt32LE(this.scHname, 0);
		hNames.writeUInt32LE(hFuncName, 4);
		const nonce = Buffer.alloc(8)
		nonce.writeBigUInt64LE(BigInt(Math.trunc(performance.now())), 0);
		essence = Buffer.concat([essence, hNames, args.encode(), keyPair.publicKey, nonce, transfer.encode()]);

		let buf = Buffer.alloc(1);
		const requestTypeOffledger = 1;
		buf.writeUInt8(requestTypeOffledger, 0);
		buf = Buffer.concat([buf, essence, ED25519.privateSign(keyPair, essence)]);
		const hash = Hash.from(buf);
		const requestID = Buffer.concat([hash, Buffer.alloc(2)]);

		await this.serviceClient.waspClient.postRequest(chainID, buf);
		return Base58.encode(requestID);
	}

	public async postOnLedgerRequest(hFuncName: Int32, args: Arguments, transfer: Transfer, keyPair: IKeyPair): Promise<RequestID> {
		// get request essence ready for signing
		const config = this.serviceClient.configuration;
		let essence = Buffer.alloc(13)
		essence.writeUInt32LE(this.scHname, 4);
		essence.writeUInt32LE(hFuncName, 8);
		essence = Buffer.concat([essence, args.encode()]);

		let buf = Buffer.alloc(1);
		const requestTypeOffledger = 1;
		buf.writeUInt8(requestTypeOffledger, 0);
		buf = Buffer.concat([buf, essence, ED25519.privateSign(keyPair, essence)]);
		const hash = Hash.from(buf);
		const requestID = Buffer.concat([hash, Buffer.alloc(2)]);

		await this.serviceClient.waspClient.postOnLedgerRequest(config.chainId, buf);
		return Base58.encode(requestID);
	}

	public async waitRequest(reqID: RequestID): Promise<void> {
		await this.serviceClient.waspClient.waitRequest(this.serviceClient.configuration.chainId, reqID);
	}

	private configureWebSocketsEventHandlers(eventHandlers: EventHandlers) {
		this.eventHandlers = eventHandlers

		if (this.serviceClient.configuration.waspWebSocketUrl.startsWith("wss://") || this.serviceClient.configuration.waspWebSocketUrl.startsWith("ws://"))
			this.waspWebSocketUrl = this.serviceClient.configuration.waspWebSocketUrl;
		else
			this.waspWebSocketUrl = "ws://" + this.serviceClient.configuration.waspWebSocketUrl;

		this.waspWebSocketUrl = this.waspWebSocketUrl.replace("%chainId", this.serviceClient.configuration.chainId);

		this.connectWebSocket();
	}

	public disconnectWebSocket = () => {
		console.info(`Disconnecting to Websocket => ${this.waspWebSocketUrl}`);
		this.webSocket?.close();
	}

	public connectWebSocket(): void {
		this.webSocket = new WebSocket(this.waspWebSocketUrl);
		this.webSocket.addEventListener('message', (x) => this.handleIncomingMessage(x));
		this.webSocket.addEventListener('close', () => setTimeout(this.connectWebSocket.bind(this), 1000));
		this.webSocket.addEventListener('open', () => console.info(`Connecting to Websocket => ${this.waspWebSocketUrl}`));
	}

	private handleIncomingMessage(message: MessageEvent<string>): void {
		// expect vmmsg <chain ID> <contract hname> contract.event|parameters
		const msg = message.data.toString().split(' ');
		if (msg.length != 4 || msg[0] != 'vmmsg') {
			return;
		}
		const topics = msg.splice(3).join(' ').split('|');
		const topic = topics[0];
		if (this.eventHandlers && this.eventHandlers[topic] != undefined) {
			this.eventHandlers[topic](topics.slice(1));
		}
	}
}
