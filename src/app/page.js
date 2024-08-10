import { getServerSession } from "next-auth"
import { options } from "./api/auth/[...nextauth]/options"
import Image from "next/image"

const Home = async () => {
  const session = await getServerSession(options)
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-orange-400 mt-4">
        Home Page
      </h1>
      {session? (
        <div className="flex flex-col border-gray-800 border gap-4 w-[40%] items-center bg-cyan-400
        rounded-lg shadow-2xl">
          <h1>id: {session.user.id}</h1>
          <h1 className="text-center text-blue-800 font-extrabold">Role: {session.user.role}</h1>
          <Image src={session.user.image} alt="user image" width={20} height={20}/>
          <h2>email: {session.user.email}</h2>
        </div>
      ):
      <></>}
    </div>
  )
}

export default Home
