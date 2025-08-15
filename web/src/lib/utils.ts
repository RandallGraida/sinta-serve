import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extract appointment date from note content
export function extractAppointmentDate(content: string): string | null {
  const appointmentRegex = /📅 Appointment Date: (.+)/;
  const match = content.match(appointmentRegex);
  return match ? match[1] : null;
}

// Get clean content without appointment date
export function getCleanContent(content: string): string {
  return content.replace(/\n\n📅 Appointment Date: .+$/, '').trim();
}
