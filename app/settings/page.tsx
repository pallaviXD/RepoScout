import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/options';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, User, Bell } from 'lucide-react';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Sign in Required</h1>
        <p className="text-sm text-secondary-foreground">Please sign in to manage settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" /> Settings
        </h1>
        <p className="text-sm text-secondary-foreground mt-1">Manage your account preferences and integration options.</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-foreground">Account Information</h2>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <p><span className="text-muted-foreground">Username:</span> {user.username}</p>
            <p><span className="text-muted-foreground">Email:</span> {user.email || 'GitHub Email'}</p>
            <p><span className="text-muted-foreground">GitHub ID:</span> {user.githubId}</p>
          </div>
          <div className="pt-2">
            <Link href="/onboarding">
              <Button variant="outline" size="sm">Update Skills & Onboarding</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-foreground">GitHub API Authorization</h2>
          </div>
          <p className="text-xs text-secondary-foreground leading-relaxed">
            RepoScout operates cleanly using public GitHub endpoints without storing private user repository write access.
          </p>
        </Card>
      </div>
    </div>
  );
}
