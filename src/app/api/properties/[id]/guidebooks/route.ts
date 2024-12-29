import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ObjectId, Document } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { extractIdFromUrl } from '@/lib/url-helpers';

interface GuidebookDocument extends Document {
  guidebookId: string;
  title: string;
  address: string;
  contactEmail: string;
  coverImage: string;
  checkInCheckOut: string;
  directionsToProperty: string;
  contactInformation: string;
  quirksOfTheHome: string;
  wifiAndElectronics: string;
  houseRules: string;
  placesToEat: string;
  thingsToDo: string;
  transportation: string;
  groceryStores: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = extractIdFromUrl(request.url);
    if (!id) {
      return new NextResponse('Invalid property ID', { status: 400 });
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Find the property and verify ownership
    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(id), userId });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    // Create the guidebook with all fields
    const guidebook: GuidebookDocument = {
      guidebookId: new ObjectId().toString(),
      title: data.title || '',
      address: data.address || '',
      contactEmail: data.contactEmail || '',
      coverImage: data.coverImage || '',
      checkInCheckOut: data.checkInCheckOut || '',
      directionsToProperty: data.directionsToProperty || '',
      contactInformation: data.contactInformation || '',
      quirksOfTheHome: data.quirksOfTheHome || '',
      wifiAndElectronics: data.wifiAndElectronics || '',
      houseRules: data.houseRules || '',
      placesToEat: data.placesToEat || '',
      thingsToDo: data.thingsToDo || '',
      transportation: data.transportation || '',
      groceryStores: data.groceryStores || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the guidebook to the property
    const result = await db
      .collection('properties')
      .findOneAndUpdate(
        { _id: new ObjectId(id), userId },
        { $push: { guidebooks: guidebook } } as any,
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