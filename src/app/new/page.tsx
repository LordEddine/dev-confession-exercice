import { Header } from '@/components/Header';
import { ConfessionForm } from '@/components/ConfessionForm';
import { auth } from '@clerk/nextjs/server';

import { syncUser } from '@/actions/user.actions';

import { redirect } from 'next/navigation';

 export default async function NewConfessionPage() {
 
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  await syncUser();

  return (
    <>
    <Header/>
    <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Nouvelle Confession</h1>
        <p className="mb-4 text-gray-300">Libérez votre conscience de développeur 🙏</p>
        <ConfessionForm />
    </main>
    </>
  )

}










