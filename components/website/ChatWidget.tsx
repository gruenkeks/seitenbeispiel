'use client';

import { useState } from 'react';
import { useConfigStore } from '@/store/config-store';
import { submitLead } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatWidget() {
  const { config } = useConfigStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'greeting' | 'name' | 'contact' | 'message' | 'success'>('greeting');
  
  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState({ phone: '', email: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config.enableChatWidget) return null;

  const handleSubmit = async () => {
    console.log("ChatWidget: Submitting lead...");
    setIsSubmitting(true);
    try {
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
          type: 'chat',
          name,
          phone: contact.phone,
          email: contact.email,
          message
        }
      });
      
      setIsSubmitting(false);

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          setIsOpen(false);
          setStep('greeting');
          setMessage('');
        }, 3000);
      } else {
        alert('Fehler beim Senden: ' + (result.error || 'Versuchen Sie es später erneut.'));
      }
    } catch (error) {
      console.error("Client-side error submitting lead:", error);
      setIsSubmitting(false);
      alert('Ein unerwarteter Fehler ist aufgetreten.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
          <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
            <span className="font-medium">Kundenservice</span>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-700 p-1 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4 h-80 overflow-y-auto flex flex-col gap-4">
            {/* Messages Bubble Logic */}
            <div className="bg-slate-100 p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm">
              Hallo! Wie können wir Ihnen helfen?
            </div>

            {step !== 'greeting' && (
              <div className="self-end bg-blue-100 p-3 rounded-lg rounded-tr-none max-w-[85%] text-sm">
                {name}
              </div>
            )}

            {step === 'greeting' && (
              <div className="mt-auto">
                <Input 
                  placeholder="Ihr Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name && setStep('contact')}
                />
                <Button 
                  className="w-full mt-2" 
                  disabled={!name}
                  onClick={() => setStep('contact')}
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Weiter
                </Button>
              </div>
            )}

            {step === 'contact' && (
              <div className="mt-auto space-y-2">
                <p className="text-xs text-slate-500">Wie erreichen wir Sie?</p>
                <Input 
                  placeholder="Telefonnummer" 
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
                <Input 
                  placeholder="Email" 
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
                <Button 
                  className="w-full" 
                  disabled={!contact.phone && !contact.email}
                  onClick={() => setStep('message')}
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Weiter
                </Button>
              </div>
            )}

            {step === 'message' && (
              <div className="mt-auto space-y-2">
                <Textarea 
                  placeholder="Ihre Nachricht..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  disabled={!message || isSubmitting}
                  onClick={handleSubmit}
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {isSubmitting ? 'Sende...' : <><Send className="h-3 w-3 mr-2" /> Absenden</>}
                </Button>
              </div>
            )}

            {step === 'success' && (
              <div className="bg-green-50 text-green-800 p-4 rounded text-center text-sm my-auto">
                Vielen Dank! Wir melden uns in Kürze bei Ihnen.
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        style={{ backgroundColor: config.primaryColor }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}

