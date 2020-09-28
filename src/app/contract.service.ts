import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(public wallet: WalletService, public constants: ConstantsService) { }

  public get DAI() {
    const abi = require(`../assets/abi/ERC20.json`);
    const address = this.constants.DAI_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get Eminence() {
    const abi = require(`../assets/abi/Eminence.json`);
    const address = this.constants.EMINENCE_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }
}
