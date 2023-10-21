import Link from "next/link";
import { Button } from "@mantine/core";
import { useAccount } from "wagmi"



export default function Navbar() {
    const { isConnected } = useAccount()

    return <div className="mx-auto bg-black/40 ring-none ring-orange-600/40 p-2  font-bold text-2xl rounded-xl flex justify-between items-center relative z-10">
        <Link href="/" className="pl-3 font-bold text-white text-4xl" >GIT-<span className="text-[#FFD600]">RAVEN</span></Link>
        <div className="flex gap-5" suppressHydrationWarning>
            <w3m-button />
            <Link href="/dashboard" suppressHydrationWarning><Button color="#FFD600" className="" style={{ color: "black" }}>dashboard</Button></Link>
        </div>
    </div>
}