import {
  CrolangP2PJs,
  CrolangNodeJs,
  CrolangNodeCallbacksJsBuilder,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, BROKER_ADDR } from '../Constants';
import * as fs from 'fs';
import * as path from 'path';

const resourcePath = path.resolve(__dirname, 'large_file.txt'); // ~100 MB file in same folder

console.log('Reading large file...');
let content: Buffer;
if (!fs.existsSync(resourcePath)) {
    throw new Error(`File not found: ${resourcePath}`);
}
content = fs.readFileSync(resourcePath);
console.log(`File read successfully. Bytes: ${content.length}`);

console.log(`Repeat the content 10 times to simulate a ~1 GB file`);
let toSend = Buffer.alloc(0);
for (let i = 0; i < 10; i++) {
    toSend = Buffer.concat([toSend, content]);
}
console.log(`Total bytes to send: ${toSend.length}`);

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);

    CrolangP2PJs.connectToSingleNode(
        BOB_ID,
        CrolangNodeCallbacksJsBuilder.create().setOnConnectionSuccess((node: CrolangNodeJs) => {
            console.log(`Connected to Node ${node.id} successfully`);
            console.log(`Sending large data to Node ${node.id}...`);
            const sendResult = node.sendBytes('LARGE_DATA_TRANSFER', new Int8Array(toSend));
            console.log(`Byte array data sent result: ${sendResult}`)
        })
    );
});
