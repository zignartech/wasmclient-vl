// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {Arguments, Hname, RequestID, Service, Transfer} from "./index"
import {IKeyPair} from "./crypto";

export class ClientFunc {
    protected svc: Service;
    private keyPair: IKeyPair | null = null;
    private xfer: Transfer = new Transfer();

    constructor(svc: Service) {
        this.svc = svc;
    }

    // Sends a request to the smart contract service
    // You can wait for the request to complete by using the returned RequestID
    // as parameter to Service.waitRequest()
    public async post(hFuncName: Hname, args: Arguments | null): Promise<RequestID> {
        if (!args)
            args = new Arguments();

        if (!this.keyPair)
            this.keyPair = this.svc.keyPair;

        if (!this.keyPair) throw new Error("Key pair not defined");

        return await this.svc.postRequest(hFuncName, args, this.xfer, this.keyPair);
    }

    // Optionally overrides the default keypair from the service
    public sign(keyPair: IKeyPair): void {
        this.keyPair = keyPair;
    }

    // Optionally indicates which tokens to transfer as part of the request
    // The tokens are presumed to be available in the signing account on the chain
   public transfer(xfer: Transfer): void {
        this.xfer = xfer;
    }
}
