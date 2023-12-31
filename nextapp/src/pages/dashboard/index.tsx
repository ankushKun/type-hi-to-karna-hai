import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useDisconnect, useConnect } from "wagmi"
import { ethers } from "ethers";
import Page from "@/components/page";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { contractAddress } from "@/utils/variables";
import hack1 from "@/contracts/hack/artifacts/contracts/hack1.sol/hack1.json"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import eth from "@/assets/eth.webp"
import Link from "next/link";

// async function connectOrSomethingIdk() {
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     await (window as any).ethereum.request({ method: "eth_requestAccounts" });
//     const signer = await provider.getSigner();
//     const addr = await signer.getAddress();
// }


export default function dashIndex() {
    const [connected, setConnected] = useState(false)
    const [showNewBountyPopup, setShowNewBountyPopup] = useState(false)
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { connect } = useConnect()
    const router = useRouter()
    const { data: session } = useSession()

    const [myBounties, setMyBounties] = useState<any[]>([])
    const [contributingTo, setContributingTo] = useState<any[]>([])

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState("")
    const [reward, setReward] = useState(0)
    const [tags, setTags] = useState("")
    const [category, setCategory] = useState("")

    async function createBounty(title: string, description: string, url: string, reward: number, tags: string, category: string) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const contr = new ethers.Contract(contractAddress, hack1.abi, signer);
        let tx;
        if (reward == 0) {
            tx = await contr.setDataMaintainerFree(title, description, url, tags, category);
        } else {
            tx = await contr.setDataMaintainerPiad(title, description, url, tags, category, { value: ethers.parseEther(reward.toString()) });
        }
        tx.wait();
        toast.success("Bounty created")
        setShowNewBountyPopup(false)
    }

    async function getMyBounties() {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        // await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const contr = new ethers.Contract(contractAddress, hack1.abi, provider);
        const bounties = []
        const contributing = []

        for (let j = 0; ; j++) {
            try {
                const addr2bids = await contr.maintainerBID(addr, j)
                // console.log(addr2bids)
                const bounty = await contr.bidDetails(addr2bids)
                bounties.push({
                    id: addr2bids,
                    maintainer: bounty[0],
                    title: bounty[1],
                    description: bounty[2],
                    url: bounty[3],
                    reward: bounty[4],
                    tags: bounty[5],
                    category: bounty[6],
                    solved: bounty[7]
                })
            } catch {
                break;
            }
        }
        setMyBounties(bounties)
        console.log(bounties)
        for (let j = 0; ; j++) {
            try {
                const addr2sols = await contr.solverSID(addr, j)
                // console.log(addr2sols)
                const solution = await contr.sidDetails(addr2sols)
                // console.log({ ...solution })
                const d: any = {
                    bid: addr2sols,
                    solverAddress: solution[0],
                    title: solution[1],
                    description: solution[2],
                    url: solution[3],
                }
                const bid = await contr.bidDetails(addr2sols)
                d["reward"] = bid[4]
                d["tags"] = bid[5]
                d["category"] = bid[6]
                d["solved"] = bid[7]
                d["title"] = bid[1]
                d["description"] = bid[2]
                d["url"] = bid[3]
                contributing.push(d)
            } catch {
                break;
            }
        }
        setContributingTo(contributing)
        console.log(contributing)
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined') {
            // connectOrSomethingIdk()
            getMyBounties()
        }
    }, [])

    useEffect(() => {
        if (!showNewBountyPopup) return
        fetch("/api/gen-categ", {
            method: "POST",
            body: JSON.stringify({ description: description }),
            headers: { "Content-Type": "application/json" }
        }).then((res) => res.json()).then((categ) => {
            setCategory(categ)
        })
    }, [description])

    useEffect(() => {
        setConnected(isConnected)
        if (!isConnected) router.push("/")
    }, [isConnected])

    return <Page>
        <ToastContainer />
        {showNewBountyPopup && <div className="absolute w-full h-full top-0 left-0 bg-white/10 overflow-y-scroll z-20 rounded-lg backdrop-blur-lg ring-1 ring-white/30 p-4">
            <button className="absolute top-2 right-5 font-bold text-2xl" onClick={() => setShowNewBountyPopup(false)}>x</button>
            <div className="font-bold text-xl mb-2">Add new bounty</div>
            <div className="flex flex-col gap-2">
                <input className="bg-black/70 p-2 rounded-lg w-full" placeholder="title" onChange={(e) => setTitle(e.target.value)} />
                <textarea maxLength={150} minLength={50} className="bg-black/70 p-2 rounded-lg w-full" placeholder="description" onBlur={(e) => setDescription(e.target.value)} />
                {category && <div className="bg-black/70 p-2 -mt-2 rounded-lg w-full">Predicted Category: <span className="font-bold text-left">{category}</span></div>}
                <input className="bg-black/70 p-2 rounded-lg w-full" placeholder="url" onChange={(e) => setUrl(e.target.value)} />
                <input type="number" className="bg-black/70 p-2 rounded-lg w-full" placeholder="reward (ETH)" onChange={(e) => setReward(parseFloat(e.target.value))} />
                <input className="bg-black/70 p-2 rounded-lg w-full" placeholder="tags" onChange={(e) => setTags(e.target.value)} />
            </div>
            <button onClick={() => {
                createBounty(title, description, url, reward, tags, category)
            }}
                className="p-2 ring-1 ring-white/50 text-xl px-4 rounded-lg m-2 hover:bg-black/50 transition-all duration-200">submit</button>
        </div>}
        <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
            <div className="text-3xl mb-5">Dashboard</div>
            <div>Wallet Connected : {connected ? <>{address} <button onClick={() => disconnect()} className="ml-2 ring-1 p-1 px-2 ring-white rounded-lg">signout</button></> : <button className="ml-2 ring-1 p-1 px-2 ring-white rounded-lg" onClick={() => connect()}>connect</button>}</div>
            {session ? <div className="flex items-center justify-center"><div>Github: {session?.user?.login}</div> <button className="ml-2 ring-1 p-1 px-2 ring-white rounded-lg" onClick={() => signOut()}>disconnect</button></div> : <div> <button className="ring-1 ring-white p-1 px-2 rounded-lg" onClick={() => signIn("github")}>connect github</button></div>}
            <button className="ring-1 p-1 px-2 ring-white rounded-lg" onClick={() => setShowNewBountyPopup(true)}>new bounty</button>
        </div>
        <div className="flex justify-center items-top gap-3">
            <div className="w-1/2">
                <div className="font-bold text-xl">My Created Bounties</div>
                {myBounties.map((bounty) => {
                    return <div className="bg-black/80 ring-1 ring-white/30 p-2 m-2 rounded-lg">
                        <div className="font-bold text-2xl truncate">{bounty.title}</div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 justify-end">
                                    {bounty.tags.split(",").map((tag: any) => {
                                        return <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{tag}</div>
                                    })}
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="flex gap-2 justify-end">
                                        <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{bounty.category}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 justify-end">
                                    <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2 flex">{parseFloat(ethers.formatEther(bounty.reward)) > 0 ? ethers.formatEther(bounty.reward) : "free"} <Image alt="eth" src={eth} height={20} width={20} /></div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{bounty.solved ? "solved" : "unsolved"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
            <div className="w-1/2">
                <div className="font-bold text-xl">Contributing To</div>
                {contributingTo.map((bounty) => {
                    return <div className="bg-black/80 ring-1 ring-white/30 p-2 m-2 rounded-lg">
                        <div className="font-bold text-2xl truncate">{bounty.title}</div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 justify-end">
                                    <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{bounty.description}</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 justify-end">
                                    <Link href={bounty.url} target="_blank" className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2 flex">{bounty.url}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </Page>
}