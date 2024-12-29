import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// Helper function to extract ID from URL
function extractIdFromUrl(url: string): string | null {
  const match = url.match(/\/guidebooks\/([^\/]+)/);
  return match ? match[1] : null;
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = extractIdFromUrl(request.url);
    if (!id) {
      return new NextResponse('Invalid guidebook ID', { status: 400 });
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
      return new NextResponse('Guidebook not found', { status: 404 });
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
            'guidebooks.$.coverImage': data.coverImage,
            'guidebooks.$.updatedAt': new Date(),
          },
        },
        { returnDocument: 'after' }
      );

    if (!result) {
      return new NextResponse('Failed to update guidebook', { status: 500 });
    }

    // Find the updated guidebook in the property
    const updatedGuidebook = result.guidebooks.find(
      (g: any) => g.guidebookId === id
    );

    return NextResponse.json(updatedGuidebook);
  } catch (error) {
    console.error('Error updating guidebook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = extractIdFromUrl(request.url);
    if (!id) {
      return new NextResponse('Invalid guidebook ID', { status: 400 });
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
      return new NextResponse('Guidebook not found', { status: 404 });
    }

    // Find the guidebook in the property
    const guidebook = property.guidebooks.find(
      (g: any) => g.guidebookId === id
    );

    return NextResponse.json(guidebook);
  } catch (error) {
    console.error('Error fetching guidebook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = extractIdFromUrl(request.url);
    if (!id) {
      return new NextResponse('Invalid guidebook ID', { status: 400 });
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
      return new NextResponse('Guidebook not found', { status: 404 });
    }

    // Remove the guidebook from the property
    const result = await db
      .collection('properties')
      .updateOne(
        { userId, 'guidebooks.guidebookId': id },
        { $pull: { guidebooks: { guidebookId: id } } } as any
      );

    if (result.modifiedCount === 0) {
      return new NextResponse('Failed to delete guidebook', { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting guidebook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 