"use client";

import { useForm } from "react-hook-form";
import { Contact } from "@/types/contact";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod"; // Import resolver
import { contactSchema, ContactFormData } from "@/lib/schema"; // Import schema

interface ContactFormProps {
  contact?: Contact | null;
  onSave: (data: ContactFormData) => void; // Type ko update kiya
  onCancel: () => void;
  isLoading?: boolean;
}

export const ContactForm = ({ contact, onSave, onCancel, isLoading = false }: ContactFormProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema), // Zod ko connect kiya
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone: {
        countryCode: contact?.phone.countryCode || "+91",
        number: contact?.phone.number || "",
      }
    },
  });

  // 'onSave' ab 'handleSubmit' se wrap ho gaya hai
  return (
    <form onSubmit={handleSubmit(onSave)} className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {contact ? "Edit Contact" : "Add New Contact"}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <Input 
            {...register("name")} // Zod validation ab automatically kaam karega
            className="bg-white dark:bg-gray-700" 
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <Input 
            {...register("email")} // Zod validation
            className="bg-white dark:bg-gray-700" 
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <div className="flex gap-2">
            <Input
              {...register("phone.countryCode")} // Nested object
              placeholder="+91"
              className="w-20 bg-white dark:bg-gray-700"
            />
            <Input
              {...register("phone.number")} // Nested object
              placeholder="9876543210"
              className="flex-1 bg-white dark:bg-gray-700"
            />
          </div>
          {errors.phone?.countryCode && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.countryCode.message}</p>
          )}
          {errors.phone?.number && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.number.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel} 
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⌛</span>
              {contact ? "Saving..." : "Creating..."}
            </span>
          ) : (
            contact ? "Save Changes" : "Create Contact"
          )}
        </Button>
      </div>
    </form>
  );
};
