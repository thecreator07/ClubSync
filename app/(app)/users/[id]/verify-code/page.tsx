'use client';

import { useState } from 'react';
import { useParams, useRouter, } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyPage() {
  const router = useRouter();
  const params=useParams()
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleVerify = async () => {
    if(!params?.id){
      return
    }
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        body: JSON.stringify({ userId: params.id, code }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => router.push('/sign-in'), 2000);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Verify Your Account</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Enter Verification Code</label>
          <Input
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
        </div>

        <Button
          className="w-full mt-4"
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

        {status !== 'idle' && (
          <p
            className={`text-center text-sm ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
