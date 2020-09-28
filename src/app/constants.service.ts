import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  PRECISION = 1e18;
  DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  EMINENCE_ADDRESS = '0x5ade7aE8660293F2ebfcEfaba91d141d72d221e8';
}
