import { NextResponse } from 'next/server';
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import clientPromise from '@/lib/mongodb';
import { extractIdFromUrl } from '@/lib/url-helpers';
import React from 'react';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  infoSection: {
    marginBottom: 15,
    padding: 10,
  },
  infoTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  contact: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
  },
});

export async function GET(request: Request) {
  try {
    const id = extractIdFromUrl(request.url);
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid guidebook ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the guidebook in the properties collection
    const property = await db.collection('properties').findOne(
      { 'guidebooks.guidebookId': id },
      { projection: { 'guidebooks.$': 1 } }
    );

    if (!property || !property.guidebooks?.[0]) {
      return NextResponse.json(
        { error: 'Guidebook not found' },
        { status: 404 }
      );
    }

    const guidebook = property.guidebooks[0];

    try {
      // Create title section
      const titleSection = React.createElement(View, { key: 'title-section', style: styles.section }, [
        React.createElement(Text, { key: 'title', style: styles.title }, guidebook.title),
        React.createElement(Text, { key: 'address', style: styles.text }, guidebook.address),
        guidebook.contactEmail && React.createElement(Text, { key: 'contact', style: styles.contact }, `Contact: ${guidebook.contactEmail}`)
      ].filter(Boolean));

      // Create property info section
      const propertyInfoSection = React.createElement(View, { key: 'property-info', style: styles.section }, [
        React.createElement(Text, { key: 'info-title', style: styles.title }, 'Property Information'),
        guidebook.checkInCheckOut && React.createElement(View, { key: 'checkin', style: styles.infoSection }, [
          React.createElement(Text, { key: 'checkin-title', style: styles.infoTitle }, 'Check-in/Check-out Instructions'),
          React.createElement(Text, { key: 'checkin-text', style: styles.text }, guidebook.checkInCheckOut)
        ]),
        guidebook.houseRules && React.createElement(View, { key: 'rules', style: styles.infoSection }, [
          React.createElement(Text, { key: 'rules-title', style: styles.infoTitle }, 'House Rules'),
          React.createElement(Text, { key: 'rules-text', style: styles.text }, guidebook.houseRules)
        ])
      ].filter(Boolean));

      // Create local info section
      const localInfoSection = React.createElement(View, { key: 'local-info', style: styles.section }, [
        React.createElement(Text, { key: 'local-title', style: styles.title }, 'Local Information'),
        guidebook.placesToEat && React.createElement(View, { key: 'places-to-eat', style: styles.infoSection }, [
          React.createElement(Text, { key: 'eat-title', style: styles.infoTitle }, 'Places to Eat'),
          React.createElement(Text, { key: 'eat-text', style: styles.text }, guidebook.placesToEat)
        ]),
        guidebook.thingsToDo && React.createElement(View, { key: 'things-to-do', style: styles.infoSection }, [
          React.createElement(Text, { key: 'todo-title', style: styles.infoTitle }, 'Things to Do'),
          React.createElement(Text, { key: 'todo-text', style: styles.text }, guidebook.thingsToDo)
        ])
      ].filter(Boolean));

      // Create pages
      const page1 = React.createElement(Page, { key: 'page-1', size: 'A4', style: styles.page }, [titleSection, propertyInfoSection]);
      const page2 = React.createElement(Page, { key: 'page-2', size: 'A4', style: styles.page }, localInfoSection);

      // Create document
      const doc = React.createElement(Document, {}, [page1, page2]);

      // Generate PDF
      const pdfBuffer = await renderToBuffer(doc);

      // Return PDF as a downloadable file
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${guidebook.title.replace(/\s+/g, '-').toLowerCase()}-guide.pdf"`,
        },
      });
    } catch (pdfError: any) {
      console.error('PDF generation error:', pdfError);
      return NextResponse.json(
        { error: 'Failed to generate PDF', details: pdfError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling PDF request:', error);
    return NextResponse.json(
      { error: 'Failed to handle PDF request' },
      { status: 500 }
    );
  }
} 