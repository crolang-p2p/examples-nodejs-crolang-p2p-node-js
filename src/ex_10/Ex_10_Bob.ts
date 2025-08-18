import {
  CrolangP2PJs,
  CrolangNodeJs,
  IncomingCrolangNodesCallbacksJsBuilder,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
  CrolangSettingsJsBuilder,
  IncomingByteArrayMsgCallbacksJsBuilder,
} from 'crolang-p2p-node';
import { BOB_ID, BROKER_ADDR } from '../Constants';

let startTime: number | null = null;

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    BOB_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create().setSettings(CrolangSettingsJsBuilder.create().setMultipartP2PMessageTimeoutMillis(600000))
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${BOB_ID}`);

    CrolangP2PJs.allowIncomingConnections(
        IncomingCrolangNodesCallbacksJsBuilder.create()
            .setOnConnectionSuccess((node: CrolangNodeJs) => {
                startTime = Date.now();
                console.log(`Connected to Node ${node.id} successfully, waiting for large data transfer...`);
            })
            .addOnNewByteArrayMsgCallback('LARGE_DATA_TRANSFER', IncomingByteArrayMsgCallbacksJsBuilder.create()
                .setOnNewMsgPartReceived((node: CrolangNodeJs, msgId: number, part: number, total: number) => {
                    const percentage = ((part + 1) / total * 100).toFixed(2);
                    console.log(`Received part ${part} of ${total} for message ${msgId} from Node ${node.id} (${percentage}%)`);
                })
                .setOnNewCompleteMsgReceived((node: CrolangNodeJs, msgId: number, msg: Int8Array) => {
                    const end = Date.now();
                    const bytes = msg.length;
                    const elapsedMs = startTime ? end - startTime : 0;
                    const rate = elapsedMs > 0 ? (bytes / elapsedMs).toFixed(2) : 'N/A';
                    console.log(`Received ${bytes} bytes of data on LARGE_DATA_TRANSFER from Node ${node.id}`);
                    console.log(`Elapsed time since connection ready: ${elapsedMs}ms (${rate} bytes/ms)`);
                })
                .setOnMsgCorruption((node: CrolangNodeJs, msgId: number,) => {
                    console.log(`Message ${msgId} from Node ${node.id} is corrupted.`);
                })
            )
    );

});
