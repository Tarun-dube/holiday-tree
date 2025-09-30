import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileNav from '@/components/layout/ProfileNav'; // Import the new nav component

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          {/* Render the new navigation component here */}
          <ProfileNav />
        </aside>
        <main className="w-full md:w-3/4">
          {children}
        </main>
      </div>
    </div>
  );
}