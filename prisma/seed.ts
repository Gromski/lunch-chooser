import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed DietaryRequirements
  const dietaryRequirements = [
    { id: 'diet_vegetarian', name: 'vegetarian', description: 'No meat or fish' },
    { id: 'diet_vegan', name: 'vegan', description: 'No animal products' },
    { id: 'diet_gluten-free', name: 'gluten-free', description: 'No gluten-containing ingredients' },
    { id: 'diet_dairy-free', name: 'dairy-free', description: 'No dairy products' },
    { id: 'diet_nut-free', name: 'nut-free', description: 'No nuts' },
    { id: 'diet_halal', name: 'halal', description: 'Halal-certified food' },
    { id: 'diet_kosher', name: 'kosher', description: 'Kosher-certified food' },
    { id: 'diet_pescatarian', name: 'pescatarian', description: 'Fish but no meat' },
  ]

  for (const requirement of dietaryRequirements) {
    await prisma.dietaryRequirement.upsert({
      where: { id: requirement.id },
      update: {},
      create: requirement,
    })
  }

  console.log(`✅ Seeded ${dietaryRequirements.length} dietary requirements`)

  // Seed RestaurantCategories
  const restaurantCategories = [
    { id: 'cat_italian', name: 'Italian', slug: 'italian', description: 'Italian cuisine' },
    { id: 'cat_asian', name: 'Asian', slug: 'asian', description: 'Asian cuisine' },
    { id: 'cat_mexican', name: 'Mexican', slug: 'mexican', description: 'Mexican cuisine' },
    { id: 'cat_american', name: 'American', slug: 'american', description: 'American cuisine' },
    { id: 'cat_sandwiches', name: 'Sandwiches', slug: 'sandwiches', description: 'Sandwich shops' },
    { id: 'cat_pizza', name: 'Pizza', slug: 'pizza', description: 'Pizza restaurants' },
    { id: 'cat_seafood', name: 'Seafood', slug: 'seafood', description: 'Seafood restaurants' },
    { id: 'cat_vegetarian', name: 'Vegetarian', slug: 'vegetarian', description: 'Vegetarian restaurants' },
  ]

  for (const category of restaurantCategories) {
    await prisma.restaurantCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    })
  }

  console.log(`✅ Seeded ${restaurantCategories.length} restaurant categories`)

  console.log('✨ Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

