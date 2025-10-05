import { NextRequest, NextResponse } from 'next/server';
import { checkRole, UserRole } from '@/lib/middleware/auth';
import { seedDatabase } from '@/lib/seed';

/**
 * SECURITY NOTICE: Database Seed Endpoint
 * 
 * This endpoint is ADMIN-ONLY and designed for initial setup and development.
 * 
 * IMPORTANT SECURITY DECISION: The 'force' parameter has been removed from the API endpoint.
 * - Normal seeding is idempotent (won't overwrite existing data)
 * - For re-seeding, database must be manually cleared or done programmatically
 * - This prevents accidental data loss, even by administrators
 * 
 * RATIONALE:
 * Even with admin authentication, exposing a force-wipe through an API endpoint is risky.
 * A single accidental API call or compromised admin session could wipe all production data.
 * 
 * If you need to re-seed the database:
 * 1. Use database management tools to clear collections manually
 * 2. Or call seedDatabase(true) programmatically in a controlled environment
 * 3. Never expose force re-seeding through public APIs in production
 */
export async function POST(req: NextRequest) {
  return checkRole([UserRole.ADMIN])(
    req,
    async (_req: NextRequest, _session: any) => {
      try {
        // Force parameter is intentionally not accepted from the API for security
        // Only idempotent seeding is allowed through the API endpoint
        const result = await seedDatabase(false);
        
        return NextResponse.json(result);
      } catch (error: any) {
        console.error('Seed endpoint error:', error);
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 }
        );
      }
    }
  );
}
