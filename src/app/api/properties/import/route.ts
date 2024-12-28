import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { importFromAirbnb, convertAirbnbToProperty } from '@/lib/airbnb';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { listingUrl } = await request.json();
    if (!listingUrl) {
      return new NextResponse('Listing URL is required', { status: 400 });
    }

    // Import data from Airbnb
    const airbnbData = await importFromAirbnb(listingUrl);
    const propertyData = convertAirbnbToProperty(airbnbData);

    // Save to database
    const client = await clientPromise;
    const db = client.db();

    const property = {
      ...propertyData,
      userId,
      importedFrom: {
        platform: 'airbnb',
        listingId: airbnbData.id,
        importedAt: new Date(),
      },
    };

    const result = await db.collection('properties').insertOne(property);
    const createdProperty = {
      ...property,
      propertyId: result.insertedId.toString(),
    };

    return NextResponse.json(createdProperty);
  } catch (error) {
    console.error('Error importing property from Airbnb:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 