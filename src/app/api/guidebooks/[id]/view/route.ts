import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching guidebook with ID:', params.id);
    const client = await clientPromise;
    const db = client.db();

    // Find the guidebook in the properties collection
    const property = await db.collection('properties').findOne(
      { 'guidebooks.guidebookId': params.id },
      { projection: { 'guidebooks.$': 1 } }
    );

    if (!property || !property.guidebooks?.[0]) {
      console.log('Guidebook not found');
      return NextResponse.json(
        { error: 'Guidebook not found' },
        { status: 404 }
      );
    }

    const guidebook = property.guidebooks[0];
    return NextResponse.json(guidebook);
  } catch (error) {
    console.error('Error fetching guidebook:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guidebook' },
      { status: 500 }
    );
  }
} 