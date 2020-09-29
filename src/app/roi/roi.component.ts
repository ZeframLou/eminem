import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-roi',
  templateUrl: './roi.component.html',
  styleUrls: ['./roi.component.css']
})
export class RoiComponent implements OnInit {
  paidDAIAmount: BigNumber;
  eminenceBalance: BigNumber;
  eminenceSellValue: BigNumber;
  soldDAIAmount: BigNumber;
  profitDAIAmount: BigNumber;
  roi: BigNumber;
  loaded: boolean;
  loading: boolean;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService) {
    this.resetData();
  }

  ngOnInit(): void {
  }

  async loadData() {
    this.loaded = false;
    this.loading = true;

    const rawEminenceBalance = await this.contract.Eminence.methods.balanceOf(this.wallet.userAddress).call();
    this.eminenceBalance = new BigNumber(rawEminenceBalance).div(this.constants.PRECISION);
    this.eminenceSellValue = new BigNumber(await this.contract.Eminence.methods.calculateContinuousBurnReturn(rawEminenceBalance).call()).div(this.constants.PRECISION);

    let pastBuyEvents = await this.contract.Eminence.getPastEvents('CashShopBuy', {
      fromBlock: 10950651
    })
    pastBuyEvents = pastBuyEvents.filter((event) => event.returnValues._from.toLowerCase() === this.wallet.userAddress.toLowerCase());
    let _paidDAIAmount = new BigNumber(0);
    for (const event of pastBuyEvents) {
      const eventPaidDAIAmount = new BigNumber(event.returnValues._deposit).div(this.constants.PRECISION);
      _paidDAIAmount = _paidDAIAmount.plus(eventPaidDAIAmount);
    }
    this.paidDAIAmount = _paidDAIAmount;

    let pastSellEvents = await this.contract.Eminence.getPastEvents('CashShopSell', {
      fromBlock: 10950651
    })
    pastSellEvents = pastSellEvents.filter((event) => event.returnValues._from.toLowerCase() === this.wallet.userAddress.toLowerCase());
    let _soldDAIAmount = new BigNumber(0);
    for (const event of pastSellEvents) {
      const eventSoldDAIAmount = new BigNumber(event.returnValues._reimbursement).div(this.constants.PRECISION);
      _soldDAIAmount = _soldDAIAmount.plus(eventSoldDAIAmount);
    }
    this.soldDAIAmount = _soldDAIAmount;

    this.profitDAIAmount = this.soldDAIAmount.plus(this.eminenceSellValue).minus(this.paidDAIAmount);
    this.roi = this.profitDAIAmount.div(this.paidDAIAmount);

    this.loaded = true;
    this.loading = false;
  }

  resetData() {
    this.paidDAIAmount = new BigNumber(0);
    this.eminenceBalance = new BigNumber(0);
    this.eminenceSellValue = new BigNumber(0);
    this.soldDAIAmount = new BigNumber(0);
    this.profitDAIAmount = new BigNumber(0);
    this.roi = new BigNumber(0);
    this.loaded = false;
    this.loading = false;
  }
}
