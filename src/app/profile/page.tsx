import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // This check is redundant due to the layout, but good for safety
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;
  const userInitials = user.name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    // Use the Card component for consistent layout and styling
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || ''} alt={user.name || 'User avatar'} />
            <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-primary">{user.name}</CardTitle>
            <CardDescription>Your personal account details.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <div className="border-t pt-4">
          <p className="font-semibold text-muted-foreground">Email Address</p>
          <p>{user.email}</p>
        </div>
        
        {/* You can add more user details here in the future */}
        <div className="border-t pt-4">
          <p className="font-semibold text-muted-foreground">Member Since</p>
          <p>September 2025</p> {/* Example static data */}
        </div>
      </CardContent>
    </Card>
  );
}