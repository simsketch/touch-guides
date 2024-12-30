import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Guidebook } from '../../../../../types';

export async function GET(request: any) {
  try {
    // Extract ID from path segments
    const pathSegments = request.url.split('/');
    const idIndex = pathSegments.indexOf('guidebooks') + 1;
    const id = pathSegments[idIndex];
    
    console.log("Request URL:", request.url);
    console.log("Path segments:", pathSegments);
    console.log("ID index:", idIndex);
    console.log("Extracted ID:", id);

    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("MongoDB connected successfully");
    const db = client.db("touchguides");
    
    console.log("Attempting to find guidebook with ID:", id);
    let guidebookDoc;
    try {
      const property = await db.collection("properties").findOne(
        { "guidebooks": { $elemMatch: { "guidebookId": id } } }
      );
      
      if (property && property.guidebooks) {
        guidebookDoc = property.guidebooks.find((g: { guidebookId: string }) => g.guidebookId === id);
      }
      console.log("Property found:", !!property);
      console.log("Raw guidebook document:", guidebookDoc);
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    console.log("Guidebook document found:", !!guidebookDoc);
    if (!guidebookDoc) {
      console.log("Guidebook not found in database");
      return NextResponse.json(
        { error: 'Guidebook not found' },
        { status: 404 }
      );
    }

    console.log("Creating PDF document...");
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    try {
      console.log("Adding content to PDF...");
      // Add content
      doc.setFontSize(20);
      doc.text(guidebookDoc.title || 'Untitled Guidebook', 20, 20);

      if (guidebookDoc.address) {
        doc.setFontSize(12);
        doc.setTextColor(128, 128, 128); // Grey
        doc.text(guidebookDoc.address, 20, 30);
      }

      // Add sections if they exist
      let yPosition = 40;
      const spacing = 10;

      doc.setTextColor(0, 0, 0); // Black

      if (guidebookDoc.checkInCheckOut?.trim()) {
        doc.setFontSize(14);
        doc.text('Check-in/Check-out Instructions', 20, yPosition);
        yPosition += spacing;
        doc.setFontSize(12);
        doc.text(guidebookDoc.checkInCheckOut, 20, yPosition);
        yPosition += spacing * 2;
      }

      if (guidebookDoc.houseRules?.trim()) {
        doc.setFontSize(14);
        doc.text('House Rules', 20, yPosition);
        yPosition += spacing;
        doc.setFontSize(12);
        doc.text(guidebookDoc.houseRules, 20, yPosition);
        yPosition += spacing * 2;
      }

      if (guidebookDoc.contactInformation?.trim()) {
        doc.setFontSize(14);
        doc.text('Contact Information', 20, yPosition);
        yPosition += spacing;
        doc.setFontSize(12);
        doc.text(guidebookDoc.contactInformation, 20, yPosition);
      }

      console.log("Content added, generating buffer...");
      const buffer = Buffer.from(doc.output('arraybuffer'));
      console.log("PDF generation completed successfully");

      // Return the PDF buffer with appropriate headers
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${guidebookDoc.title.toLowerCase().replace(/\s+/g, '-')}-guide.pdf"`,
        },
      });
    } catch (pdfErr) {
      console.error("Error during PDF generation:", pdfErr);
      throw pdfErr;
    }
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 