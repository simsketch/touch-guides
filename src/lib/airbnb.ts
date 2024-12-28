const AIRBNB_API_BASE = 'https://api.airbnb.com/v2';

interface AirbnbProperty {
  id: string;
  name: string;
  description: string;
  house_rules: string;
  check_in_time: string;
  check_out_time: string;
  amenities: Array<{ name: string; description: string }>;
  location: {
    address: string;
    directions: string;
  };
}

export async function importFromAirbnb(listingUrl: string): Promise<AirbnbProperty> {
  try {
    // Extract listing ID from URL
    const listingId = listingUrl.match(/\/rooms\/(\d+)/)?.[1];
    if (!listingId) {
      throw new Error('Invalid Airbnb listing URL');
    }

    const response = await fetch(
      `${AIRBNB_API_BASE}/listings/${listingId}`,
      {
        headers: {
          'X-Airbnb-API-Key': process.env.AIRBNB_API_KEY || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Airbnb listing');
    }

    const data = await response.json();
    return {
      id: data.listing.id,
      name: data.listing.name,
      description: data.listing.description,
      house_rules: data.listing.house_rules,
      check_in_time: data.listing.check_in_time,
      check_out_time: data.listing.check_out_time,
      amenities: data.listing.amenities,
      location: {
        address: data.listing.address,
        directions: data.listing.directions,
      },
    };
  } catch (error) {
    console.error('Error importing from Airbnb:', error);
    throw error;
  }
}

export function convertAirbnbToProperty(airbnbData: AirbnbProperty) {
  return {
    name: airbnbData.name,
    guidebooks: [
      {
        title: `${airbnbData.name} Guide`,
        houseRules: airbnbData.house_rules,
        checkInCheckOut: `Check-in: ${airbnbData.check_in_time}\nCheck-out: ${airbnbData.check_out_time}`,
        directionsToProperty: airbnbData.location.directions,
        wifiAndElectronics: airbnbData.amenities
          .filter(a => a.name.toLowerCase().includes('wifi') || a.name.toLowerCase().includes('electronic'))
          .map(a => `${a.name}: ${a.description}`)
          .join('\n'),
      },
    ],
  };
} 