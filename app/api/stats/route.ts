import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Retrieve garment statistics for the authenticated user.
 *
 * Returns an object with overall counts and aggregates scoped to the current user.
 *
 * @returns An object containing:
 * - `totalItems`: the total number of garments for the user
 * - `totalValue`: numeric sum of all garment `cost` values (0 if none)
 * - `categoryBreakdown`: an array of `{ category, count }` objects with per-category item counts
 * - `mostWornItems`: an array (max 3) of `{ id, name, category, usageCount }` for the user's most used garments
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get total garment count
    const totalItems = await prisma.garment.count({
      where: { userId }
    });

    // Get total value (sum of costs)
    const totalValueResult = await prisma.garment.aggregate({
      where: { userId },
      _sum: {
        cost: true
      }
    });
    const totalValue = totalValueResult._sum.cost || 0;

    // Get category breakdown
    const categoryBreakdown = await prisma.garment.groupBy({
      by: ['category'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // Get most worn items based on usage count
    const mostWornItems = await prisma.garment.findMany({
      where: { userId },
      orderBy: {
        usageCount: 'desc' // Order by actual usage count
      },
      take: 3,
      select: {
        id: true,
        name: true,
        category: true,
        usageCount: true
      }
    });

    const stats = {
      totalItems,
      totalValue: Number(totalValue),
      categoryBreakdown: categoryBreakdown.map(item => ({
        category: item.category,
        count: item._count.id
      })),
      mostWornItems: mostWornItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        usageCount: item.usageCount
      })),

    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}