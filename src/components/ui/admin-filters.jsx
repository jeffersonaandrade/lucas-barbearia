import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Search, Filter } from 'lucide-react';

const AdminFilters = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  className = "mb-6"
}) => {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(filters.length + 1, 4)} gap-4`}>
          {/* Campo de Busca */}
          <div>
            <Label htmlFor="search" className="text-sm font-medium">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filtros Dinâmicos */}
          {filters.map((filter, index) => (
            <div key={index}>
              <Label htmlFor={filter.id} className="text-sm font-medium">{filter.label}</Label>
              <Select value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminFilters; 