import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import "reflect-metadata";
import { BoostBlockchainMonitor } from '../api/models/boost-blockchain-monitor';

export const blockchainScannerLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const monitor = BoostBlockchainMonitor.instance();
        settings.setData('boostMonitor', monitor);
    }
};