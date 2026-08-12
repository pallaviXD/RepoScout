import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const onboardingSchema = z.object({
  skills: z.array(z.string()),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  interests: z.array(z.string()),
  contributionTypes: z.array(z.string()),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = onboardingSchema.parse(body);

    // Update user experience level
    await prisma.user.update({
      where: { id: user.id },
      data: { experienceLevel: parsed.experienceLevel },
    });

    // Replace skills
    await prisma.userSkill.deleteMany({ where: { userId: user.id } });
    if (parsed.skills.length > 0) {
      await prisma.userSkill.createMany({
        data: parsed.skills.map((skillName) => ({
          userId: user.id,
          skillName,
          level: 'INTERMEDIATE',
        })),
      });
    }

    // Replace interests
    await prisma.userInterest.deleteMany({ where: { userId: user.id } });
    if (parsed.interests.length > 0) {
      await prisma.userInterest.createMany({
        data: parsed.interests.map((interestName) => ({
          userId: user.id,
          interestName,
        })),
      });
    }

    // Replace contribution preferences
    await prisma.userContributionPreference.deleteMany({ where: { userId: user.id } });
    if (parsed.contributionTypes.length > 0) {
      await prisma.userContributionPreference.createMany({
        data: parsed.contributionTypes.map((type) => ({
          userId: user.id,
          type,
        })),
      });
    }

    return NextResponse.json({ success: true, message: 'Preferences saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Invalid onboarding payload' }, { status: 400 });
  }
}
