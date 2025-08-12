import {
  CrolangP2PJs,
  CrolangNodeJs,
  CrolangNodeCallbacksJsBuilder,
  OnNewSocketMsgJsBuilder,
  BrokerConnectionAdditionalParametersJsBuilder,
  LoggingOptionsJs,
  LoggingOptionsJsBuilder,
} from 'crolang-p2p-node';
import { ALICE_ID, BOB_ID, BROKER_ADDR } from '../Constants';
import * as fs from 'fs';
import * as path from 'path';

const resourcePath = path.resolve(__dirname, 'large_file.txt'); // ~100 MB file in same folder

console.log('Reading large file...');
let content: string;
if (!fs.existsSync(resourcePath)) {
    throw new Error(`File not found: ${resourcePath}`);
}
content = fs.readFileSync(resourcePath, 'utf8');
console.log(`File read successfully. Bytes: ${Buffer.byteLength(content, 'utf8')}`);

let toSend = '';
for (let i = 0; i < 10; i++) {
    // Repeat the content 10 times to simulate a ~1 GB message
    toSend += content;
}
console.log(`Bytes to send: ${Buffer.byteLength(toSend, 'utf8')}`);

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
            const sendResult = node.send('LARGE_DATA_TRANSFER', toSend);
            console.log(`Data sent result: ${sendResult}`)
        })
    );
});
