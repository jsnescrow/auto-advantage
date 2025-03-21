import { FormState } from '@/context/FormContext';

export const fetchWithRetry = async (
  formData: any,
  maxRetries: number = 3,
  retryDelay: number = 1000
) => {
  // Simulate an API endpoint that might fail
  let retries = 0;
  while (retries < maxRetries) {
    try {
      // Simulate API call
      console.log(`Attempt ${retries + 1}: Fetching data...`);
      
      // Simulate different outcomes (success or failure)
      const success = Math.random() > 0.2; // 80% chance of success
      
      if (success) {
        console.log('Data fetch successful.');
        
        // Mock insurance providers data
        const providers = [
          { id: 1, name: 'Insurance Provider A', cpc: 7.50, rank: 1 },
          { id: 2, name: 'Insurance Provider B', cpc: 5.25, rank: 2 },
          { id: 3, name: 'Insurance Provider C', cpc: 4.75, rank: 3 },
          { id: 4, name: 'Insurance Provider D', cpc: 3.50, rank: 4 },
          { id: 5, name: 'Insurance Provider E', cpc: 2.25, rank: 5 },
        ];
        
        return { success: true, providers: providers };
      } else {
        console.log('Data fetch failed. Retrying...');
        retries++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  console.error('Max retries reached. Fetch failed.');
  return { success: false, providers: [] };
  
  // This is a mock implementation if needed for testing
  // In a real scenario, this would make actual API calls to fetch insurance providers
  
};
