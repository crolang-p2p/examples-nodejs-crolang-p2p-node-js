import { 
    BrokerConnectionAdditionalParametersJsBuilder, 
    CrolangP2PJs, 
    IncomingCrolangNodesCallbacksJsBuilder, 
    OnNewSocketMsgJsBuilder
} from "crolang-p2p-node";
import { BOB_ID, BROKER_ADDR } from "../Constants";

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {

    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);

    CrolangP2PJs.allowIncomingConnections(
        IncomingCrolangNodesCallbacksJsBuilder.create()
            .setOnConnectionSuccess((node) => {
                console.log(`Connected to Node ${node.id} successfully`);
                console.log('Disconnecting from Broker...');
                CrolangP2PJs.disconnectFromBroker()
                    .then(() => {
                        return CrolangP2PJs.isLocalNodeConnectedToBroker();
                    })
                    .then((isConnected) => {
                        console.log(`Is local Node connected to the Broker: ${isConnected}`);
                        node.sendString('COUNT_CHANNEL', '0');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .setOnDisconnection((id) => {
                console.log(`Disconnected from Node ${id}`);
            })
            .addOnNewStringMsgCallback('COUNT_CHANNEL', (node, msg) => {
                console.log(`[COUNT_CHANNEL][${node.id}]: ${msg}`);
                node.sendString('COUNT_CHANNEL', (parseInt(msg, 10) + 1).toString());
            })
    );
})