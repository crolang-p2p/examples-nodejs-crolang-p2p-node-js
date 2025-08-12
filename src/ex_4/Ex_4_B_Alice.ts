import {
  CrolangP2PJs,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
  CrolangNodeConnectionTargetsJsBuilder,
  CrolangNodeCallbacksJs,
  CrolangNodeCallbacksJsBuilder,
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, CAROL_ID, BROKER_ADDR } from '../Constants';

const bobCallbacks: CrolangNodeCallbacksJs = CrolangNodeCallbacksJsBuilder.create()
    .setOnConnectionSuccess((node) => {
        console.log(`Connected to Node ${node.id} successfully`);
        node.send('GREETINGS_CHANNEL', 'Hello there!');
    })
    .setOnConnectionFailed((id, error) => {
        console.error(`Failed to connect to Node ${id}: ${error}`);
    })
    .setOnDisconnection((id) => {
        console.log(`Node ${id} disconnected`);
    })
    .addOnNewMsgCallback('CHANNEL_LETTERS', (node, msg) => {
        console.log(`Received a message on CHANNEL_LETTERS from Node ${node.id}: ${msg}`);
    })
    .addOnNewMsgCallback('CHANNEL_NUMBERS', (node, msg) => {
        console.log(`Received a message on CHANNEL_NUMBERS from Node ${node.id}: ${msg}`);
    });

const carolCallbacks: CrolangNodeCallbacksJs = CrolangNodeCallbacksJsBuilder.create()
    .setOnConnectionSuccess((node) => {
        console.log(`Connected to Node ${node.id} successfully`);
        node.send('GREETINGS_CHANNEL', 'Hello there!');
    })
    .setOnConnectionFailed((id, error) => {
        console.error(`Failed to connect to Node ${id}: ${error}`);
    })
    .setOnDisconnection((id) => {
        console.log(`Node ${id} disconnected`);
    })
    .addOnNewMsgCallback('CHANNEL_ANIMALS', (node, msg) => {
        console.log(`Received a message on CHANNEL_ANIMALS from Node ${node.id}: ${msg}`);
    });

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    CrolangP2PJs.connectToMultipleNodes(
        CrolangNodeConnectionTargetsJsBuilder.create()
            .addTarget(BOB_ID, bobCallbacks)
            .addTarget(CAROL_ID, carolCallbacks),
        result => {
            console.log("All connection attempts concluded");
            result.connectedNodes.forEach(entry => {
                console.log(`Connected to Node ${entry.id} successfully`);
            });
            result.failedNodes.forEach(entry => {
                console.error(`Failed to connect to Node ${entry.id}: ${entry.error}`);
            });
        }
    )

}).catch((error) => {
    console.error(`Failed to connect to Broker: ${error.message}`);
});