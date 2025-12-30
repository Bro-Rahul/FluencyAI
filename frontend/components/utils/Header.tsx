import Image from "next/image";
import { Button } from "../ui/button";
import icons from "@/constants/icons";
import Link from "next/link";
import SignIn from "./SignIn";
import MobileView from "./MobileView";

const Header = async () => {
    return (
        <header className="w-full border-b border-white/20 px-6 md:px-10 py-4  text-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex gap-3 items-center">
                    <Image src={icons.logo} width={26} height={26} alt="logo" />
                    <Link href={'/'}><p className="font-bold text-xl">SpeakUp</p></Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href={'/practice'}>
                        <Button variant="link" className="font-semibold">
                            Practice
                        </Button>
                    </Link>
                    <Link href={'/sessions'}>
                        <Button variant="link" className="font-semibold">
                            Sessions
                        </Button>
                    </Link>
                    <Button variant="link" className="font-semibold">
                        Lessons
                    </Button>

                    <SignIn />
                </nav>
            </div>
            <MobileView />
        </header >
    );
};

export default Header;
