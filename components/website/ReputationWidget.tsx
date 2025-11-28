'use client';

import { useState } from 'react';
import { useConfigStore } from '@/store/config-store';
import { submitLead } from '@/lib/actions';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function ReputationSection() {
  const { config } = useConfigStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState({ name: '', email: '' }); // Optional for feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!config.enableReputationPage) return null;

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  const handleSubmitFeedback = async () => {
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
        type: 'feedback',
        name: contact.name || 'Anonymous',
        phone: '',
        email: contact.email || '',
        message: `Rating: ${rating} Stars\nFeedback: ${feedback}`
      }
    });
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      alert('Fehler beim Senden des Feedbacks: ' + (result.error || 'Bitte versuchen Sie es später erneut.'));
    }
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-slate-800">Ihre Meinung ist uns wichtig</h2>
        <p className="text-slate-600 mb-8">
          Wie zufrieden waren Sie mit unserer Leistung?
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleStarClick(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-10 w-10",
                  (hoverRating || rating) >= star 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-slate-300"
                )}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {rating >= 4 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-green-600 mb-2">Vielen Dank!</h3>
                <p className="text-slate-600 mb-6">
                  Das freut uns sehr. Würden Sie Ihre Erfahrung auf Google teilen?
                  Das hilft uns enorm.
                </p>
                <Button 
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => window.open(config.googleReviewLink, '_blank')}
                >
                  Jetzt auf Google bewerten
                </Button>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-left">
                {isSuccess ? (
                  <div className="text-center text-green-600">
                    <p className="font-semibold">Danke für Ihr Feedback!</p>
                    <p>Wir werden uns Ihre Anmerkungen zu Herzen nehmen.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Was können wir besser machen?</h3>
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="Ihr Feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                      />
                      <div className="grid grid-cols-2 gap-4">
                         <Input 
                            placeholder="Name (Optional)" 
                            value={contact.name}
                            onChange={(e) => setContact({...contact, name: e.target.value})}
                         />
                         <Input 
                            placeholder="Email (Optional)" 
                            value={contact.email}
                            onChange={(e) => setContact({...contact, email: e.target.value})}
                         />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={handleSubmitFeedback}
                        disabled={!feedback || isSubmitting}
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        Feedback senden
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

