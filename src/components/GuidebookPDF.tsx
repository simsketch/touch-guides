import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Guidebook } from '@/types';
import React from 'react';

// Register a font (you'll need to add the font file to your project)
Font.register({
  family: 'Inter',
  src: '/fonts/Inter-Regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  image: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contact: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});

interface GuidebookPDFProps {
  guidebook: Guidebook;
}

const GuidebookDocument: React.FC<GuidebookPDFProps> = ({ guidebook }) => {
  const content = (
    <Document>
      {/* Home Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image src={guidebook.coverImage || "/beach.jpg"} style={styles.image} />
          <Text style={styles.title}>{guidebook.title}</Text>
          <Text style={styles.text}>{guidebook.address}</Text>
          {guidebook.contactEmail && (
            <Text style={styles.contact}>Contact: {guidebook.contactEmail}</Text>
          )}
        </View>
      </Page>

      {/* Info Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Property Information</Text>
          
          {guidebook.checkInCheckOut && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Check-in/Check-out Instructions</Text>
              <Text style={styles.text}>{guidebook.checkInCheckOut}</Text>
            </View>
          )}

          {guidebook.houseRules && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>House Rules</Text>
              <Text style={styles.text}>{guidebook.houseRules}</Text>
            </View>
          )}

          {guidebook.quirksOfTheHome && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Quirks of the Home</Text>
              <Text style={styles.text}>{guidebook.quirksOfTheHome}</Text>
            </View>
          )}

          {guidebook.wifiAndElectronics && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>WiFi & Electronics</Text>
              <Text style={styles.text}>{guidebook.wifiAndElectronics}</Text>
            </View>
          )}
        </View>
      </Page>

      {/* Local Information Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Local Information</Text>

          {guidebook.placesToEat && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Places to Eat</Text>
              <Text style={styles.text}>{guidebook.placesToEat}</Text>
            </View>
          )}

          {guidebook.thingsToDo && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Things to Do</Text>
              <Text style={styles.text}>{guidebook.thingsToDo}</Text>
            </View>
          )}

          {guidebook.transportation && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Transportation</Text>
              <Text style={styles.text}>{guidebook.transportation}</Text>
            </View>
          )}

          {guidebook.groceryStores && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Grocery Stores</Text>
              <Text style={styles.text}>{guidebook.groceryStores}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  return content;
};

export default GuidebookDocument; 