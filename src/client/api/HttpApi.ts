import { Address, Cell, TupleItem } from "ton-core";
import axios, { AxiosAdapter, AxiosInstance } from "axios";

export class HttpApi {
    private readonly client: AxiosInstance;

    constructor(endpoint: string, opts?: { timeout?: number, apiKey?: string, adapter?: AxiosAdapter }) {
        this.client = axios.create({
            baseURL: endpoint,
            timeout: opts?.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...(opts?.apiKey && { 'X-API-Key': opts.apiKey })
            },
            adapter: opts?.adapter,
        });
    }

    async callGetMethod(address: Address, name: string, stack: TupleItem[] = []): Promise<any> {
        const { data } = await this.client.post(`/`, {
            jsonrpc: '2.0',
            id: '1',
            method: 'runGetMethod',
            params: {
                address: address.toString(),
                method: name,
                stack: stack,
            },
        });
        return data.result;
    }

    async getTransactions(address: Address, opts: { limit: number, lt?: string, hash?: string, to_lt?: string, inclusive?: boolean }): Promise<any> {
        const { data } = await this.client.get(`/transactions`, {
            params: {
                address: address.toString(),
                ...opts
            }
        });
        return data;
    }

    async getTransaction(address: Address, lt: string, hash: string): Promise<any> {
        const { data } = await this.client.get(`/transactions/${address.toString()}/${lt}/${hash}`);
        return data;
    }

    async getMasterchainInfo(): Promise<any> {
        const { data } = await this.client.get(`/masterchainInfo`);
        return data;
    }

    async getShards(seqno: number): Promise<any> {
        const { data } = await this.client.get(`/shards/${seqno}`);
        return data;
    }

    async getBlockTransactions(workchain: number, seqno: number, shard: string): Promise<any> {
        const { data } = await this.client.get(`/blocks/${workchain}/${shard}/${seqno}/transactions`);
        return data;
    }

    async sendBoc(boc: Buffer): Promise<any> {
        const { data } = await this.client.post(`/boc`, {
            boc: boc.toString('base64'),
        });
        return data;
    }

    async estimateFee(address: Address, args: { body: Cell, initCode: Cell | null, initData: Cell | null, ignoreSignature: boolean }): Promise<any> {
        const { data } = await this.client.post(`/estimateFee`, {
            address: address.toString(),
            body: args.body.toBoc().toString('base64'),
            init_code: args.initCode ? args.initCode.toBoc().toString('base64') : '',
            init_data: args.initData ? args.initData.toBoc().toString('base64') : '',
            ignore_chksig: args.ignoreSignature,
        });
        return data;
    }

    async getAddressInformation(address: Address): Promise<any> {
        const { data } = await this.client.get(`/addressInformation`, {
            params: {
                address: address.toString()
            }
        });
        return data;
    }
}
