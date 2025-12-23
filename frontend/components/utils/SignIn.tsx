"use client"
import { Button } from '../ui/button'
import svg from '@/constants/svgs'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'

const SignIn = ({ session }: { session: Session | null }) => {
    return (
        <>
            {!session?.user ?
                <Link href={"/auth/login"}>
                    <Button variant="link" className="font-semibold">
                        Login
                    </Button>
                </Link>
                :
                <Link href={'/profile'}>
                    <Button variant="link" className="font-semibold">
                        Profile
                    </Button>
                </Link>
            }
            <div className="p-2 bg-accent rounded-full">
                <Image src={session?.user.avatar ? session.user.avatar : svg.profileSVG} alt="profile icons" priority />
            </div>
            {session?.user && < Button onClick={() => signOut()} variant="secondary" className="font-semibold">
                SignOut
            </Button>}
        </>
    )
}

export default SignIn