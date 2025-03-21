
import { FormState } from '@/context/FormContext';

export interface Provider {
  id: string;
  name: string;
  cpc?: string | number;
  rank?: string | number;
  rate?: string;
  url: string;
  logo?: string;
}

export const trackProviderClick = (provider: Provider, zipCode: string) => {
  // Log the click for tracking
  console.log(`Tracking click for provider: ${provider.name}`);
  console.log(`Provider data: ID=${provider.id}, Rank=${provider.rank}, CPC=${provider.cpc}`);
  console.log(`User zip code: ${zipCode}`);
  
  // In a real implementation, this would send data to a tracking endpoint
  // For now, just open the URL after a short delay to simulate the tracking call
  setTimeout(() => {
    window.open(provider.url, '_blank');
  }, 100);
  
  return true;
};

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
      
      // For testing, make this always succeed
      const success = true;
      
      if (success) {
        console.log('Data fetch successful.');
        
        // Mock insurance providers data - create exactly 3 providers as required
        const providers: Provider[] = [
          { id: '1', name: 'Insurance Provider A', cpc: 7.50, rank: '1', url: 'https://example.com/provider-a' },
          { id: '2', name: 'Insurance Provider B', cpc: 5.25, rank: '2', url: 'https://example.com/provider-b' },
          { id: '3', name: 'Insurance Provider C', cpc: 4.75, rank: '3', url: 'https://example.com/provider-c' },
        ];
        
        // Check CPC value of the top provider to determine which results page to show
        const topProviderCpc = typeof providers[0].cpc === 'number' 
          ? providers[0].cpc 
          : parseFloat(providers[0].cpc as string);
          
        const shouldUseAlternateResults = topProviderCpc < 6;
        
        // Store the providers in sessionStorage for use in the results pages
        sessionStorage.setItem('insuranceProviders', JSON.stringify(providers));
        console.log('Stored providers in sessionStorage:', providers);
        
        return { 
          success: true, 
          providers: providers,
          useAlternateResults: shouldUseAlternateResults
        };
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
  return { success: false, providers: [], useAlternateResults: false };
};
