'use client';

import { useState, useMemo } from 'react';
import { useConfigStore } from '@/store/config-store';
import { submitLead } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format, addMinutes, parse, set, isBefore, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { config } = useConfigStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'date' | 'form' | 'success'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [moreInfo, setMoreInfo] = useState('');

  // Generate slots based on config
  const slots = useMemo(() => {
    if (!date) return [];
    
    const { start, end } = config.availableHours;
    const duration = config.slotDuration;
    
    const startTime = parse(start, 'HH:mm', date);
    const endTime = parse(end, 'HH:mm', date);
    
    const timeSlots: string[] = [];
    let current = startTime;

    while (isBefore(current, endTime)) {
      timeSlots.push(format(current, 'HH:mm'));
      current = addMinutes(current, duration);
    }

    return timeSlots;
  }, [date, config.availableHours, config.slotDuration]);

  // Disable blocked days
  const isDateDisabled = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return true; // Past dates
    return config.blockedDays.includes(day.getDay());
  };

  const handleSlotClick = (time: string) => {
    setSelectedSlot(time);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedSlot) return;

    setIsSubmitting(true);
    
    // Combine date and slot
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const slotDate = set(date, { hours, minutes });

    const result = await submitLead({
      meta: {
        source: 'website-builder',
        ownerPhone: config.contact.phone,
        ownerEmail: config.contact.email,
        smsSenderName: config.smsSenderName,
        telegramChatId: config.telegramChatId,
        notificationType: config.ownerNotificationType,
      },
      lead: {
        type: 'booking',
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        message: moreInfo,
        requestedSlot: slotDate.toISOString(),
      }
    });

    setIsSubmitting(false);

    if (result.success) {
      setStep('success');
      setTimeout(() => {
        setStep('date');
        setSelectedSlot(null);
        setContact({ name: '', phone: '', email: '' });
        onClose();
      }, 3000);
    } else {
      alert('Fehler beim Senden der Anfrage: ' + (result.error || 'Unbekannter Fehler'));
    }
  };

  if (!config.enableBookingSystem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Beratungstermin buchen</DialogTitle>
          <DialogDescription>
            Wählen Sie einen passenden Zeitpunkt für ein persönliches Gespräch.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-green-600 space-y-2">
              <p className="text-2xl font-bold">Termin angefragt!</p>
              <p>Wir bestätigen Ihren Termin in Kürze per SMS/Email.</p>
            </div>
          ) : step === 'date' ? (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={isDateDisabled}
                  locale={de}
                  className="rounded-md border shadow"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-3 text-center md:text-left">
                  Verfügbare Zeiten am {date ? format(date, 'dd.MM.yyyy') : ''}
                </h4>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {slots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className={cn(
                        "text-sm",
                        selectedSlot === time && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleSlotClick(time)}
                    >
                      {time}
                    </Button>
                  ))}
                  {slots.length === 0 && (
                    <p className="col-span-3 text-sm text-slate-500 text-center py-4">
                      Keine Termine verfügbar.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
               <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 mb-4">
                 Termin: <strong>{date && format(date, 'dd.MM.yyyy')}</strong> um <strong>{selectedSlot} Uhr</strong>
                 <Button variant="link" className="h-auto p-0 ml-2 text-xs" onClick={() => setStep('date')}>
                   (Ändern)
                 </Button>
               </div>

               <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={contact.name} 
                  onChange={(e) => setContact({...contact, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input 
                  value={contact.phone} 
                  onChange={(e) => setContact({...contact, phone: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={contact.email} 
                  onChange={(e) => setContact({...contact, email: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Weitere Informationen (Optional)</Label>
                <Textarea 
                  value={moreInfo} 
                  onChange={(e) => setMoreInfo(e.target.value)}
                  placeholder="Haben Sie spezielle Wünsche oder Fragen?"
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {isSubmitting ? 'Buche...' : 'Termin kostenlos anfragen'} 
                </Button>
                <p className="text-xs text-slate-400 text-center mt-2">
                  *Dies ist eine unverbindliche Anfrage.
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

