import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { Middleware } from "next/dist/lib/load-custom-routes";
import {NextRequest, NextResponse} from "next/server";

export async function middleware(req:NextRequest){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({
        req,
        res
    });

    await supabase.auth.getSession();
    return res;
};