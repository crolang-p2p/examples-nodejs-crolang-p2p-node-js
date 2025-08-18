import { 
    BrokerConnectionAdditionalParametersJsBuilder, 
    CrolangNodeCallbacksJs, 
    CrolangNodeCallbacksJsBuilder, 
    CrolangP2PJs, 
    OnNewSocketMsgJsBuilder
 } from "crolang-p2p-node";
import { ALICE_ID, BOB_ID, BROKER_ADDR } from "../Constants";

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    const callbacks: CrolangNodeCallbacksJs = CrolangNodeCallbacksJsBuilder.create()
        .setOnConnectionSuccess((node) => {
            console.log(`Connected to Node ${node.id} successfully`);
            node.sendString('GREETINGS_CHANNEL', 'Hello there!');
        })
        .setOnConnectionFailed((id, error) => {
            console.error(`Failed to connect to Node ${id}: ${error}`);
        })
        .setOnDisconnection((id) => {
            console.log(`Node ${id} disconnected`);
        })
        .addOnNewMsgCallback('CHANNEL_LETTERS', (node, msg) => {
            console.log(`Received a message on CHANNEL_LETTERS from Node ${node.id}: ${msg}`);
        })
        .addOnNewMsgCallback('CHANNEL_NUMBERS', (node, msg) => {
            console.log(`Received a message on CHANNEL_NUMBERS from Node ${node.id}: ${msg}`);
        });
    
    CrolangP2PJs.connectToSingleNode(BOB_ID, callbacks);

}).catch((error) => {
    console.error(`Failed to connect to Broker: ${error.message}`);
});
