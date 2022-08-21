import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
    rpc: {
      1: "https://mainnet.mycustomnode.com",
      3: "https://ropsten.mycustomnode.com",
      100: "https://dai.poa.network",
      137: "https://rpc.ankr.com/polygon",
      80001: "https://rpc.ankr.com/polygon_mumbai",
      // ...
    },
  });
