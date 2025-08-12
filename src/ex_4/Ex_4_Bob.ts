import {
  CrolangP2PJs,
  IncomingCrolangNodesCallbacksJsBuilder,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
} from 'crolang-p2p-node';
import { BOB_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);

    CrolangP2PJs.allowIncomingConnections(IncomingCrolangNodesCallbacksJsBuilder.create()
        .setOnConnectionSuccess((node) => {
            console.log(`Connected to Node ${node.id} successfully`);
            node.send('CHANNEL_LETTERS', 'ABC');
            node.send('CHANNEL_NUMBERS', '42');
        })
        .addOnNewMsgCallback('GREETINGS_CHANNEL', (node, msg) => {
            console.log(`Received a message on GREETINGS_CHANNEL from Node ${node.id}: ${msg}`);
        })
    );
}).catch((error) => {
    console.error(`Failed to connect to Broker: ${error.message}`);
});