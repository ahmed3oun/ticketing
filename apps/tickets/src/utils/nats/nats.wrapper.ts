import nats, { Stan } from 'node-nats-streaming';


class NatsWrapper {

    private _client: Stan | null = null;
    private isConnected = false; // Track connection state



    public get client(): Stan {
        if (!this._client || !this.isConnected) {
            throw new Error('Cannot access NATS client before connecting')
        }
        return this._client
    }

    async connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this._client!.on('connect', () => {
                this.isConnected = true;
                console.log('Connected to NATS');
                resolve();
            });

            this._client!.on('error', (err) => {
                console.error('Error connecting to NATS:', err);
                reject(err);
            });
        })
    }

}

export const natsWrapper = new NatsWrapper();