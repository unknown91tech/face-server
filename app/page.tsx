import axios from "axios";
import { RSCPathnameNormalizer } from "next/dist/server/normalizers/request/rsc";

export default function Home() {
  
  const answer = async () => {
    
    for( let i=0; i<1 ;i++){
      const response = await axios.post("http://localhost:3002/api/v1/ethereum/eth_getBalance",{
        "chain":"Ethereum",
        "jsonrpc":"2.0",
        "id":1,
        "method":"eth_getBalane",
        "params":[ "0xd8bfF039909Ab3b82D364439c01Fa0A48F52Da73", "latest" ]
    
    });
    console.log(response.data)
  //   const response1  = await axios.post("http://localhost:3002/api/v1/ethereum/eth_getBalance",{
  //     "chain":"Ethereum",
  //     "jsonrpc":"2.0",
  //     "id":1,
  //     "method":"eth_getBalance",
  //     "params":[ "0xd8bfF039909Ab3b82D364439c01Fa0A48F52Da73", "latest" ]
  
  // });
    }
  } 
  answer();
  return (
    <>
    hello
    </>
  );
}
