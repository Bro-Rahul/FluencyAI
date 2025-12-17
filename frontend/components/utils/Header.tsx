"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import icons from "@/constants/icons";
import Link from "next/link";

const Header = () => {
    const [open, setOpen] = useState(false);

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
                    <Link href={'/report'}>
                        <Button variant="link" className="font-semibold">
                            Report
                        </Button>
                    </Link>
                    <Link href={'/practice'}>
                        <Button variant="link" className="font-semibold">
                            Practice
                        </Button>
                    </Link>
                    <Button variant="link" className="font-semibold">
                        Lessons
                    </Button>
                    <Link href={'/profile'}>
                        <Button variant="link" className="font-semibold">
                            Profile
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {open && (
                <div className="md:hidden mt-4 flex flex-col gap-3 pb-4 px-1">
                    <Button variant="link" className="font-semibold text-left">
                        Report
                    </Button>
                    <Button variant="link" className="font-semibold text-left">
                        Practice
                    </Button>
                    <Button variant="link" className="font-semibold text-left">
                        Lessons
                    </Button>
                    <Button variant="link" className="font-semibold text-left">
                        Community
                    </Button>
                </div>
            )}
        </header>
    );
};

export default Header;
