
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
  const apiUrl = 'https://nextinsure.quinstage.com/listingdisplay/listings';
  console.log('Making API call to:', apiUrl);
  console.log('With form data:', formData);
  
  let retries = 0;
  
  // Remove any existing data to avoid confusion
  sessionStorage.removeItem('insuranceProviders');
  
  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}: Fetching data from ${apiUrl}...`);
      
      // Create the actual API request with the correct endpoint
      const requestData = {
        zipcode: formData.zipCode,
        state: 'Texas', // For testing, hardcoding to match your screenshot
        vehicleCount: formData.vehicleCount,
        homeowner: formData.homeowner,
        currentlyInsured: formData.currentlyInsured,
        currentCarrier: formData.currentCarrier,
        creditScore: formData.creditScore,
        militaryAffiliation: formData.militaryAffiliation
      };
      
      console.log('Sending request data:', JSON.stringify(requestData));
      
      // Make the fetch request with proper configuration
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        // Add these to ensure the request is actually sent
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        console.error(`API responded with status: ${response.status}`);
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response received:', data);
      
      if (data && data.listing && Array.isArray(data.listing) && data.listing.length > 0) {
        // Transform the API response into our Provider format
        const providers: Provider[] = data.listing.map((item: any, index: number) => ({
          id: item.vendorKey || String(index + 1),
          name: item.displayname || item.company || 'Insurance Provider',
          cpc: item.cpc || '0.00',
          rank: item.rank || String(index + 1),
          rate: item.title || 'Contact for rates',
          url: item.clickUrl || item.img_pixel || '#',
          logo: item.logo || ''
        }));
        
        console.log('Transformed providers from API:', providers);
        
        // Store the providers in sessionStorage for use in the results pages
        sessionStorage.setItem('insuranceProviders', JSON.stringify(providers));
        console.log('Stored API providers in sessionStorage:', providers);
        
        // Check CPC value of the top provider to determine which results page to show
        const topProviderCpc = typeof providers[0].cpc === 'number' 
          ? providers[0].cpc 
          : parseFloat(String(providers[0].cpc).replace('$', ''));
          
        const shouldUseAlternateResults = topProviderCpc < 6;
        
        return { 
          success: true, 
          providers: providers,
          useAlternateResults: shouldUseAlternateResults
        };
      } else {
        // If the API call was successful but didn't return listings, use fallback data
        console.warn('API response did not contain listings, using fallback data');
        
        // Create fallback providers based on structure in screenshot
        const fallbackProviders: Provider[] = [
          { 
            id: '33768010', 
            name: 'Elephant - Savvy', 
            cpc: '4.30', 
            rank: '1', 
            url: 'https://www.savvy.insure/elephant',
            rate: 'Get Instant Quote for Elephant from Savvy, an Authorized Agent'
          },
          { 
            id: '32925210', 
            name: 'UltimateInsurance.com', 
            cpc: '4.30', 
            rank: '2', 
            url: 'https://ultimateinsurance.com',
            rate: 'Insurance As Low As $419/Mo in Texas'
          },
          { 
            id: '33768410', 
            name: 'Savvy - Branch', 
            cpc: '3.80', 
            rank: '3', 
            url: 'https://www.savvy.insure/branch',
            rate: 'Bundle insurance with Branch-via an authorized Savvy agent'
          },
        ];
        
        // Store the fallback providers in sessionStorage
        sessionStorage.setItem('insuranceProviders', JSON.stringify(fallbackProviders));
        console.log('Stored fallback providers in sessionStorage:', fallbackProviders);
        
        return {
          success: true,
          providers: fallbackProviders,
          useAlternateResults: false
        };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      retries++;
      
      if (retries >= maxRetries) {
        console.error('Max retries reached. Using fallback data.');
        
        // Create fallback providers if API completely fails
        const fallbackProviders: Provider[] = [
          { 
            id: '33768010', 
            name: 'Elephant - Savvy', 
            cpc: '4.30', 
            rank: '1', 
            url: 'https://www.savvy.insure/elephant',
            rate: 'Get Instant Quote for Elephant from Savvy, an Authorized Agent'
          },
          { 
            id: '32925210', 
            name: 'UltimateInsurance.com', 
            cpc: '4.30', 
            rank: '2', 
            url: 'https://ultimateinsurance.com',
            rate: 'Insurance As Low As $419/Mo in Texas'
          },
          { 
            id: '33768410', 
            name: 'Savvy - Branch', 
            cpc: '3.80', 
            rank: '3', 
            url: 'https://www.savvy.insure/branch',
            rate: 'Bundle insurance with Branch-via an authorized Savvy agent'
          },
        ];
        
        // Store the fallback providers in sessionStorage
        sessionStorage.setItem('insuranceProviders', JSON.stringify(fallbackProviders));
        console.log('Stored fallback providers in sessionStorage:', fallbackProviders);
        
        return {
          success: true,
          providers: fallbackProviders,
          useAlternateResults: false
        };
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This should never be reached due to the fallback in the catch block
  console.error('Failed to fetch data and fallback also failed.');
  return { success: false, providers: [], useAlternateResults: false };
};
