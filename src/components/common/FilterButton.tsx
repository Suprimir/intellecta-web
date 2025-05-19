import { Category } from "@/types/api";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";

interface FilterButtonProps {
  label: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  categories?: Category[];
  onSelect?: (item: any) => void;
}

export default function FilterButton({
  label,
  icon = null,
  hasDropdown = false,
  categories = [],
  onSelect,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selected, setSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCategories = categories.filter((category) =>
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = () => {
    const newState = !selected;
    setSelected(newState);
    onSelect?.(newState);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
    if (onSelect) {
      onSelect(category);
    }
  };

  if (!hasDropdown) {
    return (
      <button
        onClick={() => handleSelect()}
        className={`cursor-pointer flex items-center px-4 py-2 text-sm rounded-xl ${
          selected ? "shadow bg-gray-100" : "shadow bg-white"
        }`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </button>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer flex items-center px-4 py-2 text-sm rounded-xl bg-white shadow`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {selectedCategory || label}
        <ChevronDownIcon
          className={`ml-2 w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-64 p-2 bg-white rounded-lg shadow-lg z-10">
          <div className="flex items-center border rounded px-2 py-1 mb-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categorías"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 w-full outline-none text-sm"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            <div
              className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded inline-flex w-full text-red-500"
              onClick={() => handleCategorySelect("")}
            >
              <MinusCircleIcon className="size-4 self-center me-2" />
              Quitar Filtro
            </div>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={index}
                  className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => handleCategorySelect(category.description)}
                >
                  {category.description}
                </div>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-gray-500">
                No se encontraron categorías
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
