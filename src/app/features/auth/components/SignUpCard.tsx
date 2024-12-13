'use client';
import { useState } from 'react';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
});

type SignInData = z.infer<typeof signInSchema>;

export function SignUpCard() {
  const [isLoading, setIsLoading] = useState(false);

  const onProviderSignUp = async (provider: 'github' | 'google') => {
    signIn(provider, {
      callbackUrl: '/',
    });
  };

  const onSubmit = async (data: SignInData) => {
    // Simulate API call
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="h-screen relative z-20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto animate-in">
          <CardHeader className="space-y-2">
            <CardTitle className="text-4xl text-center ">
              Welcome to{' '}
              <span className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                Crevo
              </span>
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onProviderSignUp('github')}
                disabled={isLoading}
              >
                <FaGithub className="mr-2 h-4 w-4" />
                Sign up with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onProviderSignUp('google')}
                disabled={isLoading}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign up with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={() => {}} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button
                type="submit"
                className="w-full transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?
              <Link href="/login">
                <Button variant="link" className="px-0">
                  Log in
                </Button>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export default SignUpCard;
