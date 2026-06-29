'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function login(e) {
    e.preventDefault();
    if (password === 'marketing2026') {
      localStorage.setItem('mla_logged', 'true');
      router.push('/dashboard');
    } else {
      setError('Password non corretta');
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm text-blue-300 mb-2">AppStream / Personal CRM</p>
          <h1 className="text-3xl font-bold text-white">Marketing Lead Assistant</h1>
          <p className="text-gray-400 mt-3">Accedi alla tua dashboard lead.</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-blue-400"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="w-full rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-400">
            Entra
          </button>
        </form>
      </div>
    </main>
  );
}
