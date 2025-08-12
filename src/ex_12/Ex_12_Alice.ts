import { BrokerConnectionAdditionalParametersJsBuilder, CrolangP2PJs, OnNewSocketMsgJsBuilder } from "crolang-p2p-node";
import { ALICE_ID, BROKER_ADDR } from "../Constants";

class Authentication {
    constructor(public token: string, public password: string) {}
}

CrolangP2PJs.connectToBrokerWithAuthentication(
    BROKER_ADDR,
    ALICE_ID,
    JSON.stringify(new Authentication("magic-token", "unicorns")),
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);
}).catch((error) => {
    console.error(`Failed to connect to Broker: ${error.message}`);
});
