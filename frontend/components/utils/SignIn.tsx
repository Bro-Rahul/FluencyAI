"use client"
import { Button } from '../ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Avatar from './Avarat'

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
                <Avatar />
            </div>
            {data?.user && < Button onClick={() => signOut()} variant="secondary" className="font-semibold">
                SignOut
            </Button>}
        </>
    )
}

export default SignIn