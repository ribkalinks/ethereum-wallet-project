export namespace ethclient {
	
	export class Transaction {
	    hash: string;
	    from: string;
	    to: string;
	    valueEth: string;
	    timeStamp: string;
	    isError: string;
	    blockNumber: string;
	
	    static createFrom(source: any = {}) {
	        return new Transaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hash = source["hash"];
	        this.from = source["from"];
	        this.to = source["to"];
	        this.valueEth = source["valueEth"];
	        this.timeStamp = source["timeStamp"];
	        this.isError = source["isError"];
	        this.blockNumber = source["blockNumber"];
	    }
	}

}

export namespace wallet {
	
	export class WalletAccount {
	    address: string;
	    privateKey: string;
	    mnemonic: string;
	
	    static createFrom(source: any = {}) {
	        return new WalletAccount(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	        this.privateKey = source["privateKey"];
	        this.mnemonic = source["mnemonic"];
	    }
	}

}

