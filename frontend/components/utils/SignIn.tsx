"use client"
import { Button } from '../ui/button'
import svg from '@/constants/svgs'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const SignIn = () => {
    const { data } = useSession();
    return (
        <>
            {!data?.user ?
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
                <Image
                    src={data?.user.avatar ? data.user.avatar : svg.profileSVG} alt="profile icons"
                    priority
                    width={30}
                    height={30}
                    className='rounded-full'
                />
            </div>
            {data?.user && < Button onClick={() => signOut()} variant="secondary" className="font-semibold">
                SignOut
            </Button>}
        </>
    )
}

export default SignIn