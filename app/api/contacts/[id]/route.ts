import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import type { MongoError } from 'mongodb';

// --- UPDATE CONTACT ---
// Correct way to get params in App Router:
export async function PUT(
  request: Request, 
  { params }: { params: { id: string } } // This structure is correct
) {
  await dbConnect();

  try {
    // Get ID from params
    const id = params.id;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone } = body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedContact);

  } catch (error) {
    console.error('Update error:', error);
    if ((error as MongoError).code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// --- DELETE CONTACT ---
// Correct way to get params in App Router:
export async function DELETE(
  request: Request, // Request argument is needed even if unused
  { params }: { params: { id: string } } // This structure is correct
) {
  await dbConnect();

  try {
    const id = params.id;

     // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid Contact ID format' }, { status: 400 });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted' }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({ message: 'Error deleting contact', error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
}

// --- ADD GET for single contact (Optional but good practice) ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const id = params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid Contact ID format' }, { status: 400 });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json(contact, { status: 200 });

    } catch (error: unknown) {
        console.error("Error in GET [id]:", error);
        return NextResponse.json({ message: 'Error fetching contact', error: (error as Error).message || 'Unknown error' }, { status: 500 });
    }
}
