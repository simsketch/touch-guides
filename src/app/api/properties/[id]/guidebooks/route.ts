import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Find the property and verify ownership
    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(params.id), userId });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    // Create the guidebook
    const guidebook = {
      ...data,
      guidebookId: new ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the guidebook to the property
    const result = await db
      .collection('properties')
      .findOneAndUpdate(
        { _id: new ObjectId(params.id), userId },
        { 
          $push: { guidebooks: guidebook },
          $set: { updatedAt: new Date() }
        },
        { returnDocument: 'after' }
      );

    if (!result) {
      return new NextResponse('Failed to create guidebook', { status: 500 });
    }

    const transformedProperty = {
      ...result,
      propertyId: result._id.toString(),
      _id: undefined
    };

    return NextResponse.json(transformedProperty);
  } catch (error) {
    console.error('Error creating guidebook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 