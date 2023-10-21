import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Page from "@/components/page";
import ethLogo from "@/assets/eth.webp"
import { ethers } from "ethers"
import { contractAddress } from "@/utils/variables";
import hack1 from "@/contracts/hack/artifacts/contracts/hack1.sol/hack1.json"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ETH = 1000000000000000000

type bounty = {
    id: number,
    maintainer: string,
    title: string,
    description: string,
    url: string,
    reward: string,
    tags: string,
    solved: boolean,
    category: string,
}

const categories = ["question", "bug", "enhancement", "all"]


export default function dashIndex() {
    const [activeBounty, setActiveBounty] = useState<bounty>()
    const [selectedCategory, setSelectedCategory] = useState<string | null>("all")
    const [allBounties, setAllBounties] = useState<bounty[]>([])
    const [fliterdBounties, setFilteredBounties] = useState<bounty[]>([])
    const [showSubmitPopup, setShowSubmitPopup] = useState(false)
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState("")

    async function submitSol(bid: number, desc: string, url: string) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const contr = new ethers.Contract(contractAddress, hack1.abi, signer);
        let tx = await contr.setDataSolver(bid, desc, url);
        tx.wait()
        toast.success("Solution submitted")
        setShowSubmitPopup(false)
    }

    useEffect(() => {
        async function readBounties() {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            // await (window as any).ethereum.request({ method: "eth_requestAccounts" });
            // const signer = await provider.getSigner();
            // const addr = await signer.getAddress();
            const contr = new ethers.Contract(contractAddress, hack1.abi, provider);
            const len = await contr.BID() as number
            const bounties = []
            for (let i = 0; i < len; i++) {
                const bounty = await contr.bidDetails(i)
                const tmpb = { ...bounty }
                console.log(tmpb)
                bounties.push({
                    id: i,
                    maintainer: tmpb[0],
                    title: tmpb[1],
                    description: tmpb[2],
                    url: tmpb[3],
                    reward: ethers.formatEther(tmpb[4]),
                    tags: tmpb[5],
                    category: tmpb[6],
                    solved: tmpb[7],
                })
            }
            setAllBounties(bounties)
            console.log(bounties)
        }
        readBounties()
    }, [])

    useEffect(() => {
        console.log(allBounties)
        if (!selectedCategory) {
            setFilteredBounties(allBounties)
            return
        }
        setFilteredBounties(allBounties.filter((bounty) => {
            if (selectedCategory == "all") return true
            return bounty.category == selectedCategory
        }))
    }, [allBounties])

    useEffect(() => {
        if (!selectedCategory) {
            setFilteredBounties(allBounties)
            return
        }
        setFilteredBounties(allBounties.filter((bounty) => {
            if (selectedCategory == "all") return true
            return bounty.category == selectedCategory
        }))
    }, [selectedCategory])

    const Bounty = (data: bounty) => {
        return <div className={`max-w-[350px] min-w-[350px] cursor-pointer bg-black/80 ring-1 p-2 m-1 grow rounded-lg ring-[#FFD600]/50 ${activeBounty?.id == data.id ? "ring-2 bg-[#FFD600]/40" : ""}`}
            onClick={() => setActiveBounty(data)}>
            <div className="flex justify-between items-center">
                <div className="font-bold text-2xl truncate">{data.title}</div>
                <div className="flex min-w-fit">{data.reward} <Image alt="eth" src={ethLogo} height={20} width={20} /></div>
            </div>
            <div className="flex gap-2 justify-end">
                {data.tags.split(",").map((tag) => {
                    return <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{tag}</div>
                })}
            </div>
        </div>
    }


    return <Page>
        <ToastContainer />
        {showSubmitPopup && <div className="absolute w-full h-full top-0 left-0 bg-white/10 overflow-y-scroll z-20 rounded-lg backdrop-blur-lg ring-1 ring-white/30 p-4">
            <button className="absolute top-2 right-5 font-bold text-2xl" onClick={() => setShowSubmitPopup(false)}>x</button>
            <div className="font-bold text-xl mb-2">Submit Solution</div>
            <div className="flex flex-col gap-2">
                <textarea maxLength={150} minLength={50} className="bg-black/70 p-2 rounded-lg w-full" placeholder="description" onBlur={(e) => setDescription(e.target.value)} />
                <input className="bg-black/70 p-2 rounded-lg w-full" placeholder="url" onChange={(e) => setUrl(e.target.value)} />
            </div>
            <button onClick={() => {
                if (activeBounty)
                    submitSol(activeBounty.id, description, url)
            }}
                className="p-2 ring-1 ring-white/50 text-xl px-4 rounded-lg m-2 hover:bg-black/50 transition-all duration-200">submit</button>
        </div>}
        <div className="overflow-scroll flex flex-row">
            {fliterdBounties.map((bounty) => {
                return Bounty(bounty)
            })}
        </div>
        <div className="my-1 mb-2">
            {
                categories.map((category) => {
                    return <button className={`p-2 px-5 rounded-lg m-1 hover:text-amber-700 transition-all duration-200 ${selectedCategory == category ? "text-yellow-600" : "text-white"}`}
                        onClick={() => setSelectedCategory(category)}>{category}</button>
                })
            }
        </div>
        <div className="w-full ring-1 ring-[#FFD600]/50 rounded-lg bg-black/80 h-[60vh] text-left p-7 relative">
            {
                activeBounty ? <div className="">
                    <div className="font-bold text-2xl truncate mb-5">{activeBounty.title}</div>
                    <div className="flex w-fit bg-indigo-500/90 px-5 p-1 rounded-lg font-bold">{activeBounty.reward} <Image alt="eth" src={ethLogo} height={20} width={20} /></div>
                    <div className="flex gap-2 justify-end">
                        {activeBounty.tags.split(",").map((tag) => {
                            return <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{tag}</div>
                        })}
                    </div>
                    <div className="text-white">
                        {activeBounty.description}
                    </div>
                    <div className="flex gap-5 justify-center items-center absolute bottom-5 w-full">
                        <Link href={activeBounty.url} target="_blank" className="bg-white text-black p-2 px-5 rounded-lg block w-fit hover:font-bold">View</Link>
                        <Link href={"https://github.com/" + activeBounty.url.split("/")[3] + "/" + activeBounty.url.split("/")[4] + "/fork"} target="_blank" className="bg-white text-black p-2 px-5 rounded-lg block w-fit hover:font-bold">Create Fork</Link>
                        <button className="bg-white text-black p-2 px-5 rounded-lg block w-fit hover:font-bold" onClick={() => { setShowSubmitPopup(true) }}>Submit Solution</button>
                    </div>
                </div> : <div>Select a bounty from above</div>
            }
        </div>
    </Page>
}