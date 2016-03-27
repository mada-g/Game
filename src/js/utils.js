export function modulus(val, mod){
  if(val <0){
    const remainder = (-1*val) % mod;
    return (mod - remainder) % mod;
  }
  else{
    return val % mod;
  }
}
