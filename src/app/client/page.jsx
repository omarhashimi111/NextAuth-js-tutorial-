"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const ClientMember = () => {
  const {data: session,status} = useSession()

  if(!session){
    return redirect("/")
  }
  return (
    <div>
      <h1>Client Side Member Page!</h1>
      {status === "loaing" ? (<p>Loading...</p>) :
        session ? (<>
          <h1>{session.user.name}</h1>
          <h1>{session.user.email}</h1>
        </>):
        <></>
      }
    </div>
  )
}

export default ClientMember
