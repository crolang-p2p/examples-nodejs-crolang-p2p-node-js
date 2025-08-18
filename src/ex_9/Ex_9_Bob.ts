import { 
    CrolangP2PJs, 
    CrolangNodeJs,
    IncomingCrolangNodesCallbacksJsBuilder,
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder,
    CrolangNodeCallbacksJsBuilder
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, BROKER_ADDR, CAROL_ID } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);

    return CrolangP2PJs.allowIncomingConnections(IncomingCrolangNodesCallbacksJsBuilder.create()
        .setOnConnectionSuccess((node: CrolangNodeJs) => {
            console.log(`Connected successfully to Node ${node.id}`);
        })
        .addOnNewStringMsgCallback("CONNECT_TO_CAROL", (node: CrolangNodeJs, msg: string) => {
            console.log(`[CONNECT_TO_CAROL][${node.id}]`);
            console.log(`Connecting to Node ${CAROL_ID}`);
            connectToCarol();
        })
    );

}).then(() => {
    console.log("Incoming connections allowed successfully");
}).catch((error) => {
    console.error(error);
});

function connectToCarol() {
    CrolangP2PJs.connectToSingleNode(
        CAROL_ID,
        CrolangNodeCallbacksJsBuilder.create()
            .addOnNewMsgCallback("REDIRECT_TO_ALICE", (node: CrolangNodeJs, msg: string) => {
                console.log(`[REDIRECT_TO_ALICE][${node.id}]: ${msg}`);
                CrolangP2PJs.getConnectedNode(ALICE_ID).then((aliceNode) => {
                    if (aliceNode) {
                        const newMsg = `${msg}, this message was redirected by Node ${BOB_ID}`;
                        console.log(`Redirecting to Node ${ALICE_ID}: ${newMsg}`);
                        aliceNode.sendString("REDIRECT_TO_ALICE", newMsg);
                    }
                });
            })
            .setOnConnectionSuccess((node: CrolangNodeJs) => {
                console.log(`Connected successfully to Node ${node.id}`);
            })
    );
}
