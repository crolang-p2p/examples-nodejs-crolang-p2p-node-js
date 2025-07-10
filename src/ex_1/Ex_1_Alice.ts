import { 
    CrolangP2PJs, 
    CrolangNodeJs,
    CrolangNodeCallbacksJsBuilder,
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    CrolangP2PJs.connectToSingleNode(BOB_ID, CrolangNodeCallbacksJsBuilder.create()
        .setOnConnectionSuccess((node: CrolangNodeJs) => {
            console.log(`Connected to Node ${node.id}, platform: ${node.platform}, version: ${node.version}`);
            node.send("GREETINGS_CHANNEL", `Hello from Node ${ALICE_ID}`);
        })
        .setOnConnectionFailed((nodeId: string, reason: any) => {
            console.log(`Error connecting to Node ${nodeId}: ${reason}`);
        })
        .addOnNewMsgCallback("GREETINGS_CHANNEL", (node: CrolangNodeJs, msg: string) => {
            console.log(`Received a message on GREETINGS_CHANNEL from Node ${node.id}: ${msg}`);
        })
    );
}).catch((error) => {
    console.error(`Error connecting to Broker: ${error}`);
});
