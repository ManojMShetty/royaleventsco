import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, MapPin, Image, Users, Utensils, Plus, Trash2, X, Check, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { dataStore } from '@/data/store';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Hall, FoodService, Venue } from '@/types';

interface VenueFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const cities = ['Mumbai', 'Delhi', 'Udaipur', 'Jaipur', 'Goa', 'Bangalore', 'Chennai', 'Hyderabad'];

const amenityOptions = [
  'Valet Parking', 'AC', 'DJ', 'Decoration', 'Catering', 'Rooms', 
  'Pool', 'Spa', 'Garden', 'Bridal Suite', 'Helipad', 'Beach Access'
];

const VenueForm: React.FC<VenueFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState(500);

  // Step 2: Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Step 3: Halls
  const [halls, setHalls] = useState<Hall[]>([
    { id: `hall-${Date.now()}`, name: '', capacity: 200, pricePerDay: 200000, amenities: [] }
  ]);

  // Step 4: Food & Amenities
  const [hasFoodService, setHasFoodService] = useState(false);
  const [vegPrice, setVegPrice] = useState(1200);
  const [nonVegPrice, setNonVegPrice] = useState(1800);
  const [minPlates, setMinPlates] = useState(100);
  const [vegItems, setVegItems] = useState(['Paneer Tikka', 'Dal Makhani', 'Biryani']);
  const [nonVegItems, setNonVegItems] = useState(['Butter Chicken', 'Fish Tikka']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const progress = (step / totalSteps) * 100;

  const addImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addHall = () => {
    setHalls([
      ...halls,
      { id: `hall-${Date.now()}`, name: '', capacity: 200, pricePerDay: 200000, amenities: [] }
    ]);
  };

  const updateHall = (index: number, updates: Partial<Hall>) => {
    const newHalls = [...halls];
    newHalls[index] = { ...newHalls[index], ...updates };
    setHalls(newHalls);
  };

  const removeHall = (index: number) => {
    if (halls.length > 1) {
      setHalls(halls.filter((_, i) => i !== index));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return name && description && city && address && capacity > 0;
      case 2:
        return images.length > 0;
      case 3:
        return halls.every(h => h.name && h.capacity > 0 && h.pricePerDay > 0);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!user) return;

    const foodService: FoodService | undefined = hasFoodService ? {
      id: `food-${Date.now()}`,
      venueId: '',
      vegPricePerPlate: vegPrice,
      nonVegPricePerPlate: nonVegPrice,
      minPlates,
      menuItems: {
        veg: vegItems,
        nonVeg: nonVegItems,
      },
      isAvailable: true,
    } : undefined;

    const venue: Venue = {
      id: `venue-${Date.now()}`,
      vendorId: user.id,
      name,
      description,
      city,
      address,
      images,
      capacity,
      halls,
      foodService,
      rating: 0,
      reviewCount: 0,
      amenities: selectedAmenities,
      startingPrice: Math.min(...halls.map(h => h.pricePerDay)),
      isVerified: false,
      createdAt: new Date(),
    };

    if (foodService) {
      venue.foodService = { ...foodService, venueId: venue.id };
    }

    dataStore.addVenue(venue);

    toast({
      title: 'Venue submitted!',
      description: 'Your venue is pending admin verification.',
    });

    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold">Add New Venue</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-gold font-medium">
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Images'}
                {step === 3 && 'Halls & Pricing'}
                {step === 4 && 'Food & Amenities'}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    <Building className="w-4 h-4 inline mr-2 text-gold" />
                    Venue Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., The Grand Palace"
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your venue's unique features..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium mb-2 block">
                      <MapPin className="w-4 h-4 inline mr-2 text-gold" />
                      City
                    </Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-2 block">
                      <Users className="w-4 h-4 inline mr-2 text-gold" />
                      Total Capacity
                    </Label>
                    <Input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">Full Address</Label>
                  <Textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Complete address with pincode..."
                    rows={2}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Images */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    <Image className="w-4 h-4 inline mr-2 text-gold" />
                    Venue Images
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add high-quality images of your venue. First image will be the cover.
                  </p>

                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1"
                    />
                    <Button onClick={addImage} variant="outline" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-video rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Venue ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeImage(index)}
                            className="p-2 bg-destructive rounded-full text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2 bg-gold text-primary">Cover</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Halls */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Configure Halls
                  </Label>
                  <Button onClick={addHall} variant="outline" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add Hall
                  </Button>
                </div>

                <div className="space-y-4">
                  {halls.map((hall, index) => (
                    <div key={hall.id} className="bg-secondary rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Hall {index + 1}</span>
                        {halls.length > 1 && (
                          <button
                            onClick={() => removeHall(index)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm mb-1 block">Hall Name</Label>
                          <Input
                            value={hall.name}
                            onChange={(e) => updateHall(index, { name: e.target.value })}
                            placeholder="e.g., Royal Ballroom"
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-1 block">Capacity</Label>
                          <Input
                            type="number"
                            value={hall.capacity}
                            onChange={(e) => updateHall(index, { capacity: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-1 block">Price/Day (₹)</Label>
                          <Input
                            type="number"
                            value={hall.pricePerDay}
                            onChange={(e) => updateHall(index, { pricePerDay: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Food & Amenities */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Food Service */}
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-gold" />
                      <Label className="text-base font-medium">In-House Catering</Label>
                    </div>
                    <Switch checked={hasFoodService} onCheckedChange={setHasFoodService} />
                  </div>

                  <AnimatePresence>
                    {hasFoodService && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm mb-1 block">Veg Price/Plate</Label>
                            <Input
                              type="number"
                              value={vegPrice}
                              onChange={(e) => setVegPrice(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">Non-Veg Price/Plate</Label>
                            <Input
                              type="number"
                              value={nonVegPrice}
                              onChange={(e) => setNonVegPrice(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">Min Plates</Label>
                            <Input
                              type="number"
                              value={minPlates}
                              onChange={(e) => setMinPlates(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm mb-1 block">Veg Menu Items (comma separated)</Label>
                          <Input
                            value={vegItems.join(', ')}
                            onChange={(e) => setVegItems(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="Paneer Tikka, Dal Makhani..."
                          />
                        </div>

                        <div>
                          <Label className="text-sm mb-1 block">Non-Veg Menu Items (comma separated)</Label>
                          <Input
                            value={nonVegItems.join(', ')}
                            onChange={(e) => setNonVegItems(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="Butter Chicken, Fish Tikka..."
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Amenities */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Venue Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {amenityOptions.map((amenity) => (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          selectedAmenities.includes(amenity)
                            ? "bg-gold text-primary"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!validateStep()}
              className="bg-gradient-gold text-primary gap-1"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-gold text-primary gap-1"
            >
              <Check className="w-4 h-4" />
              Submit Venue
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VenueForm;
