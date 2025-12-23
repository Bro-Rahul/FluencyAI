"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Session } from 'next-auth';

const MobileView = ({ session }: { session: Session | null }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {
                open && (
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
                )
            }
        </>
    )
}

export default MobileView