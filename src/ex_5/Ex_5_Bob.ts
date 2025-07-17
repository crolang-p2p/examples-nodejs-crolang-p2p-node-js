import { 
    CrolangP2PJs, 
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { BOB_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);
}).catch((error) => {
    console.error(`Error connecting to Broker: ${error}`);
});
