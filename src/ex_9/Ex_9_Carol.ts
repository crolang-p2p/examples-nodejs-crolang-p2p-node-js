import { 
    CrolangP2PJs, 
    CrolangNodeJs,
    IncomingCrolangNodesCallbacksJsBuilder,
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { ALICE_ID, BROKER_ADDR, CAROL_ID } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    CAROL_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${CAROL_ID}`);

    return CrolangP2PJs.allowIncomingConnections(IncomingCrolangNodesCallbacksJsBuilder.create()
        .setOnConnectionSuccess((node: CrolangNodeJs) => {
            console.log(`Connected successfully to Node ${node.id}`);
            const msg = `Hello ${ALICE_ID}, I'm Node ${CAROL_ID}`;
            console.log(`Sending message to Node ${node.id}: ${msg}`);
            node.send("REDIRECT_TO_ALICE", msg);
        })
    )

}).then(() => {
    console.log("Incoming connections allowed successfully");
}).catch((error) => {
    console.error(error);
});