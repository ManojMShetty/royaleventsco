import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Lock, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { dataStore } from '@/data/store';
import type { BlockedDateStatus, Venue } from '@/types';

interface VendorAvailabilityCalendarProps {
  venue: Venue;
  onUpdate?: () => void;
}

const VendorAvailabilityCalendar: React.FC<VendorAvailabilityCalendarProps> = ({ venue, onUpdate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockStatus, setBlockStatus] = useState<BlockedDateStatus>('unavailable');
  const [note, setNote] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const { toast } = useToast();

  const blockedDates = useMemo(() => dataStore.getBlockedDatesByVenue(venue.id), [venue.id]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: Array<{ date: Date; isCurrentMonth: boolean; isPast: boolean; blocked?: typeof blockedDates[0] }> = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false, isPast: true });
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const blocked = blockedDates.find(bd => bd.date.toDateString() === date.toDateString());
      days.push({
        date,
        isCurrentMonth: true,
        isPast: date < today,
        blocked,
      });
    }

    // Next month padding
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, isPast: false });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const isDateSelected = (date: Date) => selectedDates.some(d => d.toDateString() === date.toDateString());

  const toggleDateSelection = (date: Date, isPast: boolean, isCurrentMonth: boolean) => {
    if (isPast || !isCurrentMonth) return;
    
    setIsSelecting(true);
    setSelectedDates(prev => {
      if (prev.some(d => d.toDateString() === date.toDateString())) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      }
      return [...prev, date];
    });
  };

  const handleBlockDates = () => {
    if (selectedDates.length === 0) {
      toast({
        title: 'No dates selected',
        description: 'Please select at least one date to block.',
        variant: 'destructive',
      });
      return;
    }

    dataStore.addBlockedDates(selectedDates, venue.id, blockStatus, note || undefined);
    
    toast({
      title: 'Dates updated',
      description: `${selectedDates.length} date(s) marked as ${blockStatus}.`,
    });

    setSelectedDates([]);
    setNote('');
    setIsSelecting(false);
    onUpdate?.();
  };

  const handleUnblockDate = (date: Date) => {
    dataStore.removeBlockedDateByVenueAndDate(venue.id, date);
    toast({
      title: 'Date unblocked',
      description: 'The date is now available for booking.',
    });
    onUpdate?.();
  };

  const clearSelection = () => {
    setSelectedDates([]);
    setIsSelecting(false);
  };

  const getStatusColor = (status: BlockedDateStatus) => {
    switch (status) {
      case 'booked': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'unavailable': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'blocked': return 'bg-muted text-muted-foreground border-border';
      default: return '';
    }
  };

  const getStatusBg = (status: BlockedDateStatus) => {
    switch (status) {
      case 'booked': return 'bg-destructive/30';
      case 'unavailable': return 'bg-yellow-500/30';
      case 'blocked': return 'bg-muted';
      default: return '';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-xl font-semibold">Manage Availability</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {venue.name}
        </Badge>
      </div>

      {/* Selection Panel */}
      {isSelecting && selectedDates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-secondary rounded-xl border border-gold/20"
        >
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                {selectedDates.length} date(s) selected
              </Label>
              <div className="flex flex-wrap gap-1">
                {selectedDates.slice(0, 5).map((date, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Badge>
                ))}
                {selectedDates.length > 5 && (
                  <Badge variant="secondary" className="text-xs">+{selectedDates.length - 5} more</Badge>
                )}
              </div>
            </div>
            
            <div className="w-full lg:w-40">
              <Label className="text-sm font-medium mb-2 block">Mark as</Label>
              <Select value={blockStatus} onValueChange={(v) => setBlockStatus(v as BlockedDateStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="blocked">Temporarily Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48">
              <Label className="text-sm font-medium mb-2 block">Note (optional)</Label>
              <Input
                placeholder="e.g., Wedding ceremony"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={clearSelection}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleBlockDates} className="bg-gradient-gold text-primary">
                <Check className="w-4 h-4 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h4 className="font-semibold text-lg">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayInfo, index) => {
          const isSelected = isDateSelected(dayInfo.date);
          const isClickable = dayInfo.isCurrentMonth && !dayInfo.isPast;

          return (
            <motion.button
              key={index}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              onClick={() => toggleDateSelection(dayInfo.date, dayInfo.isPast, dayInfo.isCurrentMonth)}
              disabled={!isClickable}
              className={cn(
                "relative aspect-square p-1 rounded-lg transition-all text-left flex flex-col",
                !dayInfo.isCurrentMonth && "opacity-30",
                dayInfo.isPast && "opacity-40 cursor-not-allowed",
                isSelected && "ring-2 ring-gold bg-gold/20",
                dayInfo.blocked && getStatusBg(dayInfo.blocked.status),
                isClickable && !isSelected && !dayInfo.blocked && "hover:bg-secondary cursor-pointer",
              )}
            >
              <span className="text-sm font-medium">
                {dayInfo.date.getDate()}
              </span>
              
              {dayInfo.blocked && (
                <div className="mt-auto">
                  <Badge className={cn("text-[8px] px-1 py-0", getStatusColor(dayInfo.blocked.status))}>
                    {dayInfo.blocked.status === 'booked' ? 'Booked' : 
                     dayInfo.blocked.status === 'unavailable' ? 'N/A' : 'Block'}
                  </Badge>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm font-medium mb-3">Legend & Quick Actions</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary border border-border" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/30 border border-destructive/30" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500/30" />
            <span className="text-muted-foreground">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted border border-border" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-gold bg-gold/20" />
            <span className="text-muted-foreground">Selected</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-secondary/50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Click on dates to select them, then choose a status and apply. 
            Blocked dates will be immediately unavailable for customer bookings.
          </p>
        </div>
      </div>

      {/* Blocked Dates List */}
      {blockedDates.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm font-medium mb-3">Currently Blocked Dates</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {blockedDates
              .filter(bd => bd.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 10)
              .map((bd) => (
                <div key={bd.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-xs", getStatusColor(bd.status))}>
                      {bd.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {bd.date.toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    {bd.note && (
                      <span className="text-xs text-muted-foreground">• {bd.note}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblockDate(bd.date)}
                    className="text-xs h-7"
                  >
                    Unblock
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorAvailabilityCalendar;
