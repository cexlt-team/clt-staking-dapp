import unipoolAbi from './abi/unipool.json'

export const CLT = '0x529E1Fc6cc22d2776550d73C7DbE005A8b0Cb0C4';
export const UNIV2 = '0x6cdc937038B292B2d9514F03B1BD957082201246';
export const UNIPOOL = '0x8722CD7F09FdA250f8e2f451F2F10516AC1d8671';

export const UNIV2_ABI = [
  {
    constant: true,
    inputs: [{
      name: '_owner',
      type: 'address'
    }],
    name: 'balanceOf',
    outputs: [{
      name: 'balance',
      type: 'uint256'
    }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{
      name: '',
      type: 'uint8'
    }],
    type: 'function'
  }
];

export const UNIPOOL_ABI = unipoolAbi;
