'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const { config } = useConfigStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form
  const [service, setService] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        type: 'quote',
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        message: `Service: ${service}\nDetails: ${details}`,
      }
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setService('');
        setDetails('');
        setContact({ name: '', phone: '', email: '' });
      }, 3000);
    } else {
       alert('Fehler beim Senden der Anfrage: ' + (result.error || 'Unbekannter Fehler'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Unverbindliches Angebot anfordern</DialogTitle>
          <DialogDescription>
            Beschreiben Sie Ihr Anliegen, wir melden uns schnellstmöglich.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-10 text-center text-green-600">
            <p className="font-semibold text-lg">Anfrage erfolgreich gesendet!</p>
            <p>Wir haben Ihre Daten erhalten.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Gewünschte Leistung</Label>
              <Select onValueChange={setService} required>
                <SelectTrigger>
                  <SelectValue placeholder="Bitte wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {config.servicesList.map((s, i) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Details zum Auftrag</Label>
              <Textarea 
                placeholder="Bsp: Baujahr 1990, Geräusche in der Heizung..." 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ backgroundColor: config.primaryColor }}
              >
                {isSubmitting ? 'Sende...' : 'Anfrage absenden'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
