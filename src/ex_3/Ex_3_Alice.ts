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
            console.log(`Connected to Node ${node.id}`);
            node.send("CHANNEL_NUMBERS", `42`);
            node.send("CHANNEL_DISCONNECT", ``);
        })
        .setOnDisconnection(id => {
            console.log("Disconnected from Node " + id + ", trying to reconnect...")
            CrolangP2PJs.connectToSingleNode(BOB_ID, CrolangNodeCallbacksJsBuilder.create()
                .setOnConnectionFailed((id, reason) => {
                    console.log("Error connecting to Node " + id + ": " + reason);
                })
            );
        })
    );
}).catch((error) => {
    console.error(`Error connecting to Broker: ${error}`);
});
