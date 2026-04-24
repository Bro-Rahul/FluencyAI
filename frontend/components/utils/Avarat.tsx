"use client"
import images from '@/constants/images';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Avatar = () => {
    const { data } = useSession();

    return (
        <Image
            src={data?.user.avatar ? data.user.avatar : images.pandaImage} alt="profile icons"
            priority
            width={30}
            height={30}
            className='rounded-full'
        />
    )
}

export default Avatar