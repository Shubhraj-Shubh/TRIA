
"use client";

import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { Contact } from '@/types/contact';
import { Card, CardContent } from '@/components/ui/card';

interface ContactCardProps {
  contact: Contact;
  onView: (contact: Contact) => void;
}

export const ContactCard = ({ contact, onView }: ContactCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
<Card
  className="group hover:shadow-lg transition-all duration-300 cursor-pointer contact-card"
  onClick={() => onView(contact)}
>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="w-16 h-16 rounded-full ring-2 ring-primary/20"
              />
            </motion.div>

            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
                {contact.name}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{contact.phone.countryCode} {contact.phone.number}</span>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};