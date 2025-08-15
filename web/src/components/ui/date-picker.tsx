import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Select a date", 
  className,
  disabled = false 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected date when value prop changes
  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    onChange(date.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth.getMonth() && 
        selectedDate.getFullYear() === currentMonth.getFullYear();
      const isToday = date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear();
      const isDisabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={isDisabled}
          className={cn(
            "h-10 w-10 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
            !isSelected && !isDisabled && "hover:bg-gray-100",
            isToday && !isSelected && "bg-blue-50 text-blue-600 border border-blue-200",
            isDisabled && "text-gray-400 cursor-not-allowed bg-gray-50"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full justify-start text-left font-normal",
          !selectedDate && "text-gray-500",
          disabled && "text-gray-900 bg-gray-50"
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {selectedDate ? formatDate(selectedDate) : placeholder}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleMonthChange('prev')}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="text-sm font-semibold">
                {currentMonth.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => handleMonthChange('next')}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DatePicker;