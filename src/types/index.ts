export interface Guidebook {
  id: string;
  title: string;
  address: string;
  propertyId: string;
  placesToEat: string;
  thingsToDo: string;
  houseRules: string;
  quirksOfTheHome: string;
  transportation: string;
  groceryStores: string;
  wifiAndElectronics: string;
}

export interface Property {
  id: string;
  name: string;
  userId: string;
  guidebooks: Guidebook[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  properties: Property[];
}

export interface AppData {
  users: User[];
} 