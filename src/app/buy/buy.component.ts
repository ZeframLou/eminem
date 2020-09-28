import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  daiBalance: BigNumber;
  buyAmount: string;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService) {
    this.resetData();
  }

  ngOnInit(): void {
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });
  }

  async loadData() {
    this.daiBalance = new BigNumber(await this.contract.DAI.methods.balanceOf(this.wallet.userAddress).call()).div(this.constants.PRECISION);
  }

  resetData() {
    this.daiBalance = new BigNumber(0);
    this.buyAmount = '0';
  }

  max() {
    this.buyAmount = this.daiBalance.toFixed(18);
  }

  buy() {
    if (!this.buyAmount) {
      this.buyAmount = '0';
    }
    const formattedBuyAmount = new BigNumber(this.buyAmount).times(this.constants.PRECISION).integerValue().toFixed();
    const func = this.contract.Eminence.methods.buy(formattedBuyAmount, 1);
    this.wallet.sendTxWithToken(func, this.contract.DAI, this.constants.EMINENCE_ADDRESS, formattedBuyAmount,
      115444, () => { }, () => {
        this.loadData();
      }, () => { });
  }
}
