"use client"
import React from 'react'
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input'

interface SearchBarProps {
  onProjectSubmit: (slug: string) => void;
}

function SearchBar({ onProjectSubmit }: SearchBarProps) {
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Element Changed", e.target.value);
   }
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const gitURL = form.elements.namedItem('gitURL') as HTMLInputElement;

      if (gitURL && gitURL.value) {
        try {
          const response = await fetch('/api/project', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gitURL: gitURL.value }),
          });

          if (response.ok) {
            const data = await response.json();
            onProjectSubmit(data.data.projectSlug);
          } else {
            console.error('Failed to submit project');
          }
        } catch (error) {
          console.error('Error submitting project:', error);
        }
      }
   }
  return (
    <div>
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
         Marshmello <br /> 
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Deploy your website seamlessly using Marshmello.
        </p>
      </div>
      <PlaceholdersAndVanishInput 
        placeholders={["Please enter github URL of your project.", " "]} 
        onChange={handleChange} 
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default SearchBar