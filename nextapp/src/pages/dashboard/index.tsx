import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useDisconnect, useConnect } from "wagmi"
import Page from "@/components/page";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"


export default function dashIndex() {
    const [connected, setConnected] = useState(false)
    const [showNewBountyPopup, setShowNewBountyPopup] = useState(false)
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { connect } = useConnect()
    const router = useRouter()
    const { data: session } = useSession()

    useEffect(() => {
        setConnected(isConnected)
        if (!isConnected) router.push("/")
    }, [isConnected])

    return <Page>
        {showNewBountyPopup && <div>

        </div>}
        <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
            <div className="text-3xl mb-5">Dashboard</div>
            <div>Wallet Connected : {connected ? <>{address} <button onClick={() => disconnect()} className="ml-2 ring-1 p-1 px-2 ring-white rounded-lg">signout</button></> : <button className="ml-2 ring-1 p-1 px-2 ring-white rounded-lg" onClick={() => connect()}>connect</button>}</div>
            {session ? <div className="flex justify-center"><div>Github: {session?.user?.login}</div> <button className="ml-2 ring-1 p-1 px-2 ring-white rounded-lg" onClick={() => signOut()}>disconnect</button></div> : <div> <button className="ring-1 ring-white p-1 px-2 rounded-lg" onClick={() => signIn("github")}>connect github</button></div>}
            <button className="" onClick={() => setShowNewBountyPopup(true)}>new bounty</button>
        </div>
    </Page>
}