// components/ContactModal.tsx
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, Edit, Trash2 } from 'lucide-react';
import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ContactForm } from './ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  mode: 'view' | 'add' | 'edit';
  contact: Contact | null;
  onClose: () => void;
  onSwitchToEdit: () => void;
  onSwitchToDelete: () => void;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export const ContactModal = ({
  isOpen,
  mode,
  contact,
  onClose,
  onSwitchToEdit,
  onSwitchToDelete,
  onSave,
  isLoading = false,
}: ContactModalProps) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {(mode === 'add' || mode === 'edit') ? (
              // --- FORM MODE (ADD/EDIT) ---
              <ContactForm
                contact={contact}
                onSave={onSave}
                onCancel={onClose}
                isLoading={isLoading}
              />
            ) : (
              // --- DETAILS VIEW MODE ---
              <>
                {/* Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500 p-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Avatar */}
                <div className="relative px-6 -mt-16">
                  <motion.img
                    src={contact?.avatarUrl}
                    alt={contact?.name}
                    className="w-32 h-32 rounded-full ring-4 ring-gray-800 shadow-xl"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {contact?.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Last updated {formatDistanceToNow(new Date(contact!.updatedAt), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <p className="text-sm font-medium text-white break-all">
                          {contact?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Phone</p>
                        <p className="text-sm font-medium text-white">
                          {contact?.phone.countryCode} {contact?.phone.number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <Button
                      onClick={onSwitchToEdit}
                      className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Contact
                    </Button>
                    
                    <Button
                      onClick={onSwitchToDelete}
                      variant="outline"
                      className="flex-1 gap-2 text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
