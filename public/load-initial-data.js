// Auto-load initial data on app start if localStorage is empty
(function() {
  const STORAGE_KEY = 'family-meal-planner-data';
  
  // Check if localStorage is empty
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    console.log('Loading initial meal data...');
    
    fetch('/initial-data.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('✅ Initial data loaded! Meals:', data.meals.length);
        console.log('Meals:', data.meals.map(m => m.name).join(', '));
        // Reload to apply changes
        setTimeout(() => location.reload(), 500);
      })
      .catch(error => console.error('Error loading initial data:', error));
  }
})();
