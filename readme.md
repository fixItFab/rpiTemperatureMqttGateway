# Rasperry PI Temperature MQTT Gateway (DHT22/11)

## Wiring

DHT22: You should add a 4.7K (recommended) - 10KΩ resistor between the Data pin and the VCC pin.

| PI             | DHT22/11     |
| -------------- | ------------ |
| 5V (pin 2)     | VDD (pin 1)  |
| GPIO 4 (pin 7) | Data (pin 2) |
| Ground (pin 6) | GND (pin 4)  |

## Preperation

Clone the project and run `npm i`

## Config

First we have to create our environment file, which will includes all neccessary setting for mqtt and dht22.

```bash
cp .env.template .env
```

Now enter yout mqtt connection data in the `.env` file.

## Run

You can test the gateway with `npm start serve`. If everything works execute `npm run build` to build the gateway

## Service / Autostart (on boot)

1. Copy the file `ghs.temperature-gateway.service` to your system.d folder

```bash
sudo cp ghs.temperature-gateway.service /etc/systemd/system/ghs.temperature-gateway.service
```

2. Start the Service

```bash
sudo systemctl start ghs.temperature-gateway.service
```

3. Check Status of the Service

```bash
sudo systemctl status ghs.temperature-gateway.service
```

4. If everything works fine, stop the service and enable the service for starting the gateway on automatically on reboot.

```bash
sudo systemctl enable ghs.temperature-gateway.service
```

5. Reboot yout pi and check if everthinks works as expected

```bash
sudo reboot
```

## NPM Scripts

- `npm start`
- `npm run serve`
- `npm run build`
- `npm run build-watch`
