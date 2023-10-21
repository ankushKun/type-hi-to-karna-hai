import Link from "next/link"
import Page from "@/components/page"
import Image from "next/image"
import eth from "@/assets/eth.jpeg"
import starfield from "@/assets/starfield.gif"

export default function Home() {
  return (
    <Page>
      <div className="flex justify-center items-center absolute top-20 left-0 z-0">
        <div className="opacity-60">
          <Image alt="gitraven" src={eth} width={500} height={500} className="rounded-full shadow-teal-500 shadow-lg" />
        </div>
        <div className="w-1/2 min-w-[50%]">
          <div className="font-bold text-4xl m-5 leading-relaxed"><span className="text-6xl">Boost your <span className="text-[#FFD600]">income</span></span><br /> while boosting open source quality become an <span className="text-[#FFD600]">open-sourcer</span>!</div>
          <Link href="/bounties" className="bg-[#FFD600] text-black font-bold text-3xl p-2 px-5 realative top-5 rounded-full">Explore Bounties</Link>
        </div>
      </div>
    </Page>
  )
}
