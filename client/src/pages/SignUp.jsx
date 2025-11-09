import { SignUp as ClerkSignUp, SignedIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const SignUp = () => {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">Create Your Account</h2>
            <p className="text-text-secondary mt-2">Start your journey to success with ThinkPlus</p>
          </div>
          <ClerkSignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </>
  );
};

export default SignUp;




