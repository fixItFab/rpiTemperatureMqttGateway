import { config } from "dotenv";
import { connect } from "mqtt";
import { defer, from, timer } from "rxjs";
import { delay, retryWhen, switchMap, tap } from "rxjs/operators";
import { DhtData } from "./dht.model";

const sensor = require("node-dht-sensor").promises;

const everyMinute$ = timer(0, 60 * 1000);
const dhtData$ = defer(() =>
  from(
    sensor.read(process.env.DHT_TYPE, process.env.DHT_PIN) as Promise<DhtData>
  )
);

config();
const mqttTopic = process.env.MQTT_TOPIC || "UNSET";

// connect to mqtt
const client = connect(`mqtt://${process.env.MQTT_HOST}`, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  will: {
    topic: `${mqttTopic}/online`,
    payload: "false",
    qos: 1,
    retain: true,
  },
});

// handle connection & messages
client.on("connect", onConnect);

function onConnect() {
  console.log("mqtt - connected to host:", process.env.MQTT_HOST);
  client.publish(`${mqttTopic}/online`, "true", { retain: true });

  everyMinute$
    .pipe(
      switchMap((_) => dhtData$),
      retryWhen((err$) =>
        err$.pipe(
          tap((err) => {
            console.log(err, "Retrying in 10 seconds");
          }),
          delay(10_000)
        )
      )
    )
    .subscribe((dhtData) => {
      const temperature = dhtData.temperature.toFixed(1);
      const humidity = dhtData.humidity.toFixed(1);
      const payload = { temperature, humidity };

      client.publish(`${mqttTopic}`, JSON.stringify(payload));

      console.log(`${temperature}°C`, `${humidity}%`);
    });
}
