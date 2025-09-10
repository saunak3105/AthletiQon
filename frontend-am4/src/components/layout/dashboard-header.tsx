'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, User, Settings, Dumbbell } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/dashboard/test': 'Fitness Test',
  '/dashboard/leaderboard': 'Leaderboard',
  '/dashboard/achievements': 'Achievements',
};

export function DashboardHeader() {
  const pathname = usePathname();
  const avatarImage = PlaceHolderImages.find(p => p.id === 'avatar-1');
  
  const title = pageTitles[pathname] || 'AthletiQon';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
        <Dumbbell className="h-6 w-6 text-primary" />
        <span className="font-bold">AthletiQon</span>
      </div>
      <div className="hidden text-xl font-semibold md:block">{title}</div>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                 {avatarImage && 
                    <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" data-ai-hint={avatarImage.imageHint} />
                  }
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
             <Link href="/login">
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
