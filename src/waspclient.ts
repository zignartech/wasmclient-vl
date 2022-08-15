// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {RequestID, Results} from "./index"
import {Buffer} from "./buffer";

const headers: { [id: string]: string } = {
    "Content-Type": "application/json",
};

interface IResponse {
    error?: string;
}

interface IExtendedResponse<U> {
    body: U;
    response: Response;
}

interface ICallViewResponse extends IResponse {
    Items: [{ Key: string; Value: string }];
}

export interface ISendTransactionRequest {
    txn_bytes: string;
}

export interface ISendTransactionResponse extends IResponse {
    transaction_id?: string;
}

interface IOffLedgerRequest {
    Request: string;
}

export class WaspClient {
    private readonly waspAPI: string;
    private readonly goshimmerAPI: string;

    constructor(waspAPI: string, goshimmerAPI: string) {
        this.waspAPI = waspAPI;
        if (!waspAPI.startsWith("http")) {
             this.waspAPI = "http://" + waspAPI;
        }
        this.goshimmerAPI = goshimmerAPI;
        if (!goshimmerAPI.startsWith("http")) {
            this.goshimmerAPI = "http://" + goshimmerAPI;
        }
    }

    public async callView(chainID: string, contractHName: string, entryPoint: string, args: Buffer): Promise<Results> {
        const request = {Request: args.toString("base64")};
        const result = await WaspClient.sendRequest<unknown, ICallViewResponse>(
            "post",
            this.waspAPI + `/chain/${chainID}/contract/${contractHName}/callview/${entryPoint}`,
            request
        );
        const res = new Results();

        if (result?.body !== null && result.body.Items) {
            for (const item of result.body.Items) {
                const key = Buffer.from(item.Key, "base64").toString();
                const value = Buffer.from(item.Value, "base64");
                res.res.set(key, value);
            }
        }
        return res;
    }

    public async postRequest(chainID: string, offLedgerRequest: Buffer): Promise<void> {
        const request = {Request: offLedgerRequest.toString("base64")};
        await WaspClient.sendRequest<IOffLedgerRequest, null>(
            "post",
            this.waspAPI + `/request/${chainID}`,
            request,
        );
    }

    public async postOnLedgerRequest(chainID: string, onLedgerRequest: Buffer): Promise<ISendTransactionResponse | null> {
        const request = {txn_bytes: onLedgerRequest.toString("base64")};
        const response = await WaspClient.sendRequest<ISendTransactionRequest, ISendTransactionResponse>(
            "post",
            this.goshimmerAPI + `/ledgerstate/transactions`,
            request,
        );
        return response.body;
    }

    public async waitRequest(chainID: string, reqID: RequestID): Promise<void> {
        await WaspClient.sendRequest<unknown, null>(
            "get",
            this.waspAPI + `/chain/${chainID}/request/${reqID}/wait`,
        );
    }

    private static async sendRequest<T, U extends IResponse | null>(
        verb: "put" | "post" | "get" | "delete",
        path: string,
        request?: T | undefined,
    ): Promise<IExtendedResponse<U | null>> {
        let response: U | null = null;
        let fetchResponse: Response;

        try {
            fetchResponse = await fetch(path, {
                method: verb,
                headers,
                body: JSON.stringify(request),
            });

            if (!fetchResponse) {
                throw new Error("No data was returned from the API");
            }

            try {
                response = await fetchResponse.json();
            } catch (err) {
                const error = err as Error;
                if (!fetchResponse.ok) {
                    const text = await fetchResponse.text();
                    throw new Error(error.message + "   ---   " + text);
                }
            }
        } catch (err) {
            const error = err as Error;
            throw new Error("sendRequest: " + error.message);
        }

        return {body: response, response: fetchResponse};
    }
}
