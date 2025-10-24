import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { generateAvatarUrl } from '@/lib/utils';

// --- CREATE (POST) Function (Aapke paas pehle se hai) ---
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const existingContact = await Contact.findOne({ email: email.toLowerCase() });
    if (existingContact) {
      return NextResponse.json({ error: 'A contact with this email already exists' }, { status: 409 });
    }

    const avatarUrl = generateAvatarUrl(name);
    const newContact = new Contact({ name, email, phone, avatarUrl });
    await newContact.save();
    return NextResponse.json(newContact, { status: 201 });
  } catch (error: any) {
    console.error('Create contact error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A contact with this email already exists' }, { status: 409 });
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e: any) => e.message).join(', ');
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}

// --- GET Function (Search, Sort, Filter, Paginate) ---
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const sort = searchParams.get('sort') || 'createdAt_desc';
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || 'all';

    const skip = (page - 1) * limit;

    // 1. Filter query
    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'phone.number': { $regex: search, $options: 'i' } },
      ];
    }
    if (country !== 'all') {
      query['phone.countryCode'] = country;
    }

    // 2. Sort options
    const [sortField, sortOrder] = sort.split('_');
    const sortOptions: any = {};
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

    // 3. Fetch data
    const contacts = await Contact.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
      
    const totalContacts = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalContacts / limit);

    return NextResponse.json({
      contacts,
      totalPages,
      currentPage: page,
      totalContacts,
    }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching contacts', error: error.message }, { status: 500 });
  }
}
