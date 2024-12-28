import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the property and verify ownership
    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(params.id), userId });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    // Transform the property for the response
    const transformedProperty = {
      ...property,
      propertyId: property._id.toString(),
      _id: undefined
    };

    return NextResponse.json(transformedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
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

    // Remove propertyId from update data if it exists
    const { propertyId, _id, ...updateData } = data;

    const result = await db
      .collection('properties')
      .findOneAndUpdate(
        { _id: new ObjectId(params.id), userId },
        { $set: { ...updateData, userId } },
        { returnDocument: 'after' }
      );

    if (!result) {
      return new NextResponse('Property not found', { status: 404 });
    }

    const transformedProperty = {
      ...result,
      propertyId: result._id.toString(),
      _id: undefined
    };

    return NextResponse.json(transformedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('properties')
      .deleteOne({ _id: new ObjectId(params.id), userId });

    if (result.deletedCount === 0) {
      return new NextResponse('Property not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 