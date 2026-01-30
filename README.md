# 🍽️ Family Meal Planner

A comprehensive meal planning application designed specifically for German families, featuring weekly meal planning, shopping list generation for German supermarkets (Edeka, Rewe, Aldi, Lidl), picky eater tracking, and HelloFresh integration.

## ✨ Features

### 📅 Weekly Meal Planner
- Plan meals for the entire week (Monday-Sunday)
- Organize meals by breakfast, lunch, and dinner
- Add custom recipes with ingredients, servings, prep time
- Track how many times each meal has been cooked
- Rate your meals (1-5 stars)
- Categorize meals (breakfast, lunch, dinner, snacks)

### 🛒 Shopping List Generator
- Automatically generate shopping lists from your weekly plan
- Organize items by supermarket (Edeka, Rewe, Aldi, Lidl, etc.)
- Group items by category for easier shopping
- Check off items as you shop
- Add manual items to the list
- Clear completed items with one click

### 👧 Picky Eater Tracker
- Track what your child likes and dislikes
- Record tried foods with detailed reactions:
  - ❤️ Loved
  - 👍 Liked
  - 😐 Neutral
  - 👎 Disliked
  - 🙅 Refused
- Add notes about each food experience
- Mark foods to try again
- Track allergies
- View success rate and progress statistics

### 👨‍🍳 HelloFresh Integration
- Import HelloFresh recipes
- Rate HelloFresh meals
- Add notes to recipes
- Convert HelloFresh recipes to regular meals
- Track which recipes you've tried
- View average ratings and statistics

### 📊 Statistics Dashboard
- Most frequently cooked meals
- Top-rated meals
- Meals by category breakdown
- Average cost per meal
- Total cooking costs
- Picky eater progress tracking
- HelloFresh usage statistics
- Success rate with new foods

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### 1. Creating Your First Meal

1. Go to the **Wochenplan** (Weekly Planner) tab
2. Click **"Neues Gericht"** (New Meal)
3. Fill in the meal details:
   - Name (required)
   - Description
   - Number of servings
   - Category (breakfast/lunch/dinner/snack)
4. Click **Speichern** (Save)

### 2. Planning Your Week

1. In the **Wochenplan** tab, select the week using the week picker
2. For each day, click on a meal slot (Frühstück/Mittagessen/Abendessen)
3. Select a meal from the dropdown
4. The meal will be added to that day

### 3. Generating Shopping Lists

1. After planning your week, go to **Einkaufsliste** (Shopping List)
2. Click **"Aus Wochenplan generieren"** (Generate from Weekly Plan)
3. All ingredients from your planned meals will be automatically added
4. Filter by supermarket to organize your shopping trip
5. Check off items as you shop

### 4. Tracking Picky Eater Progress

1. Go to **Essgewohnheiten** (Eating Habits)
2. Click **"Neues Lebensmittel probiert"** (New Food Tried)
3. Enter the food name and select the reaction
4. Add optional notes
5. Decide if you'll try it again
6. View progress in the **Probiert** (Tried), **Mag ich** (Likes), and **Mag ich nicht** (Dislikes) tabs

### 5. Importing HelloFresh Recipes

1. Go to **HelloFresh** tab
2. Click **"Rezept importieren"** (Import Recipe)
3. Enter the recipe name and HelloFresh ID (found on the recipe card)
4. Rate the recipe with stars
5. Add notes about your experience
6. Convert to a regular meal if you want to cook it again

### 6. Viewing Statistics

1. Go to **Statistiken** (Statistics)
2. View comprehensive insights:
   - Total meals and cooking frequency
   - Average ratings and costs
   - Most popular meals
   - Category distribution
   - Picky eater success rate
   - HelloFresh usage

## 💾 Data Storage

All data is stored locally in your browser using **localStorage**. This means:
- ✅ Your data never leaves your device
- ✅ No account or login required
- ✅ Works completely offline
- ⚠️ Clearing browser data will delete all meals and plans
- ⚠️ Data is device-specific (not synced across devices)

### Backing Up Your Data

To export your data:
1. Open browser Developer Tools (F12)
2. Go to Console
3. Type: `localStorage.getItem('family-meal-planner-data')`
4. Copy the output and save it to a file

To import data:
1. Open browser Developer Tools (F12)
2. Go to Console
3. Type: `localStorage.setItem('family-meal-planner-data', 'YOUR_DATA_HERE')`
4. Refresh the page

## 🛠️ Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Storage:** LocalStorage API

## 🎨 Customization

### Changing Child Information
Click "bearbeiten" (edit) next to the child's name in the Picky Eater section to update name and age.

### Adding More Supermarkets
Edit `src/components/ShoppingList.tsx` and add your supermarket to the `supermarkets` array.

### Modifying Categories
Edit the category options in `src/types.ts` and update the UI components accordingly.

## 🐛 Troubleshooting

### Data Not Persisting
- Ensure cookies/localStorage are enabled in your browser
- Check if you're in private/incognito mode (data won't persist)

### Shopping List Not Generating
- Make sure your meals have ingredients added
- Verify that you have meals planned for the current week

### Performance Issues
- If you have hundreds of meals, consider archiving old ones
- Clear your browser cache

## 📝 Future Improvements

Potential features to add:
- Nutrition tracking and goals
- Multi-child support
- Meal templates and favorites
- Photo uploads for meals
- Print-friendly shopping lists
- Recipe scaling
- Meal prep schedules
- Leftover tracking
- Budget planning

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Made with ❤️ for families who love good food and organization**
