import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public wallet: WalletService) { }

  ngOnInit(): void {
  }

  connectWallet() {
    this.wallet.connect(() => {}, () => {}, false);
  }
}
