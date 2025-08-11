import { 
    BrokerConnectionAdditionalParametersJsBuilder, 
    CrolangNodeCallbacksJsBuilder, 
    CrolangNodeJs, 
    CrolangP2PJs, 
    OnNewSocketMsgJsBuilder
 } from "crolang-p2p-node";
import { ALICE_ID, BOB_ID, BROKER_ADDR } from '../Constants';

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
            .addOnNewMsgCallback("REDIRECT_TO_ALICE", (node: CrolangNodeJs, msg: string) => {
                console.log(`[REDIRECT_TO_ALICE][${node.id}]: ${msg}`);
            })
            .setOnConnectionSuccess((node: CrolangNodeJs) => {
                console.log(`Connected successfully to Node ${node.id}`);
                node.send("CONNECT_TO_CAROL", "");
            })
    );

});
