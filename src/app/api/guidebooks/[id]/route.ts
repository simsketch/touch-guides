import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function PUT(
  request: NextRequest,
) {
  try {
    const { userId } = auth();
    const id = request.url.match(/\/guidebooks\/([^\/]+)/)?.[1];
    console.log('Fetching guidebook with ID:', id);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Find the property containing the guidebook and verify ownership
    const property = await db
      .collection('properties')
      .findOne({
        userId,
        'guidebooks.guidebookId': id,
      });

    if (!property) {
      return NextResponse.json({ error: 'Guidebook not found' }, { status: 404 });
    }

    // Update the guidebook within the property
    const result = await db
      .collection('properties')
      .findOneAndUpdate(
        {
          userId,
          'guidebooks.guidebookId': id,
        },
        {
          $set: {
            'guidebooks.$.title': data.title,
            'guidebooks.$.address': data.address,
            'guidebooks.$.houseRules': data.houseRules,
            'guidebooks.$.contactInformation': data.contactInformation,
            'guidebooks.$.checkInCheckOut': data.checkInCheckOut,
            'guidebooks.$.placesToEat': data.placesToEat,
            'guidebooks.$.thingsToDo': data.thingsToDo,
            'guidebooks.$.directionsToProperty': data.directionsToProperty,
            'guidebooks.$.quirksOfTheHome': data.quirksOfTheHome,
            'guidebooks.$.transportation': data.transportation,
            'guidebooks.$.groceryStores': data.groceryStores,
            'guidebooks.$.wifiAndElectronics': data.wifiAndElectronics,
            'guidebooks.$.updatedAt': new Date(),
          },
        },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json({ error: 'Failed to update guidebook' }, { status: 500 });
    }

    // Find the updated guidebook in the property
    const updatedGuidebook = result.guidebooks.find(
      (g: any) => g.guidebookId === id
    );

    return NextResponse.json(updatedGuidebook);
  } catch (error) {
    console.error('Error updating guidebook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest
) {
  try {
    const id = request.url.match(/\/guidebooks\/([^\/]+)/)?.[1];
    console.log('Fetching guidebook with ID:', id);
    const client = await clientPromise;
    const db = client.db();

    // Find the property containing the guidebook
    const property = await db
      .collection('properties')
      .findOne({
        'guidebooks.guidebookId': id,
      });

    if (!property) {
      return NextResponse.json({ error: 'Guidebook not found' }, { status: 404 });
    }

    // Find the guidebook in the property
    const guidebook = property.guidebooks.find(
      (g: any) => g.guidebookId === id
    );

    return NextResponse.json(guidebook);
  } catch (error) {
    console.error('Error fetching guidebook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const id = request.url.match(/\/guidebooks\/([^\/]+)/)?.[1];
    console.log('Fetching guidebook with ID:', id);
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the property containing the guidebook and verify ownership
    const property = await db
      .collection('properties')
      .findOne({
        userId,
        'guidebooks.guidebookId': id,
      });

    if (!property) {
      return NextResponse.json({ error: 'Guidebook not found' }, { status: 404 });
    }

    // Remove the guidebook from the property
    const result = await db
      .collection('properties')
      .updateOne(
        { userId, 'guidebooks.guidebookId': id },
        { $pull: { guidebooks: { guidebookId: id } } } as any
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete guidebook' }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting guidebook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 