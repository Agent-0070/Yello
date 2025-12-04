import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import AuthService from '../services/auth';
import type { RegisterRequest } from '../types/auth';

interface RegisterFormProps {
  onToggleMode: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterForm({ onToggleMode, onRegisterSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.username || formData.username.length < 3) {
      toast({
        title: 'Validation Error',
        description: 'Username must be at least 3 characters long',
        variant: 'destructive',
      });
      return;
    }

    // Username allowed characters: letters, numbers and underscores
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast({
        title: 'Validation Error',
        description: 'Username can only contain letters, numbers, and underscores',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.password || formData.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast({
        title: 'Password Complexity',
        description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Trim username to avoid accidental leading/trailing spaces
      const payload = { ...formData, username: formData.username.trim() };
      const response = await AuthService.register(payload);
      
      if (response.success) {
        const user = response.data?.user;
        const displayName = user?.firstName ?? user?.username ?? 'there';
        toast({
          title: 'Registration successful!',
          description: `Welcome to doHub, ${displayName}!`,
        });
        onRegisterSuccess();
      } else {
        toast({
          title: 'Registration failed',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Registration error',
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
    <Card className="w-full max-w-md md:max-w-2xl mx-auto font-poppins">
      <CardHeader className="space-y-1">
        <CardTitle className="md:text-[40px] text-[25px] font-[550] text-center">Create account</CardTitle>
        <CardDescription className="text-center md:text-[15px] text-[13px] font-[400]">
         <span className="text-yellow-500 font-salsa font-[555]">Hi!</span> Fill in your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
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
            className="w-full bg-transparent md:text-[16px] text-[12px] font-[450] border border-white w-45 md:mt-3 cursor-pointer" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <div className="mt-4 text-center text-[13px] md:text-[15px] font-[500]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-[400] cursor-pointer "
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
}