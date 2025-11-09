import { SignIn as ClerkSignIn, SignedIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const SignIn = () => {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
            <p className="text-text-secondary mt-2">Sign in to continue your learning journey</p>
          </div>
          <ClerkSignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;




