import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Page from "@/components/page";
import ethLogo from "@/assets/eth.webp"

const ETH = 1000000000000000000

type bounty = {
    id: number,
    maintainer: string,
    title: string,
    description: string,
    url: string,
    reward: number,
    tags: string,
    solved: boolean,
    category: string,
}

const categories = ["question", "bug", "enhancement", "all"]

const bounties: bounty[] = [
    {
        id: 1,
        maintainer: "0x000000",
        title: "Patch python flask app",
        description: "Fix API endpoints and add a V2 endpoint",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "python,flask,api",
        solved: false,
        category: "enhancement",
    },
    {
        id: 2,
        maintainer: "0x000000",
        title: "expressjs server setup guide",
        description: "sample description",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "jodejs,api",
        solved: false,
        category: "question",
    },
    {
        id: 3,
        maintainer: "0x000000",
        title: "Sample bounty",
        description: "Bounty Description",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "tag1,tag2",
        solved: false,
        category: "enhancement",
    },
    {
        id: 4,
        maintainer: "0x000000",
        title: "Bounty Title",
        description: "Bounty Description",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "tag1,tag2",
        solved: false,
        category: "bug",
    },
    {
        id: 5,
        maintainer: "0x000000",
        title: "Bounty Title",
        description: "Bounty Description",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "tag1,tag2",
        solved: false,
        category: "bug",
    },
    {
        id: 6,
        maintainer: "0x000000",
        title: "Bounty Title",
        description: "Bounty Description",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "tag1,tag2",
        solved: false,
        category: "question",
    },
    {
        id: 7,
        maintainer: "0x000000",
        title: "Bounty Title",
        description: "Bounty Description",
        url: "#",
        reward: 1000000000000000000 / ETH, // wei
        tags: "tag1,tag2",
        solved: false,
        category: "question",
    },
]

export default function dashIndex() {
    const [activeBounty, setActiveBounty] = useState<bounty | null>()
    const [selectedCategory, setSelectedCategory] = useState<string | null>("all")
    const [allBounties, setAllBounties] = useState<bounty[]>(bounties)
    const [fliterdBounties, setFilteredBounties] = useState<bounty[]>([])

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
                <div className="flex min-w-fit">{data.reward / ETH} <Image alt="eth" src={ethLogo} height={20} width={20} /></div>
            </div>
            <div className="flex gap-2 justify-end">
                {data.tags.split(",").map((tag) => {
                    return <div className="bg-[#FFD600]/80 text-black rounded-lg w-fit px-2">{tag}</div>
                })}
            </div>
        </div>
    }


    return <Page>
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
                    <div className="flex w-fit bg-indigo-500/90 px-5 p-1 rounded-lg font-bold">{activeBounty.reward / ETH} <Image alt="eth" src={ethLogo} height={20} width={20} /></div>
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
                        <button className="bg-white text-black p-2 px-5 rounded-lg block w-fit hover:font-bold">Submit Solution</button>
                    </div>
                </div> : <div>Select a bounty from above</div>
            }
        </div>
    </Page>
}