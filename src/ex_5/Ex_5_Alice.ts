import { 
    CrolangP2PJs, 
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, CAROL_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    CrolangP2PJs.isRemoteNodeConnectedToBroker(BOB_ID)
        .then((isConnected) => {
            console.log("Is " + BOB_ID + " connected to the Broker: " + isConnected);
        })
        .catch(err => {
            console.error("Error checking connection to Broker: " + err);
        });
    
    CrolangP2PJs.areRemoteNodesConnectedToBroker([BOB_ID, CAROL_ID])
        .then(statuses => {
            statuses.forEach(status => {
                console.log("Is " + status.id + " connected to the Broker: " + status.status);
            });
        })
        .catch(err => {
            console.error("Error checking connection to Broker: " + err);
        });
}).catch((error) => {
    console.error(`Error connecting to Broker: ${error}`);
});
