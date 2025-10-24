// components/DeleteAlert.tsx
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ShieldAlert } from 'lucide-react';

interface DeleteAlertProps {
  isOpen: boolean;
  contactName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAlert = ({ isOpen, contactName, onClose, onConfirm }: DeleteAlertProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Contact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Are you sure you want to delete <span className="font-bold">{contactName}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};