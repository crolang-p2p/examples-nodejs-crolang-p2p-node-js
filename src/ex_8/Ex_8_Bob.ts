import { 
    CrolangP2PJs, 
    CrolangNodeJs,
    IncomingCrolangNodesCallbacksJsBuilder,
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { BOB_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    BOB_ID,
    OnNewSocketMsgJsBuilder.create()
        .addListener("GREETINGS_CHANNEL", (id, msg) => {
            console.log("[GREETINGS_CHANNEL WebSocket][" + id + "]: " + msg)
        })
        .addListener("SECRET_CHANNEL", (id, msg) => {
            console.log("[SECRET_CHANNEL WebSocket][" + id + "]: " + msg)
        }),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);
});
