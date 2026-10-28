import React from 'react'
import {
  UtensilsCrossed,
  Home,
  Car,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  ShoppingBag,
  Tv,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Store,
  Tag,
  DollarSign,
  PlusCircle,
  LucideProps,
} from 'lucide-react'
import { getCategoryByName } from '@/utils/categories'

interface CategoryIconProps extends LucideProps {
  categoryName?: string
  iconName?: string
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  iconName,
  ...props
}) => {
  const icon = iconName || (categoryName ? getCategoryByName(categoryName)?.icon : 'Tag')

  switch (icon) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...props} />
    case 'Home':
      return <Home {...props} />
    case 'Car':
      return <Car {...props} />
    case 'HeartPulse':
      return <HeartPulse {...props} />
    case 'GraduationCap':
      return <GraduationCap {...props} />
    case 'Gamepad2':
      return <Gamepad2 {...props} />
    case 'ShoppingBag':
      return <ShoppingBag {...props} />
    case 'Tv':
      return <Tv {...props} />
    case 'Briefcase':
      return <Briefcase {...props} />
    case 'Laptop':
      return <Laptop {...props} />
    case 'TrendingUp':
      return <TrendingUp {...props} />
    case 'Coins':
      return <Coins {...props} />
    case 'Store':
      return <Store {...props} />
    case 'PlusCircle':
      return <PlusCircle {...props} />
    case 'DollarSign':
      return <DollarSign {...props} />
    default:
      return <Tag {...props} />
  }
}
