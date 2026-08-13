export const dynamic = 'force-dynamic';

import React from 'react';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import { getCurrentUser } from '@/lib/auth/options';

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  return (
    <div className="py-12 bg-background min-h-[calc(100vh-4rem)]">
      <OnboardingWizard />
    </div>
  );
}
