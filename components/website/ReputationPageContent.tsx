'use client';

import { useState } from 'react';
import { useConfigStore } from '@/store/config-store';
import { submitLead } from '@/lib/actions';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function ReputationPageContent() {
  const { config } = useConfigStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lock the rating once selected to prevent "gaming" the redirect logic by changing stars
  const [isRatingLocked, setIsRatingLocked] = useState(false);

  if (!config.enableReputationPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Diese Seite ist derzeit nicht verfügbar.</p>
      </div>
    );
  }

  const handleStarClick = (score: number) => {
    if (isRatingLocked) return;
    setRating(score);
    setIsRatingLocked(true);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{config.companyName}</h1>
        <p className="text-slate-500 mb-8">Ihre Zufriedenheit ist unser Maßstab.</p>

        {!isRatingLocked ? (
          <>
            <h2 className="text-lg font-semibold mb-6">Wie bewerten Sie Ihre Erfahrung?</h2>
            <div className="flex justify-center gap-3 mb-8">
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
                      "h-12 w-12",
                      (hoverRating || rating) >= star 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-slate-200"
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn("h-8 w-8", i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} 
                />
              ))}
            </div>

            {rating >= 4 ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-green-600 mb-3">Vielen Dank!</h3>
                <p className="text-slate-600 mb-8">
                  Es freut uns sehr, dass Sie zufrieden sind. Würden Sie uns einen Gefallen tun und dies auf Google teilen?
                </p>
                <Button 
                  size="lg"
                  className="w-full py-6 text-lg"
                  onClick={() => window.open(config.googleReviewLink, '_blank')}
                  style={{ backgroundColor: '#DB4437' }} // Google Red
                >
                  Auf Google bewerten
                </Button>
              </div>
            ) : (
              <div className="text-left">
                {isSuccess ? (
                  <div className="text-center py-8 text-green-600">
                    <p className="font-bold text-lg">Danke für Ihr ehrliches Feedback.</p>
                    <p>Wir werden uns umgehend darum kümmern.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Was ist schiefgelaufen?</h3>
                    <p className="text-sm text-slate-500 mb-4">Helfen Sie uns, besser zu werden.</p>
                    
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="Ihr Feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                      />
                      <Input 
                        placeholder="Ihr Name (Optional)" 
                        value={contact.name}
                        onChange={(e) => setContact({...contact, name: e.target.value})}
                      />
                      <Input 
                        placeholder="Email (für Rückfragen, Optional)" 
                        value={contact.email}
                        onChange={(e) => setContact({...contact, email: e.target.value})}
                      />
                      <Button 
                        className="w-full mt-2"
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
    </div>
  );
}

