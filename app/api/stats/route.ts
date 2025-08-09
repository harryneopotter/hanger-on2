import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get total garment count
    const totalItems = await prisma.garment.count({
      where: { userId },
    });

    // Get total value (sum of costs)
    const totalValueResult = await prisma.garment.aggregate({
      where: { userId },
      _sum: {
        cost: true,
      },
    });
    const totalValue = totalValueResult._sum.cost || 0;

    // Get category breakdown
    const categoryBreakdown = await prisma.garment.groupBy({
      by: ['category'],
      where: { userId },
      _count: {
        id: true,
      },
    });

    // Get most worn items (assuming we track usage in the future)
    const mostWornItems = await prisma.garment.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc', // For now, order by newest since we don't have usage tracking
      },
      take: 3,
      select: {
        id: true,
        name: true,
        category: true,
        createdAt: true,
      },
    });

    const stats = {
      totalItems,
      totalValue: Number(totalValue),
      categoryBreakdown: categoryBreakdown.map((item) => ({
        category: item.category,
        count: item._count.id,
      })),
      mostWornItems: mostWornItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        // Mock usage count for now
        usageCount: Math.floor(Math.random() * 15) + 1,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
