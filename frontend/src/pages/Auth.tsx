// src/pages/Auth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

export function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#242425] flex flex-col justify-center items-center p-6 selection:bg-[#f8b92a] selection:text-[#0b1d30]">
      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <span className="bg-[#f8b92a] text-[#0b1d30] font-mono font-bold text-sm px-3 py-1 rounded-[2px]">MLH</span>
          <span className="font-mono text-xs text-[#6b6f76]">// REPOLENS SECURE GATEWAY</span>
        </div>

        <Card className="bg-[#fafafa] border-[#f1f2f3] flex flex-col gap-6 p-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-mono font-bold text-[24px] text-[#0b1d30]">
              {isSignUp ? 'Create Workspace Account' : 'Sign In to Command Center'}
            </h1>
            <p className="font-mono text-xs text-[#6b6f76]">
              {isSignUp ? 'Authenticate to unlock local AST code intelligence.' : 'Welcome back, developer. Enter credentials.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono">
            <Input 
              label="Developer Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@company.com"
            />

            <Input 
              label="Access Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button variant="primary" className="w-full h-[48px] text-sm mt-2">
              {isSignUp ? 'Initialize Account →' : 'Authenticate →'}
            </Button>
          </form>

          <div className="flex justify-between items-center pt-4 border-t border-[#f1f2f3] font-mono text-xs">
            <span className="text-[#6b6f76]">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#0b1d30] font-bold cursor-pointer hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}