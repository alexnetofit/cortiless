import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// Pre-defined meal templates
const MEAL_TEMPLATES = {
  breakfast: [
    { title: 'Greek Yogurt Power Bowl', description: 'Greek yogurt with mixed berries, chia seeds, and a drizzle of honey. Rich in protein and probiotics.', calories: 320 },
    { title: 'Avocado Toast with Eggs', description: 'Whole grain toast with smashed avocado, poached eggs, and cherry tomatoes.', calories: 380 },
    { title: 'Overnight Oats', description: 'Oats soaked in almond milk with banana, walnuts, and cinnamon. Anti-inflammatory spices help manage cortisol.', calories: 350 },
    { title: 'Spinach & Mushroom Omelette', description: 'Fluffy 3-egg omelette with fresh spinach, mushrooms, and feta cheese.', calories: 340 },
    { title: 'Smoothie Bowl', description: 'Blended acai, banana, and spinach topped with granola and coconut flakes.', calories: 310 },
    { title: 'Whole Grain Pancakes', description: 'Oat flour pancakes with fresh berries and a touch of maple syrup.', calories: 360 },
    { title: 'Chia Pudding', description: 'Chia seeds in coconut milk with mango and passion fruit. Omega-3s support hormone balance.', calories: 290 },
  ],
  lunch: [
    { title: 'Mediterranean Quinoa Bowl', description: 'Quinoa with grilled chicken, cucumber, tomatoes, olives, and tzatziki. Anti-inflammatory and cortisol-balancing.', calories: 480 },
    { title: 'Asian Salmon Salad', description: 'Mixed greens with grilled salmon, edamame, avocado, and sesame ginger dressing.', calories: 520 },
    { title: 'Turkey & Veggie Wrap', description: 'Whole wheat wrap with turkey breast, hummus, roasted vegetables, and mixed greens.', calories: 440 },
    { title: 'Lentil Soup with Bread', description: 'Hearty lentil soup with carrots, celery, and whole grain bread. High in fiber and B vitamins.', calories: 420 },
    { title: 'Chicken Caesar Salad', description: 'Grilled chicken breast over romaine with parmesan, croutons, and light caesar dressing.', calories: 460 },
    { title: 'Sweet Potato Buddha Bowl', description: 'Roasted sweet potato, chickpeas, kale, and tahini dressing. Magnesium-rich for stress relief.', calories: 470 },
    { title: 'Tuna Nicoise Salad', description: 'Seared tuna, green beans, potatoes, olives, and boiled egg with vinaigrette.', calories: 490 },
  ],
  dinner: [
    { title: 'Herb-Crusted Salmon', description: 'Baked salmon with roasted broccoli and sweet potato mash. Omega-3s help reduce cortisol.', calories: 520 },
    { title: 'Chicken Stir-Fry', description: 'Chicken breast with colorful vegetables in a light ginger-garlic sauce over brown rice.', calories: 480 },
    { title: 'Turkey Meatballs & Zucchini Noodles', description: 'Lean turkey meatballs in marinara sauce over spiralized zucchini. Low-carb and satisfying.', calories: 440 },
    { title: 'Grilled Shrimp Tacos', description: 'Seasoned shrimp in corn tortillas with cabbage slaw and lime crema.', calories: 460 },
    { title: 'Baked Chicken Thighs', description: 'Herb-roasted chicken thighs with roasted root vegetables and a side salad.', calories: 510 },
    { title: 'Vegetable Curry', description: 'Coconut milk curry with chickpeas, spinach, and sweet potato over jasmine rice.', calories: 490 },
    { title: 'Lean Beef & Vegetable Stew', description: 'Slow-cooked beef with carrots, potatoes, and herbs. Comforting and nutrient-dense.', calories: 530 },
  ],
  snack: [
    { title: 'Apple & Almond Butter', description: 'Sliced apple with 2 tbsp natural almond butter. Healthy fats and fiber.', calories: 180 },
    { title: 'Trail Mix', description: 'Mixed nuts, dark chocolate chips, and dried cranberries. Magnesium helps reduce stress.', calories: 200 },
    { title: 'Veggie Sticks & Hummus', description: 'Carrots, celery, and bell pepper with homemade hummus.', calories: 150 },
    { title: 'Protein Smoothie', description: 'Whey protein, banana, spinach, and almond milk. Post-workout recovery.', calories: 220 },
    { title: 'Dark Chocolate & Berries', description: 'A square of 70%+ dark chocolate with fresh mixed berries. Antioxidant-rich.', calories: 160 },
    { title: 'Cottage Cheese & Pineapple', description: 'Low-fat cottage cheese with fresh pineapple chunks. High protein snack.', calories: 170 },
    { title: 'Rice Cakes & Avocado', description: 'Brown rice cakes topped with smashed avocado and everything seasoning.', calories: 190 },
  ],
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    const supabase = createAdminClient()

    // Get user onboarding data
    const { data: onboarding } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single()

    const mealsPerDay = onboarding?.daily_meals || 3
    const includeSnack = mealsPerDay >= 4

    // Generate 4 weeks of meal plans
    const mealPlans = []

    for (let week = 1; week <= 4; week++) {
      for (let day = 1; day <= 7; day++) {
        const mealTypes = includeSnack ? MEAL_TYPES : MEAL_TYPES.filter(t => t !== 'snack')

        for (const mealType of mealTypes) {
          const templates = MEAL_TEMPLATES[mealType]
          const shuffled = shuffleArray(templates)
          const meal = shuffled[0]

          mealPlans.push({
            user_id: userId,
            week_number: week,
            day_of_week: day,
            meal_type: mealType,
            title: meal.title,
            description: meal.description,
            calories: meal.calories,
          })
        }
      }
    }

    // Delete existing meal plans
    await supabase.from('meal_plans').delete().eq('user_id', userId)

    // Insert new ones in batches
    const batchSize = 50
    for (let i = 0; i < mealPlans.length; i += batchSize) {
      await supabase.from('meal_plans').insert(mealPlans.slice(i, i + batchSize))
    }

    return NextResponse.json({ success: true, count: mealPlans.length })
  } catch (error) {
    console.error('Meal plan generation error:', error)
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 })
  }
}
