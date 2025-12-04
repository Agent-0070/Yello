import { useState } from 'react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import AuthService from '../services/auth';
import type { User } from '../types/auth';

interface LogoutButtonProps {
  user: User;
}

export function LogoutButton({ user }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      // Force page reload to reset application state
      window.location.reload();
    } catch (error: any) {
      toast({
        title: 'Logout error',
        description: error.message || 'Failed to logout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 font-poppins">
      <h2 className="text-sm md:text-[13px] text-muted-foreground font-[400]">
       <span className='text-yellow-500 font-salsa font-[395] text-[14px]'>Welcome,</span>  {user.firstName || user.username}
      </h2>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}