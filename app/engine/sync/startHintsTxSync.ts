import BN from "bn.js";
import { Address } from "ton";
import { AppConfig } from "../../AppConfig";
import { createLogger } from "../../utils/log";
import { Engine } from "../Engine";
import { requestAllHintsIfNeeded } from "./ops";
import { startDependentSync } from "./utils/startDependentSync";

export type TxHints = {
    min: BN;
    max: BN;
};

const ZERO = new BN('0');
const logger = createLogger('hints');

export function startHintsTxSync(address: Address, engine: Engine) {
    let key = `${address.toFriendly({ testOnly: AppConfig.isTestnet })}/hints/tx`;
    let account = engine.persistence.fullAccounts.item(address);
    let cursor = engine.persistence.scannerState.item(address);

    startDependentSync(key, account, engine, async (account) => {

        //
        // Processed interval
        //

        let min: BN = ZERO;
        let max: BN = ZERO;
        if (cursor.value) {
            min = cursor.value.min;
            max = cursor.value.max;
            logger.log(`Scan ${min.toString(10)}-${max.toString(10)}`);
        }

        //
        // Collect referenced addresses
        //

        let mentioned = new Set<string>();
        for (let t of account.transactions) {
            let lt = new BN(t);
            if (lt.lt(min) || lt.gt(max)) {
                let tx = engine.transactions.get(address, t);
                if (!tx) {
                    continue;
                }

                if (tx.inMessage && tx.inMessage.info.src && Address.isAddress(tx.inMessage.info.src) && !tx.inMessage.info.src.equals(address)) {
                    mentioned.add(tx.inMessage.info.src.toFriendly({ testOnly: AppConfig.isTestnet }));
                }
                for (let out of tx.outMessages) {
                    if (out.info.dest && Address.isAddress(out.info.dest) && !out.info.dest.equals(address)) {
                        mentioned.add(out.info.dest.toFriendly({ testOnly: AppConfig.isTestnet }));
                    }
                }
            }
        }
        for (let m of mentioned) {
            logger.log(`${m}: found new hints`);
        }

        //
        // Request hints
        //

        requestAllHintsIfNeeded(Array.from(mentioned).map((v) => Address.parse(v)), account.block, engine);

        //
        // Persist processed
        //
        if (account.transactions.length > 0) {
            let first = new BN(account.transactions[0]);
            let last = new BN(account.transactions[account.transactions.length - 1]);
            cursor.update(() => ({ min: last, max: first }));
        }
    });
}