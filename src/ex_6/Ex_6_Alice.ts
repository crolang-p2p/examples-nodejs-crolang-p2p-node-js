import { 
    CrolangP2PJs, 
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder,
    CrolangNodeConnectionTargetsJs,
    CrolangNodeConnectionTargetsJsBuilder,
    CrolangNodeCallbacksJs,
    CrolangNodeCallbacksJsBuilder
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, CAROL_ID, BROKER_ADDR } from '../Constants';

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    CrolangP2PJs.connectToMultipleNodes(CrolangNodeConnectionTargetsJsBuilder.create()
        .addTarget(BOB_ID, CrolangNodeCallbacksJsBuilder.create().setOnConnectionSuccess(node => {
            const bob = CrolangP2PJs.getConnectedNode(BOB_ID);
            if(bob !== null){
                console.log("Node " + BOB_ID + " is connected");
                bob.send("GREETINGS_CHANNEL", "Hello " + bob.id + "!");
            }
        }))
        .addTarget(CAROL_ID, CrolangNodeCallbacksJsBuilder.create())
        //TODO onConnectionAttemptConcluded, with code below inside
    );

    const bob = CrolangP2PJs.getConnectedNode(BOB_ID);
    if(bob !== null){
        console.log("Node " + BOB_ID + " is connected");
        bob.send("GREETINGS_CHANNEL", "Hello " + bob.id + "!");
    }

    const carol = CrolangP2PJs.getAllConnectedNodes().find(node => node.id === CAROL_ID);
    if(carol !== undefined){
        console.log("Node " + CAROL_ID + " is connected");
        carol.send("GREETINGS_CHANNEL", "Hello " + carol.id + "!");
    }
});
