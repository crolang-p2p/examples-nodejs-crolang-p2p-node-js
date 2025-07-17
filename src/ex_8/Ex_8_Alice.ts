import { 
    CrolangP2PJs, 
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

    CrolangP2PJs.sendSocketMsg(BOB_ID, "GREETINGS_CHANNEL", "Hello from " + ALICE_ID + "!").catch(err => {
        console.error("Error while trying to send a socket msg to " + BOB_ID + ": " + err);
    });

    CrolangP2PJs.sendSocketMsg(BOB_ID, "SECRET_CHANNEL", "42");
});
