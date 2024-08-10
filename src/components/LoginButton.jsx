"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from 'next-auth/react';


const LoginButton = () => {
    const { data: session, status } = useSession();


  return (
    <div>
      {/* Render Logout if session is authenticated, otherwise Login */}
      {status ==="loading"? (<div>Loading...</div>) : status === "authenticated" ? (
            <button onClick={() => signOut()}>Logout</button>
          ) : (
            <button onClick={() => signIn()}>Login</button>
          )}
    </div>
  )
}

export default LoginButton
