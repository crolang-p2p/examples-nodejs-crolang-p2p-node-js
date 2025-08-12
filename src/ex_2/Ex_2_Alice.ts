import { BrokerConnectionAdditionalParametersJsBuilder, ConnectionToBrokerErrorJs, CrolangP2PJs, OnNewSocketMsgJsBuilder } from "crolang-p2p-node";
import { ALICE_ID, BROKER_ADDR } from "../Constants";

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);
}).catch((error) => {
    switch(ConnectionToBrokerErrorJs.Companion.fromErrorMessage(error.message)) {
        case ConnectionToBrokerErrorJs.LOCAL_CLIENT_ALREADY_CONNECTED:
            console.error(`Local client is already connected to Broker at ${BROKER_ADDR}`);
            break;
        case ConnectionToBrokerErrorJs.ALREADY_PERFORMING_CONNECTION:
            console.error(`Already performing a connection to Broker at ${BROKER_ADDR}`);
            break;
        case ConnectionToBrokerErrorJs.CLIENT_WITH_SAME_ID_ALREADY_CONNECTED:
            console.error(`A client with the same ID ${ALICE_ID} is already connected to Broker at ${BROKER_ADDR}`);
            break;
        case ConnectionToBrokerErrorJs.UNSUPPORTED_ARCHITECTURE:
            console.error(`This client version is not supported by Broker at ${BROKER_ADDR}`);
            break;
        case ConnectionToBrokerErrorJs.UNAUTHORIZED:
            console.error(`Unauthorized connection attempt to Broker at ${BROKER_ADDR} with ID ${ALICE_ID}`);
            break;
        case ConnectionToBrokerErrorJs.SOCKET_ERROR:
            console.error(`Socket error while connecting to Broker at ${BROKER_ADDR}`);
            break;
        case ConnectionToBrokerErrorJs.ERROR_PARSING_RTC_CONFIGURATION:
            console.error(`Error parsing RTC configuration for Broker at ${BROKER_ADDR}`);
            break;
        case ConnectionToBrokerErrorJs.UNKNOWN_ERROR:
            console.error(`Unknown error while connecting to Broker at ${BROKER_ADDR}`);
            break;
    }
});