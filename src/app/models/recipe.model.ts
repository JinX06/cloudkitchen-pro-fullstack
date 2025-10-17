export interface Recipe {
  recipeId: string;
  userId: string;
  title: string;
  chef: string;
  ingredients: string[];
  instructions: string[];
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  cuisineType: 'Italian' | 'Asian' | 'Mexican' | 'American' | 'French' | 'Indian' | 'Mediterranean' | 'Other';
  prepTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  createdAt: string;
  updatedAt: string;

  // Ratings and reviews not maintained in A3 but added for backward compatibility
  ratings?: number[]; 
  reviews?: {
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  avgRating?: number;
}

export interface RecipeListResponse {
  items: Recipe[];
}

export interface RecipeResponse {
  item: Recipe;
  recipe: Recipe;
  error: string;
}

export interface RecipePayload {
  title: string;
  chef: string;
  ingredients: string | string[];
  instructions: string | string[];
  mealType: Recipe['mealType'];
  cuisineType: Recipe['cuisineType'];
  prepTime: number;
  difficulty: Recipe['difficulty'];
  servings: number;
}

export interface RecipeCreateRequest extends RecipePayload {}

export interface RecipeUpdateRequest extends RecipePayload {
  recipeId: string;
}
