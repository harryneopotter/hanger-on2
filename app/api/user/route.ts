import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
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

/**
 * Update the authenticated user's name and/or image and return the updated profile.
 *
 * @param request - Request whose JSON body may include `name` and/or `image` to update on the authenticated user's account.
 * @returns The updated user object (`id`, `name`, `email`, `image`, `createdAt`) as a JSON response; returns a 401 response if the requester is unauthenticated, or a 500 response on server error.
 */
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

/**
 * Delete the authenticated user's account and all associated data.
 *
 * Removes the user record for the current session; related records (accounts, sessions, garments and their images, tags, collections) are removed by database cascade.
 *
 * @returns A JSON response with `{ message: 'Account deleted successfully', deleted: true }` on success (HTTP 200), `{ error: 'Unauthorized' }` when the request is not authenticated (HTTP 401), or `{ error: 'Failed to delete account' }` on server error (HTTP 500).
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete user - Prisma will cascade delete all related data:
    // - accounts, sessions (NextAuth data)
    // - garments (and their images, tags, collections via cascade)
    // - tags
    // - collections
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    console.log(`✅ User ${userId} and all associated data deleted successfully`);

    return NextResponse.json({
      message: 'Account deleted successfully',
      deleted: true
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}