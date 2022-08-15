// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {Arguments, Results, Service} from "./index";

export class ClientView {
    private svc: Service;

    constructor(svc: Service) {
        this.svc = svc;
    }

    protected async callView(viewName: string, args: Arguments | null): Promise<Results> {
        if (args == null) {
            args = new Arguments();
        }
        return await this.svc.callView(viewName, args);
    }
}
