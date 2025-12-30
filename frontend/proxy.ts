import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"

import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request })
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: '/sessions/:path*',
}