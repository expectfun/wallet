import BN from "bn.js";
import { Address, Cell, StackItem, TonClient4 } from "ton";
import { sha256 } from "ton-crypto";
import { bytesToHex } from "./bytesToHex";

export const DNS_CATEGORY_NEXT_RESOLVER = 'dns_next_resolver'; // Smart Contract address
export const DNS_CATEGORY_WALLET = 'wallet'; // Smart Contract address
export const DNS_CATEGORY_SITE = 'site'; // ADNL address

export const tonDnsRootAddress = Address.parse('Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq');
// export const tonDnsRootAddress = Address.parse('EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz'); // old root (TON DNS Collection Address)

export async function categoryToBN(category: string | undefined) {
    if (!category) return new BN(0); // all categories
    const categoryHash = await sha256(Buffer.from(category, 'utf8'));
    return new BN(bytesToHex(categoryHash), 16);
}

export async function editWalletPayload(addr: string) {
    const parsedAddress = Address.parse(addr);

    const dataCell = createChangeDnsContentPayload({
        category: DNS_CATEGORY_WALLET,
        value: createSmartContractAddressRecord(parsedAddress)
    });

    return dataCell;
}

export async function editResolverPayload(addr: string) {
    const parsedAddress = Address.parse(addr);

    const dataCell = createChangeDnsContentPayload({
        category: DNS_CATEGORY_NEXT_RESOLVER,
        value: createNextResolverRecord(parsedAddress)
    });

    return dataCell;
}

export async function createChangeDnsContentPayload(params: { category: string, value: Cell | null, queryId?: number }) {
    const changeContent = new Cell;
    changeContent.bits.writeUint(0x4eb1f0f9, 32); // OP
    changeContent.bits.writeUint(params.queryId || 0, 64); // query_id
    changeContent.bits.writeUint(await categoryToBN(params.category), 256);

    if (params.value) {
        changeContent.refs[0] = params.value;
    }
    return changeContent
}

export function createSmartContractAddressRecord(smartContractAddress: Address) {
    const cell = new Cell();
    cell.bits.writeUint(0x9fd3, 16); // https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L827
    cell.bits.writeAddress(smartContractAddress);
    cell.bits.writeUint(0, 8); // flags
    return cell;
}

export function createNextResolverRecord(smartContractAddress: Address) {
    const cell = new Cell();
    cell.bits.writeUint(0xba93, 16); // https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L819
    cell.bits.writeAddress(smartContractAddress);
    return cell;
}

function parseStackItemAddress(item: StackItem) {
    if (item.type !== 'slice') {
        return null;
    }

    return item.cell.beginParse().readAddress();
}

export type AuctionInfo = {
    maxBidAddress: Address | null,
    maxBidAmount: BN,
    auctionEndTime: number
}

export async function getAuctionInfo(tonClient4: TonClient4, seqno: number, address: Address): Promise<AuctionInfo | null> {
    const result = (await tonClient4.runMethod(seqno, address, 'get_auction_info')).result;

    if (result[0].type !== 'slice') {
        return null;
    }
    const maxBidAddress = result[0].cell.beginParse().readAddress();
    if (result[1].type !== 'int') {
        return null;
    }
    const maxBidAmount = result[1].value;
    if (result[2].type !== 'int') {
        return null;
    }
    const auctionEndTime = result[2].value.toNumber();
    return { maxBidAddress, maxBidAmount, auctionEndTime };
}

export async function getDnsData(tonClient4: TonClient4, seqno: number, address: Address) {
    const result = (await tonClient4.runMethod(seqno, address, 'get_nft_data')).result;

    const isInitialized = result[0].type === 'int' ? result[0].value.toNumber() === -1 : false;
    const index = result[1].type === 'int' ? result[1].value : null;
    const collectionAddress = parseStackItemAddress(result[2]);
    const ownerAddress = isInitialized ? parseStackItemAddress(result[3]) : null;

    if (result[4].type !== 'cell') {
        return null;
    }
    const contentCell = result[4].cell;

    return { isInitialized, index, collectionAddress, ownerAddress, contentCell };
}

export async function getDnsLastFillUpTime(tonClient4: TonClient4, seqno: number, address: Address) {
    const result = (await tonClient4.runMethod(seqno, address, 'get_last_fill_up_time')).result;

    return result[0].type === 'int' ? result[0].value.toNumber() : 0;
}

function domainToBytes(domain: string) {
    if (!domain || !domain.length) {
        throw new Error('empty domain');
    }
    if (domain === '.') {
        return new Uint8Array([0]);
    }

    domain = domain.toLowerCase();

    for (let i = 0; i < domain.length; i++) {
        if (domain.charCodeAt(i) <= 32) {
            throw new Error('bytes in range 0..32 are not allowed in domain names');
        }
    }

    for (let i = 0; i < domain.length; i++) {
        const s = domain.substring(i, i + 1);
        for (let c = 127; c <= 159; c++) { // another control codes range
            if (s === String.fromCharCode(c)) {
                throw new Error('bytes in range 127..159 are not allowed in domain names');
            }
        }
    }

    const arr = domain.split('.');

    arr.forEach(part => {
        if (!part.length) {
            throw new Error('domain name cannot have an empty component');
        }
    });

    let rawDomain = arr.reverse().join('\0') + '\0';
    if (rawDomain.length < 126) {
        rawDomain = '\0' + rawDomain;
    }

    return new TextEncoder().encode(rawDomain);
}

function parseSmartContractAddressImpl(cell: Cell, prefix0: number, prefix1: number) {
    const slice = cell.beginParse();
    const pref0 = slice.readUintNumber(8);
    const pref1 = slice.readUintNumber(8);
    if (pref0 !== prefix0 || pref1 !== prefix1) throw new Error('Invalid dns record value prefix');
    return slice.readAddress();
}

function parseSmartContractAddressRecord(cell: Cell) {
    return parseSmartContractAddressImpl(cell, 0x9f, 0xd3);
}

function parseNextResolverRecord(cell: Cell) {
    return parseSmartContractAddressImpl(cell, 0xba, 0x93);
}

async function dnsResolveImpl(tonClient4: TonClient4, seqno: number, dnsAddress: Address, rawDomainBytes: Uint8Array, category?: string, oneStep?: boolean): Promise<Address | Cell | BN | null> {
    const len = rawDomainBytes.length * 8;

    const domainCell = new Cell();
    for (let i = 0; i < rawDomainBytes.length; i++) {
        domainCell.bits.writeUint8(rawDomainBytes[i]);
    }

    const categoryBN = await categoryToBN(category);
    const result = (await tonClient4.runMethod(seqno, dnsAddress, 'dnsresolve', [{ type: 'slice', cell: domainCell }, { type: 'int', value: categoryBN }])).result;

    if (result.length !== 2) {
        throw new Error('Invalid dnsresolve response, res.length !== 2');
    }

    if (result[0].type !== 'int') {
        throw new Error('Invalid dnsresolve response, res[0].type !== int');
    }
    const resultLen = result[0].value.toNumber();

    if (result[1].type === 'null') {
        return null;
    }

    if (result[1].type !== 'cell') {
        throw new Error('Invalid dnsresolve response, res[1].type !== cell');
    }
    let cell: Cell | null = result[1].cell;
    if ((cell instanceof Array) && cell.length === 0) {
        cell = null;
    }

    if (cell && !cell.bits) { // not a Cell
        throw new Error('Invalid dnsresolve response, res[1].cell is not a Cell');
    }

    if (resultLen === 0) {
        return null;  // domain cannot be resolved
    }

    if (resultLen % 8 !== 0) {
        throw new Error('domain split not at a component boundary');
    }
    // if (rawDomainBytes[resultLen] !== 0) {
    //     throw new Error('domain split not at a component boundary');
    // }
    if (resultLen > len) {
        throw new Error('invalid response ' + resultLen + '/' + len);
    } else if (resultLen === len) {
        if (category === DNS_CATEGORY_NEXT_RESOLVER) {
            return cell ? parseNextResolverRecord(cell) : null;
        } else if (category === DNS_CATEGORY_WALLET) {
            return cell ? parseSmartContractAddressRecord(cell) : null;
        } else if (category === DNS_CATEGORY_SITE) {
            return cell ? cell : null // todo: convert to BN;
        } else {
            return cell;
        }
    } else {
        if (!cell) {
            return null; // domain cannot be resolved
        } else {
            const nextAddress = parseNextResolverRecord(cell);
            if (oneStep) {
                if (category === DNS_CATEGORY_NEXT_RESOLVER) {
                    return nextAddress;
                } else {
                    return null;
                }
            } else {
                if (nextAddress) {
                    return await dnsResolveImpl(tonClient4, seqno, nextAddress, rawDomainBytes.slice(resultLen / 8), category, false);
                } else {
                    return null;
                }
            }
        }
    }
}

async function dnsResolve(tonClient4: TonClient4, seqno: number, rootDnsAddress: Address, domain: string, category?: string, oneStep?: boolean) {
    const rawDomainBytes = domainToBytes(domain);
    return dnsResolveImpl(tonClient4, seqno, rootDnsAddress, rawDomainBytes, category, oneStep);
}

export async function resolveDomain(tonClient4: TonClient4, rootDnsAddress: Address, domain: string, category?: string, oneStep?: boolean) {
    const seqno = (await tonClient4.getLastBlock()).last.seqno;
    return dnsResolve(tonClient4, seqno, rootDnsAddress, domain, category, oneStep);
}

export function validateDomain(domain: string) {
    if (domain.length < 4 || domain.length > 126) {
        return false;
    }
    for (let i = 0; i < domain.length; i++) {
        const char = domain.charCodeAt(i);
        const isHyphen = (char === 45);
        const isValidChar = (isHyphen && (i > 0) && (i < domain.length - 1)) || ((char >= 48) && (char <= 57)) || ((char >= 97) && (char <= 122)); // '-' or 0-9 or a-z ;  abcdefghijklmnopqrstuvwxyz-0123456789

        if (!isValidChar) {
            return false;
        }
    }
    return true;
}
