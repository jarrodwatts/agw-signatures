"use client";

import { useLoginWithAbstract, useAbstractClient, useGlobalWalletSignerAccount } from "@abstract-foundation/agw-react";
import { useAccount, useSignMessage, useSignTypedData } from "wagmi";
import { exampleData } from "@/const/exampleData";
import { createPublicClient, http } from "viem";
import { abstractTestnet } from "viem/chains";

export default function Home() {
  const { data: client, isLoading, error } = useAbstractClient();
  const { address: signerAddress } = useGlobalWalletSignerAccount();
  const { address: agwAddress } = useAccount();
  const { login } = useLoginWithAbstract();
  const { signTypedDataAsync } = useSignTypedData()
  const { signMessageAsync } = useSignMessage()

  async function sign() {
    const signature = await signMessageAsync(
      {
        message: "hello world"
      }
    )

    const publicClient = createPublicClient({
      chain: abstractTestnet,
      transport: http()
    })

    const isValid = await publicClient.verifyMessage({
      address: agwAddress!,
      signature: signature,
      message: "hello world"
    })

    console.log("Signature is valid?", isValid) // true
  }

  async function signTD() {
    // @ts-ignore
    const signature = await signTypedDataAsync(exampleData);

    const publicClient = createPublicClient({
      chain: abstractTestnet,
      transport: http()
    })

    const isValid = await publicClient.verifyTypedData({
      address: agwAddress!,
      signature: signature,
      types: exampleData.types,
      message: exampleData.message,
      primaryType: exampleData.primaryType,
    });

    console.log("Signature is valid?", isValid) // true
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {agwAddress ? (
        <button onClick={signTD}>Sign Data</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
