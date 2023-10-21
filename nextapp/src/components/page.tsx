import Image from "next/image"
import Navbar from "./navbar"

import starfield from "@/assets/starfield.gif"

export default function Page({ children, title = "GitRaven" }: any) {
    return <div className="bg-black/80 min-h-screen p-5 px-10">
        <Image alt="background" src={starfield} width={500} height={500} className="relative z-0 opacity-50"
            style={{ position: "absolute", left: "0px", top: "0px", width: "100vw", height: "100vh", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center" }} />
        <title>{title}</title>
        <Navbar />
        <div className="p-5 text-center relative z-10">{children}</div>
    </div>
}