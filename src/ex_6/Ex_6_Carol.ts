import { 
    CrolangP2PJs, 
    CrolangNodeJs,
    IncomingCrolangNodesCallbacksJsBuilder,
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { CAROL_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    CAROL_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${CAROL_ID}`);

    CrolangP2PJs.allowIncomingConnections(IncomingCrolangNodesCallbacksJsBuilder.create()
        .addOnNewStringMsgCallback("GREETINGS_CHANNEL", (node: CrolangNodeJs, msg: string) => {
            console.log(`Received a message on GREETINGS_CHANNEL from Node ${node.id}: ${msg}`);
        })
    );

    console.log("Incoming connections are now allowed");
});
