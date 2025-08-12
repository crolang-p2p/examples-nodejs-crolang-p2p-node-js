import { 
    BrokerConnectionAdditionalParametersJsBuilder, 
    BrokerLifecycleCallbacksJsBuilder, 
    CrolangP2PJs, 
    CrolangSettingsJsBuilder, 
    LoggingOptionsJsBuilder, 
    OnNewSocketMsgJsBuilder 
} from "crolang-p2p-node";
import { ALICE_ID, BROKER_ADDR } from "../Constants";

CrolangP2PJs.connectToBroker(
    BROKER_ADDR,
    ALICE_ID,
    OnNewSocketMsgJsBuilder.create(),
    BrokerConnectionAdditionalParametersJsBuilder.create()
        .setLogging(LoggingOptionsJsBuilder.create()
            .setEnableBaseLogging(true)  //DEFAULT: false
            .setEnableDebugLogging(true) //DEFAULT: false
        )
        .setLifecycleCallbacks(BrokerLifecycleCallbacksJsBuilder.create()
            .setOnInvoluntaryDisconnection((cause) => {
                console.error(`Involuntary disconnection from Broker: ${cause}`); //DEFAULT: does nothing
            })
            .setOnReconnectionAttempt(() => {
                console.log(`Attempting to reconnect to Broker`); //DEFAULT: does nothing
            })
            .setOnSuccessfullyReconnected(() => {
                console.log(`Successfully reconnected to Broker`); //DEFAULT: does nothing
            })
        )
        .setSettings(CrolangSettingsJsBuilder.create()
            .setP2PConnectionTimeoutMillis(5000) //DEFAULT: 30000
            .setMultipartP2PMessageTimeoutMillis(1000) //DEFAULT: 60000
            .setReconnection(true) //DEFAULT: true
            .setMaxReconnectionAttempts(5) //DEFAULT: null (unlimited)
            .setReconnectionAttemptsDeltaMs(500) //DEFAULT: 2000
        )
).then(() => {
    console.log(`Connected to Broker at ${BROKER_ADDR} as ${ALICE_ID}`);
}).catch((error) => {
    console.error(`Failed to connect to Broker: ${error.message}`);
});