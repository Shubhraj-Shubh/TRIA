import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import type { MongoError } from 'mongodb';

// --- UPDATE CONTACT ---
// Correct way to get params in App Router:
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Check if email is being changed and already exists
    if (email) {
      const existingContact = await Contact.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingContact) {
        return NextResponse.json(
          { error: 'A contact with this email already exists' },
          { status: 409 }
        );
      }
    }

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

  } catch (error: any) {
    console.error('Update error:', error);
    if ((error as MongoError).code === 11000) {
      return NextResponse.json(
        { error: 'A contact with this email already exists' },
        { status: 409 }
      );
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e: any) => e.message).join(', ');
      return NextResponse.json({ error: message }, { status: 400 });
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    // Await params before accessing id
    const { id } = await params;

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
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    // Await params before accessing id
    const { id } = await params;

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
