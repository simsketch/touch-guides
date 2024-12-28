export interface Guidebook {
  id: string;
  guidebookId: string;
  propertyId: string;
  title: string;
  address: string;
  coverImage?: string;
  contactEmail: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  propertyId: string;
  name: string;
  guidebooks: Array<Guidebook>;
} 