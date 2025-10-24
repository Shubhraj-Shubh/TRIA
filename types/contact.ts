export interface Contact {
  _id: string; // <-- CHANGE: Use _id from MongoDB
  id?: string; // Optional 'id' if needed elsewhere, but _id is primary
  name: string;
  email: string;
  phone: {
    countryCode: string;
    number: string;
  };
  avatarUrl: string;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
}
