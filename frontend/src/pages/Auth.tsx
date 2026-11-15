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
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const displayEmail = email.trim();
    if (!displayEmail) return;

    login(displayEmail);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#242425] flex flex-col justify-center items-center p-6 selection:bg-[#f8b92a] selection:text-[#0b1d30]">
      <div className="max-w-md w-full flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="bg-[#f8b92a] text-[#0b1d30] font-mono font-bold text-sm px-3 py-1 rounded-[2px]">
            MLH
          </span>
          <span className="font-mono text-xs text-[#6b6f76]">// REPOLENS DEMO ACCESS</span>
        </div>

        <Card className="bg-[#fafafa] border-[#f1f2f3] flex flex-col gap-6 p-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-mono font-bold text-[24px] text-[#0b1d30]">
              Open Demo Workspace
            </h1>
            <p className="font-mono text-xs text-[#6b6f76] leading-relaxed">
              Enter a display email to label this browser session. No account is created.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono">
            <Input
              label="Display Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="developer@example.com"
              required
            />
            <Button
              variant="primary"
              className="w-full h-[48px] text-sm mt-2"
              disabled={!email.trim()}
            >
              Continue to Demo →
            </Button>
          </form>

          <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-[2px] leading-relaxed">
            Demo-only navigation gate: this is not authentication and does not protect
            backend API endpoints. Do not expose the backend to untrusted networks.
          </p>
        </Card>
      </div>
    </div>
  );
}
