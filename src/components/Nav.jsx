
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import LoginButton from './LoginButton';




export default async  function Nav() {
  const session = await getServerSession(options)
  

  return (
    <header className="bg-slate-800 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <h1>MySite</h1>
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          {
            session?.user.role === "admin" && <Link href="/admin">Admin</Link>          
          }
          <Link href="/member">Member</Link>
          <Link href="/client">Client</Link>
          <Link href="/public">Public</Link>
          <LoginButton />
        </div>
      </nav>
    </header>
  );
}
