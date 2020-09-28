import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  eminenceBalance: BigNumber;
  sellAmount: string;

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
    this.eminenceBalance = new BigNumber(await this.contract.Eminence.methods.balanceOf(this.wallet.userAddress).call()).div(this.constants.PRECISION);
  }

  resetData() {
    this.eminenceBalance = new BigNumber(0);
    this.sellAmount = '0';
  }

  max() {
    this.sellAmount = this.eminenceBalance.toFixed(18);
  }

  sell() {
    if (!this.sellAmount) {
      this.sellAmount = '0';
    }
    const formattedSellAmount = new BigNumber(this.sellAmount).times(this.constants.PRECISION).integerValue().toFixed();
    const func = this.contract.Eminence.methods.sell(formattedSellAmount, 1);
    this.wallet.sendTx(func, () => { }, () => {
      this.loadData();
    }, () => { });
  }
}
