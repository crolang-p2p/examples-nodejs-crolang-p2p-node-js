import { 
    CrolangP2PJs, 
    CrolangNodeJs,
    IncomingCrolangNodesCallbacksJsBuilder,
    OnNewSocketMsgJsBuilder,
    BrokerConnectionAdditionalParametersJsBuilder
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, BROKER_ADDR } from '../Constants';

function isConnectionAttemptAuthorized(id, platform, version): boolean{
    console.log("Connection attempt from Node " + id + " on platform " + platform + " with version " + version)
    return id === ALICE_ID
}

CrolangP2PJs.connectToBroker(
    BROKER_ADDR, 
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);

    const incomingCrolangNodesCallbacks = IncomingCrolangNodesCallbacksJsBuilder.create()
        .setOnConnectionAttempt(isConnectionAttemptAuthorized)
        .setOnConnectionSuccess((node: CrolangNodeJs) => {
            console.log(`Connected successfully to Node ${node.id}`);
        })
        .setOnConnectionFailed((id, reason) => {
            console.log("Failed to connect to Node " + id + ": " + reason);
        })
        .setOnDisconnection(id => {
            console.log("Disconnected from node " + id);
        })
        .addOnNewMsgCallback("CHANNEL_NUMBERS", (node: CrolangNodeJs, msg: string) => {
            console.log("Received on CHANNEL_NUMBERS from " + node.id + ": " + msg);
        })
        .addOnNewMsgCallback("CHANNEL_DISCONNECT", (node: CrolangNodeJs, msg: string) => {
            console.log("Received a message on CHANNEL_DISCONNECT from Node " + node.id);
            CrolangP2PJs.stopIncomingConnections();
            console.log("Are incoming connections allowed: " + CrolangP2PJs.areIncomingConnectionsAllowed());
            console.log("Disconnecting from " + node.id);
            node.disconnect()
        });

    CrolangP2PJs.allowIncomingConnections(incomingCrolangNodesCallbacks);

}).catch((error) => {
    console.error(`Error connecting to Broker: ${error}`);
});
