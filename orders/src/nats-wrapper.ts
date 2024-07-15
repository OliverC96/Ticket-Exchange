import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {

    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error("NATS client is currently undefined. Call connect() to establish a connection to the NATS Streaming server.")
        }
        return this._client;
    }

    connect(clusterID: string, clientID: string, url: string): Promise<void> {
        this._client = nats.connect(clusterID, clientID, { url });
        return new Promise<void>((resolve, reject) => {
            this.client.on("connect", () => {
                console.log("Successfully connected to NATS Streaming Server.");
                resolve();
            });
            this.client.on("error", (err) => {
                console.error("Failed to connect to NATS Streaming Server.");
                reject(err);
            });
        });
    }

}

export const natsWrapper = new NatsWrapper();