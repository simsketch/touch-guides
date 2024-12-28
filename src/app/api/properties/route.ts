import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { Property } from '@/types';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const properties = await db
      .collection('properties')
      .find({ userId })
      .toArray();

    // Transform MongoDB _id to propertyId
    const transformedProperties = properties.map(property => ({
      ...property,
      propertyId: property._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(transformedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const property = {
      name: data.name,
      userId,
      guidebooks: [],
    };

    const result = await db.collection('properties').insertOne(property);
    const createdProperty = {
      ...property,
      propertyId: result.insertedId.toString(),
    };

    return NextResponse.json(createdProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 