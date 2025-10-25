"use client";

import { useForm } from "react-hook-form";
import { Contact } from "@/types/contact";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/schema";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  contact?: Contact | null;
  onSave: (data: ContactFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ContactForm = ({ contact, onSave, onCancel, isLoading = false }: ContactFormProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone: {
        countryCode: contact?.phone.countryCode || "+91",
        number: contact?.phone.number || "",
      }
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {contact ? "Edit Contact" : "Add New Contact"}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <Input 
            {...register("name")}
    className="bg-gray-700"
            disabled={isLoading}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <Input 
            {...register("email")}
          className="bg-gray-700"
            disabled={isLoading}
            placeholder="john.doe@example.com"
            type="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <div className="flex gap-2">
            <Input
              {...register("phone.countryCode")}
              placeholder="+91"
              className="w-24 bg-gray-700"
              disabled={isLoading}
              maxLength={5}
            />
            <Input
              {...register("phone.number")}
              placeholder="9876543210"
              className="flex-1 bg-gray-700"
              disabled={isLoading}
              maxLength={10}
              type="tel"
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
      
      <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
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
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {contact ? "Saving..." : "Creating..."}
            </>
          ) : (
            contact ? "Save Changes" : "Create Contact"
          )}
        </Button>
      </div>
    </form>
  );
};
