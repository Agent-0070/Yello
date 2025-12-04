import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import AuthService from '../services/auth';
import type { LoginRequest } from '../types/auth';

interface LoginFormProps {
  onToggleMode: () => void;
  onLoginSuccess: () => void;
}

export function LoginForm({ onToggleMode, onLoginSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login(formData);
      
      if (response.success) {
        toast({
          title: 'Login successful!',
          description: `Welcome back, ${response.data?.user?.firstName || response.data?.user?.username || 'user'}!`,
        });
        onLoginSuccess();
      } else {
        toast({
          title: 'Login failed',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full md:max-w-2xl max-w-md mx-auto font-poppins">
      <CardHeader className="space-y-1">
        <CardTitle className="md:text-[40px] text-[24px] font-[550] text-center font-poppins md:mb-4"><span className='text-yellow-500 font-salsa'>Hello!</span> Welcome Back</CardTitle>
        <CardDescription className="text-center md:text-[15px] text-[13px] font-[400]">
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 ">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full md:text-[16px] text-[14px] font-[550] border border-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className="mt-4 text-center md:text-[15px] text-[13px] font-[500]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium cursor-pointer"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
}