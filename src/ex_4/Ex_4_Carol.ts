import { BrokerConnectionAdditionalParametersJsBuilder, CrolangP2PJs, IncomingCrolangNodesCallbacksJsBuilder, OnNewSocketMsgJsBuilder } from "crolang-p2p-node";
import { BROKER_ADDR, CAROL_ID } from "../Constants";

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    CAROL_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${CAROL_ID}`);

    CrolangP2PJs.allowIncomingConnections(IncomingCrolangNodesCallbacksJsBuilder.create()
        .setOnConnectionSuccess((node) => {
            console.log(`Connected to Node ${node.id} successfully`);
            node.send('CHANNEL_ANIMALS', 'Unicorns');
        })
        .addOnNewMsgCallback('GREETINGS_CHANNEL', (node, msg) => {
            console.log(`Received a message on GREETINGS_CHANNEL from Node ${node.id}: ${msg}`);
        })
    );
}).catch((error) => {
    console.error(`Failed to connect to Broker: ${error.message}`);
});