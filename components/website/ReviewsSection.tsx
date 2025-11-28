'use client';

import { useConfigStore } from '@/store/config-store';
import { Star } from 'lucide-react';

export default function ReviewsSection() {
  const { config } = useConfigStore();

  // Only show 4 and 5 star reviews
  const displayReviews = config.reviews.filter(r => r.rating >= 4);

  if (displayReviews.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Das sagen unsere Kunden</h2>
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <span className="text-slate-600 font-medium">4.9 von 5 Sternen auf Google</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                {review.imageUrl ? (
                  <img 
                    src={review.imageUrl} 
                    alt={review.author} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                    {review.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-slate-900">{review.author}</div>
                  <div className="text-xs text-slate-400">{review.date}</div>
                </div>
              </div>
              
              <div className="flex text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              
              <p className="text-slate-600 leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                <img src="/google-logo.svg" alt="Google" className="w-4 h-4 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span className="text-xs text-slate-400 font-medium">Google Bewertung</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

