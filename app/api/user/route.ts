import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('🔍 User API called');
    const session = await getServerSession(authOptions);
    console.log('📋 Session:', { hasSession: !!session, userId: session?.user?.id, email: session?.user?.email });
    
    // Check what tables we're querying
    console.log('🔍 Looking for user in profiles table with ID:', session?.user?.id);
    
    if (!session || !session.user?.id) {
      console.log('❌ No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log('❌ User not found in profiles table. Creating missing user record...');
      
      // Create the missing user record using session data
      try {
        user = await prisma.user.create({
          data: {
            id: session.user.id,
            name: session.user.name || 'User',
            email: session.user.email!,
            image: session.user.image,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });
        console.log('✅ Created missing user record:', user.email);
      } catch (createError) {
        console.error('❌ Failed to create user record:', createError);
        return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
      }
    } else {
      console.log('✅ User found in profiles table:', user.email);
    }

    // Get user's garment count
    const garmentCount = await prisma.garment.count({
      where: {
        userId: session.user.id,
      },
    });

    // Get user's most common category (favorite category)
    const categoryStats = await prisma.garment.groupBy({
      by: ['category'],
      where: {
        userId: session.user.id,
      },
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
      take: 1,
    });

    const favoriteCategory = categoryStats.length > 0 ? categoryStats[0].category : 'None';

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      joinedDate: user.createdAt,
      totalItems: garmentCount,
      favoriteCategory,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, image } = body;

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}