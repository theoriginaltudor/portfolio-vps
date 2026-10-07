import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

const Github = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ContactInfoCard = () => (
  <Card className='w-[90vw] md:w-auto'>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
      <CardDescription>
        Here is my info. Feel free to reach out!
      </CardDescription>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <MapPin className='h-6 w-6' />
        <span>Hedehusene, Denmark</span>
      </div>
      <div className='flex items-center space-x-4'>
        <Phone className='h-6 w-6' />
        <a href='tel:+4591843038' className='underline'>
          +45 91 84 30 38
        </a>
      </div>
      <div className='flex items-center space-x-4'>
        <Mail className='h-6 w-6' />
        <a href='mailto:caserutudor@yahoo.com' className='underline'>
          caserutudor@yahoo.com
        </a>
      </div>
      <div className='flex items-center space-x-4'>
        <Linkedin className='h-6 w-6' />
        <a
          href='https://www.linkedin.com/in/tudor-caseru-9014b2129/'
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          linkedin.com/in/tudor-caseru-9014b2129/
        </a>
      </div>
      <div className='flex items-center space-x-4'>
        <Github className='h-6 w-6' />
        <a
          href='https://github.com/theoriginaltudor'
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          github.com/theoriginaltudor
        </a>
      </div>
    </CardContent>
  </Card>
);
