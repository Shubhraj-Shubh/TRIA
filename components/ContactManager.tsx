"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Moon, Sun } from 'lucide-react';
import { Contact } from '@/types/contact';
import { ContactCard } from '@/components/ContactCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterControls } from '@/components/FilterControls';
import { PaginationControls } from '@/components/PaginationControls';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';

// --- Naye Imports ---
import { ContactModal } from '@/components/ContactModal';
import { DeleteAlert } from './DeleteAlert';
import { ContactFormData } from '@/lib/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

// --- API Fetching Function ---
const fetchContacts = async (page: number, sort: string, search: string, country: string) => {
  const { data } = await axios.get('/api/contacts', {
    params: {
      page,
      sort,
      search,
      country,
      limit: 6
    }
  });
  return data;
};

const ContactManager = () => { 
  // --- State for filters ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc'); // Default sort
  const [countryFilter, setCountryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(searchQuery, 300); // Debounce

  // --- Modal State ---
  const [modalState, setModalState] = useState<'closed' | 'view' | 'add' | 'edit' | 'delete'>('closed');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // --- React Query Client ---
  const queryClient = useQueryClient();

  // --- 1. USEQUERY (Fetch Data) ---
  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts', currentPage, sortBy, debouncedSearch, countryFilter],
    queryFn: () => fetchContacts(currentPage, sortBy, debouncedSearch, countryFilter),
    placeholderData: (previousData) => previousData, // Keep old data while loading new
  });

  // --- 2. USEMUTATION (Create Contact) ---
  const createContactMutation = useMutation({
    mutationFn: async (newContact: ContactFormData) => {
      const { data } = await axios.post('/api/contacts', newContact);
      return data;
    },
    onMutate: () => {
      toast.loading("Creating contact...", { id: 'create-contact' });
    },
    onSuccess: (data) => {
      toast.success(`${data.name} has been added to your contacts!`, { id: 'create-contact' });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      handleCloseModal();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to create contact";
      toast.error(errorMessage, { id: 'create-contact' });
    }
  });

  // --- 3. USEMUTATION (Update Contact) ---
  const updateContactMutation = useMutation({
    mutationFn: async (updatedContact: ContactFormData) => {
      if (!selectedContact?._id) throw new Error("No contact selected");
      const { data } = await axios.put(`/api/contacts/${selectedContact._id}`, updatedContact);
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    },
    onMutate: () => {
      toast.loading("Updating contact...", { id: 'update-contact' });
    },
    onSuccess: (data) => {
      toast.success(`${data.name}'s information has been updated!`, { id: 'update-contact' });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      handleCloseModal();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Failed to update contact";
      toast.error(errorMessage, { id: 'update-contact' });
    }
  });

  // --- 4. USEMUTATION (Delete Contact) ---
  const deleteContactMutation = useMutation({
    mutationFn: async () => {
      if (!selectedContact) throw new Error("No contact selected");
      await axios.delete(`/api/contacts/${selectedContact._id}`);
    },
    onMutate: () => {
      toast.loading("Deleting contact...", { id: 'delete-contact' });
    },
    onSuccess: () => {
      toast.success(`${selectedContact?.name} has been removed from your contacts`, { id: 'delete-contact' });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      handleCloseModal();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete contact";
      toast.error(errorMessage, { id: 'delete-contact' });
    }
  });


  // --- Updated Modal Handlers ---
  const handleCloseModal = () => {
    setModalState('closed');
    setSelectedContact(null);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalState('view');
  };

  const handleSaveContact = (formData: ContactFormData) => {
    if (modalState === 'add') {
      createContactMutation.mutate(formData);
    } else if (modalState === 'edit') {
      updateContactMutation.mutate(formData);
    }
  };

  const handleDeleteContact = () => {
    deleteContactMutation.mutate();
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery('');
    setSortBy('createdAt_desc');
    setCountryFilter('all');
    setCurrentPage(1);
  };
  
  // Data for rendering
  const contacts = data?.contacts || [];
  const totalPages = data?.totalPages || 1;
  const contactCount = data?.totalContacts || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40">
       <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Contact Manager
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {/* Show loading or count */}
                  {isLoading ? 'Loading...' : `${contactCount} contacts`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setModalState('add')}
                className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Contact</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterControls
              sortBy={sortBy}
              onSortChange={setSortBy}
              countryFilter={countryFilter}
              onCountryFilterChange={setCountryFilter}
              onReset={handleReset}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* --- Loading State --- */}
          {isLoading && (
            <motion.div
              key="loading"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-3 pt-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* --- Error State --- */}
          {isError && !isLoading && (
             <motion.div key="error" className="text-center py-16">
               <h3 className="text-xl font-semibold text-red-500 mb-2">
                 Failed to load contacts
               </h3>
               <p className="text-gray-500 dark:text-gray-400">Please try refreshing the page.</p>
             </motion.div>
          )}

          {/* --- Empty State --- */}
          {!isLoading && !isError && contacts.length === 0 && (
             <motion.div key="empty" className="text-center py-16">
               <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                 <Users className="w-12 h-12 text-gray-400" />
               </div>
               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                 No contacts found
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mb-6">
                 Try adjusting your search or add a new contact.
               </p>
             </motion.div>
          )}

          {/* --- Data State --- */}
          {!isLoading && !isError && contacts.length > 0 && (
            <motion.div
              key="data"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {contacts.map((contact: Contact) => (
                <ContactCard
                  key={contact._id}
                  contact={contact}
                  onView={handleViewContact}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

         {totalPages > 1 && !isLoading && (
           <motion.div>
             <PaginationControls
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
             />
           </motion.div>
         )}
      </main>

      {/* --- Modals --- */}
      <ContactModal
        isOpen={modalState === 'view' || modalState === 'add' || modalState === 'edit'}
        mode={modalState === 'view' ? 'view' : (modalState === 'add' ? 'add' : 'edit')}
        contact={selectedContact}
        onClose={handleCloseModal}
        onSwitchToEdit={() => setModalState('edit')}
        onSwitchToDelete={() => setModalState('delete')}
        onSave={handleSaveContact}
        isLoading={createContactMutation.isPending || updateContactMutation.isPending}
      />
      
      <DeleteAlert
        isOpen={modalState === 'delete'}
        contactName={selectedContact?.name || ''}
        onClose={handleCloseModal}
        onConfirm={handleDeleteContact}
        isDeleting={deleteContactMutation.isPending}
      />
    </div>
  );
};

export default ContactManager;
