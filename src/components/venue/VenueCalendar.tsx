import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { dataStore } from '@/data/store';
import { differenceInDays, addDays, isSameDay, isWithinInterval } from 'date-fns';

interface VenueCalendarProps {
  venueId: string;
  basePrice: number;
  onDateSelect?: (startDate: Date, endDate: Date) => void;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  mode?: 'single' | 'range';
}

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isBlocked: boolean;
  isPast: boolean;
  priceMultiplier: number;
  blockStatus?: 'booked' | 'unavailable' | 'blocked';
}

const getPriceMultiplier = (date: Date): number => {
  const day = date.getDay();
  const month = date.getMonth();
  
  // Weekends are 20% more expensive
  if (day === 0 || day === 6) {
    return 1.2;
  }
  
  // Wedding season (Oct-Feb) is 15% more expensive
  if (month >= 9 || month <= 1) {
    return 1.15;
  }
  
  // Fridays are 10% more expensive
  if (day === 5) {
    return 1.1;
  }
  
  return 1;
};

const VenueCalendar: React.FC<VenueCalendarProps> = ({
  venueId,
  basePrice,
  onDateSelect,
  selectedStartDate,
  selectedEndDate,
  mode = 'range',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(selectedStartDate || null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(selectedEndDate || null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  // Get blocked dates from data store
  const blockedDates = useMemo(() => dataStore.getBlockedDatesByVenue(venueId), [venueId]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number): DayInfo[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: DayInfo[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isBlocked: false,
        isPast: true,
        priceMultiplier: 1,
      });
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const blockedDate = blockedDates.find(
        (bd) => bd.date.toDateString() === date.toDateString()
      );
      const isBlocked = !!blockedDate;
      const isPast = date < today;
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isBlocked,
        isPast,
        priceMultiplier: getPriceMultiplier(date),
        blockStatus: blockedDate?.status,
      });
    }

    // Next month padding
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isBlocked: false,
        isPast: false,
        priceMultiplier: getPriceMultiplier(date),
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (dayInfo: DayInfo) => {
    if (dayInfo.isPast || dayInfo.isBlocked || !dayInfo.isCurrentMonth) return;

    if (mode === 'single') {
      setRangeStart(dayInfo.date);
      setRangeEnd(dayInfo.date);
      onDateSelect?.(dayInfo.date, dayInfo.date);
      return;
    }

    // Range selection mode
    if (!rangeStart || (rangeStart && rangeEnd)) {
      // Start new selection
      setRangeStart(dayInfo.date);
      setRangeEnd(null);
      setIsSelectingEnd(true);
    } else {
      // Complete the range
      if (dayInfo.date < rangeStart) {
        // If clicked date is before start, swap
        setRangeEnd(rangeStart);
        setRangeStart(dayInfo.date);
      } else {
        setRangeEnd(dayInfo.date);
      }
      setIsSelectingEnd(false);

      // Check if any date in range is blocked
      const start = dayInfo.date < rangeStart ? dayInfo.date : rangeStart;
      const end = dayInfo.date < rangeStart ? rangeStart : dayInfo.date;
      
      const hasBlockedDates = !dataStore.areDatesAvailable(venueId, start, end);
      if (hasBlockedDates) {
        // Reset selection if blocked dates in range
        setRangeStart(null);
        setRangeEnd(null);
        return;
      }

      onDateSelect?.(start, end);
    }
  };

  const isInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
    return isWithinInterval(date, { start, end });
  };

  const isRangeStart = (date: Date) => rangeStart && isSameDay(date, rangeStart);
  const isRangeEnd = (date: Date) => rangeEnd && isSameDay(date, rangeEnd);

  const getBlockedStatusColor = (status?: 'booked' | 'unavailable' | 'blocked') => {
    switch (status) {
      case 'booked': return 'bg-destructive/20';
      case 'unavailable': return 'bg-yellow-500/20';
      case 'blocked': return 'bg-muted';
      default: return 'bg-destructive/10';
    }
  };

  const numberOfDays = rangeStart && rangeEnd 
    ? differenceInDays(rangeEnd, rangeStart) + 1 
    : rangeStart ? 1 : 0;

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-xl font-semibold">
            {mode === 'range' ? 'Select Your Dates' : 'Availability Calendar'}
          </h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">
                {mode === 'range' 
                  ? 'Click to select start date, then click again to select end date. Grey dates are unavailable.'
                  : 'Prices vary by day. Weekends and wedding season (Oct-Feb) have premium pricing.'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Selection Summary */}
      {mode === 'range' && (rangeStart || rangeEnd) && (
        <div className="mb-4 p-3 bg-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {rangeStart && (
                <span>
                  <strong>Start:</strong> {rangeStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
              {rangeEnd && (
                <span className="ml-4">
                  <strong>End:</strong> {rangeEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            {numberOfDays > 0 && (
              <Badge className="bg-gold/20 text-gold border-gold/30">
                {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {isSelectingEnd && (
            <p className="text-xs text-muted-foreground mt-2">
              Click on another date to complete your selection
            </p>
          )}
        </div>
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
          const isClickable = dayInfo.isCurrentMonth && !dayInfo.isPast && !dayInfo.isBlocked;
          const isStart = isRangeStart(dayInfo.date);
          const isEnd = isRangeEnd(dayInfo.date);
          const inRange = isInRange(dayInfo.date);
          
          return (
            <motion.button
              key={index}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              onClick={() => handleDateClick(dayInfo)}
              disabled={!isClickable}
              className={cn(
                "relative aspect-square p-1 rounded-lg transition-all text-left flex flex-col",
                !dayInfo.isCurrentMonth && "opacity-30",
                dayInfo.isPast && "opacity-40 cursor-not-allowed",
                dayInfo.isBlocked && getBlockedStatusColor(dayInfo.blockStatus),
                dayInfo.isBlocked && "cursor-not-allowed",
                dayInfo.isToday && !isStart && !isEnd && "ring-2 ring-gold",
                (isStart || isEnd) && "bg-gold text-primary",
                inRange && !isStart && !isEnd && "bg-gold/30",
                isClickable && !isStart && !isEnd && !inRange && "hover:bg-secondary cursor-pointer",
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                (isStart || isEnd) && "text-primary"
              )}>
                {dayInfo.date.getDate()}
              </span>
              
              {dayInfo.isCurrentMonth && !dayInfo.isPast && !dayInfo.isBlocked && (
                <span className={cn(
                  "text-[10px] mt-auto",
                  dayInfo.priceMultiplier > 1 ? "text-gold font-medium" : "text-muted-foreground",
                  (isStart || isEnd) && "text-primary/80"
                )}>
                  {dayInfo.priceMultiplier > 1 && '+'}
                  {dayInfo.priceMultiplier > 1 ? `${Math.round((dayInfo.priceMultiplier - 1) * 100)}%` : 'Base'}
                </span>
              )}

              {dayInfo.isBlocked && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-0.5 bg-destructive rotate-45 absolute" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary border border-border" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gold" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gold/30" />
            <span className="text-muted-foreground">In Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20 relative overflow-hidden">
              <span className="w-full h-0.5 bg-destructive rotate-45 absolute top-1/2 left-0" />
            </div>
            <span className="text-muted-foreground">Booked/Unavailable</span>
          </div>
        </div>

        {/* Price Info */}
        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="text-sm font-medium mb-2">Price Variations</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <span>Weekdays: Base price</span>
            <span>Weekends: +20%</span>
            <span>Fridays: +10%</span>
            <span>Wedding Season: +15%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCalendar;
