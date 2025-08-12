import {
  CrolangP2PJs,
  CrolangNodeJs,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
  CrolangNodeCallbacksJsBuilder,
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, BROKER_ADDR } from '../Constants';

const COUNTER_THRESHOLD = 20;

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {

    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    CrolangP2PJs.connectToSingleNode(
        BOB_ID,
        CrolangNodeCallbacksJsBuilder.create()
            .setOnDisconnection((id) => {
                console.log(`Disconnected from Node ${id}`);
            })
            .addOnNewMsgCallback('COUNT_CHANNEL', (node: CrolangNodeJs, msg: string) => {
                console.log(`[COUNT_CHANNEL][${node.id}]: ${msg}`);
                const count = parseInt(msg, 10);
                if (count >= COUNTER_THRESHOLD) {
                    console.log(`Counter threshold exceeded, disconnecting from Node ${node.id}`);
                    node.disconnect();
                } else {
                    node.send('COUNT_CHANNEL', (count + 1).toString());}
                })
            .setOnConnectionSuccess((node: CrolangNodeJs) => {
                console.log(`Connected successfully to Node ${node.id}`);
                console.log('Disconnecting from Broker...');
                CrolangP2PJs.disconnectFromBroker()
                    .then(() => {
                        return CrolangP2PJs.isLocalNodeConnectedToBroker();
                    })
                    .then((isConnected) => {
                        console.log(`Is local Node connected to the Broker: ${isConnected}`);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
    )
});
