import {
  CrolangP2PJs,
  CrolangNodeJs,
  IncomingCrolangNodesCallbacksJsBuilder,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
  LoggingOptionsJsBuilder,
} from 'crolang-p2p-node';
import { BOB_ID, BROKER_ADDR } from '../Constants';

let startTime: number | null = null;

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create().setLogging(LoggingOptionsJsBuilder.create().setEnableBaseLogging(true).setEnableDebugLogging(true))
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);

    CrolangP2PJs.allowIncomingConnections(
        IncomingCrolangNodesCallbacksJsBuilder.create()
            .setOnConnectionSuccess((node: CrolangNodeJs) => {
                startTime = Date.now();
                console.log(`Connected to Node ${node.id} successfully, waiting for large data transfer...`);
            })
            .addOnNewMsgCallback('LARGE_DATA_TRANSFER', (node: CrolangNodeJs, msg: string) => {
                const end = Date.now();
                const bytes = Buffer.byteLength(msg, 'utf8');
                const elapsedMs = startTime ? end - startTime : 0;
                const rate = elapsedMs > 0 ? (bytes / elapsedMs).toFixed(2) : 'N/A';
                console.log(`Received ${bytes} bytes of data on LARGE_DATA_TRANSFER from Node ${node.id}`);
                console.log(`Elapsed time since connection ready: ${elapsedMs}ms (${rate} bytes/ms)`);
            })
    );

});
