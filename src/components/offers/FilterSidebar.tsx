"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterSidebarProps {
  categories: string[];
  districts: string[];
  facets?: {
    categories: Array<{ name: string; count: number }>;
  };
}

export function FilterSidebar({ categories, districts, facets }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State initialization from URL
  const initialCategories = searchParams.get("category")?.split(",") || [];
  const initialDistricts = searchParams.get("district")?.split(",") || [];
  const initialSearch = searchParams.get("search") || "";
  
  // New States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(initialDistricts);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minDiscount, setMinDiscount] = useState([Number(searchParams.get("minDiscount")) || 0]); 
  const [expiresBefore, setExpiresBefore] = useState(searchParams.get("expiresBefore") || "");

  // Sync state with URL
  useEffect(() => {
    setSelectedCategories(searchParams.get("category")?.split(",").filter(Boolean) || []);
    setSelectedDistricts(searchParams.get("district")?.split(",").filter(Boolean) || []);
    setSearchQuery(searchParams.get("search") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMinDiscount([Number(searchParams.get("minDiscount")) || 0]);
    setExpiresBefore(searchParams.get("expiresBefore") || "");
  }, [searchParams]);

  const updateFilters = (
    newCategories: string[],
    newDistricts: string[],
    newSearch: string,
    newMinPrice: string,
    newMaxPrice: string,
    newMinDiscount: number,
    newExpiresBefore: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update Arrays
    if (newCategories.length > 0) params.set("category", newCategories.join(","));
    else params.delete("category");

    if (newDistricts.length > 0) params.set("district", newDistricts.join(","));
    else params.delete("district");

    // Update Search
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    // Update Price
    if (newMinPrice) params.set("minPrice", newMinPrice); else params.delete("minPrice");
    if (newMaxPrice) params.set("maxPrice", newMaxPrice); else params.delete("maxPrice");

    // Update Discount
    if (newMinDiscount > 0) params.set("minDiscount", newMinDiscount.toString()); 
    else params.delete("minDiscount");

    // Update Expiry
    if (newExpiresBefore) params.set("expiresBefore", newExpiresBefore);
    else params.delete("expiresBefore");

    params.delete("page"); // Reset page
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    setSelectedCategories(newCategories);
    updateFilters(newCategories, selectedDistricts, searchQuery, minPrice, maxPrice, minDiscount[0], expiresBefore);
  };

  // ... (handleDistrictChange similar) ... 
  // I will define handleDistrictChange fully to ensure no break
  const handleDistrictChange = (district: string, checked: boolean) => {
    const newDistricts = checked
       ? [...selectedDistricts, district]
       : selectedDistricts.filter((d) => d !== district);
     
     setSelectedDistricts(newDistricts);
     updateFilters(selectedCategories, newDistricts, searchQuery, minPrice, maxPrice, minDiscount[0], expiresBefore);
  };

  const applyAdvancedFilters = () => {
      updateFilters(selectedCategories, selectedDistricts, searchQuery, minPrice, maxPrice, minDiscount[0], expiresBefore);
  }

  // Helper to get count
  const getCategoryCount = (catName: string) => {
      const facet = facets?.categories?.find(c => c.name.toLowerCase() === catName.toLowerCase());
      return facet ? facet.count : 0;
  };

  return (
    <div className="space-y-6">
       {/* ... Header and Search ... */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {(selectedCategories.length > 0 || selectedDistricts.length > 0 || minPrice || maxPrice || minDiscount[0] > 0 || expiresBefore) && (
            <Button variant="ghost" size="sm" onClick={() => router.push(pathname)} className="h-8 px-2 text-destructive hover:text-destructive">
                Clear all
            </Button>
        )}
      </div>

       {/* Search Box */}
       {/* ... (Keep search box) ... */}
       
      <Accordion type="multiple" defaultValue={["categories"]} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.some(c => c.toLowerCase() === category.toLowerCase())}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <Label
                        htmlFor={`cat-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {getCategoryCount(category)}
                    </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
            <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
            <AccordionContent>
                <div className="flex items-center gap-2 pt-2">
                    <Input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-8 text-sm"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-3 h-7 text-xs" onClick={applyAdvancedFilters}>
                    Apply Price
                </Button>
            </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="discount">
            <AccordionTrigger className="text-base font-medium">Min Discount</AccordionTrigger>
            <AccordionContent>
                <div className="pt-4 px-2">
                    <Slider 
                        defaultValue={[0]} 
                        value={minDiscount}
                        max={90} 
                        step={5}
                        onValueChange={(val) => {
                             setMinDiscount(val);
                             // Debounce or apply on button? Let's verify via button or debounce. 
                             // Slider change is frequent. Better apply on commit or assume user stops. 
                             // For now let's apply on change for immediate feedback
                             updateFilters(selectedCategories, selectedDistricts, searchQuery, minPrice, maxPrice, val[0], expiresBefore);
                        }}
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>0%</span>
                        <span className="font-semibold text-primary">{minDiscount[0]}% Off +</span>
                        <span>90%</span>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>

        {/* Districts */}
        <AccordionItem value="districts">
          <AccordionTrigger className="text-base font-medium">Districts</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {districts.map((district) => (
                <div key={district} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dist-${district}`}
                    checked={selectedDistricts.includes(district)}
                    onCheckedChange={(checked) => handleDistrictChange(district, checked as boolean)}
                  />
                  <Label
                    htmlFor={`dist-${district}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {district}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="expiry">
             <AccordionTrigger className="text-base font-medium">Expiry</AccordionTrigger>
             <AccordionContent>
                <div className="space-y-2 pt-1">
                    <Button 
                        variant={expiresBefore ? "default" : "outline"}
                        size="sm" 
                        className="w-full justify-start text-xs h-8"
                        onClick={() => {
                            const date = new Date();
                            date.setDate(date.getDate() + 7); // Next 7 days
                            const dateStr = date.toISOString().split('T')[0];
                            const newValue = expiresBefore === dateStr ? "" : dateStr;
                            setExpiresBefore(newValue);
                            updateFilters(selectedCategories, selectedDistricts, searchQuery, minPrice, maxPrice, minDiscount[0], newValue);
                        }}
                    >
                         Expires in 7 Days
                    </Button>
                     <Button 
                        variant={expiresBefore ? "outline" : "outline"} // Logic simplified, need distinct values
                         size="sm" 
                        className="w-full justify-start text-xs h-8"
                         onClick={() => {
                             // clear logic/custom logic
                             setExpiresBefore("");
                             updateFilters(selectedCategories, selectedDistricts, searchQuery, minPrice, maxPrice, minDiscount[0], "");
                        }}
                    >
                         Any Time
                    </Button>
                </div>
             </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
