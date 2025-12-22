import { Offer } from '@/types';

export interface Activity {
  id: string;
  type: 'view' | 'save' | 'unsave';
  offerId: string;
  offerTitle: string;
  offerImage?: string;
  timestamp: number;
}

const STORAGE_KEY = 'member_activities';
const MAX_ACTIVITIES = 50;

class ActivityService {
  private getActivities(): Activity[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load activities:', error);
      return [];
    }
  }

  private saveActivities(activities: Activity[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  }

  trackView(offer: Offer): void {
    const activities = this.getActivities();
    
    // Don't track duplicate views within 5 minutes
    const recentView = activities.find(
      a => a.type === 'view' && 
           a.offerId === offer._id && 
           Date.now() - a.timestamp < 5 * 60 * 1000
    );
    
    if (recentView) return;

    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'view',
      offerId: offer._id,
      offerTitle: offer.title,
      offerImage: offer.imageUrl,
      timestamp: Date.now(),
    };

    const updatedActivities = [newActivity, ...activities].slice(0, MAX_ACTIVITIES);
    this.saveActivities(updatedActivities);
  }

  trackSave(offer: Offer): void {
    const activities = this.getActivities();

    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'save',
      offerId: offer._id,
      offerTitle: offer.title,
      offerImage: offer.imageUrl,
      timestamp: Date.now(),
    };

    const updatedActivities = [newActivity, ...activities].slice(0, MAX_ACTIVITIES);
    this.saveActivities(updatedActivities);
  }

  trackUnsave(offer: Offer): void {
    const activities = this.getActivities();

    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'unsave',
      offerId: offer._id,
      offerTitle: offer.title,
      offerImage: offer.imageUrl,
      timestamp: Date.now(),
    };

    const updatedActivities = [newActivity, ...activities].slice(0, MAX_ACTIVITIES);
    this.saveActivities(updatedActivities);
  }

  getRecentActivities(limit: number = 10): Activity[] {
    const activities = this.getActivities();
    return activities.slice(0, limit);
  }

  clearActivities(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const activityService = new ActivityService();
