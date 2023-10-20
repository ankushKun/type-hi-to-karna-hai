import Navbar from "./navbar"

export default function Page({ children }: any) {
    return <div>
        <Navbar />
        {children}
    </div>
}