
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
  console.log('Starting API request process with form data:', formData);
  
  // Remove any existing data to avoid confusion
  sessionStorage.removeItem('insuranceProviders');
  
  let retries = 0;
  let success = false;
  let responseData = null;
  
  const apiUrl = 'https://api.findinsuranceoffers.com/v1/insurance/auto';
  
  while (!success && retries < maxRetries) {
    try {
      console.log(`API attempt ${retries + 1}/${maxRetries}`);
      
      // Format the request body according to what the API expects
      const requestBody = {
        zipCode: formData.zipCode,
        vehicleCount: formData.vehicleCount,
        homeowner: formData.homeowner === 'Yes',
        currentlyInsured: formData.currentlyInsured === 'Yes',
        currentCarrier: formData.currentCarrier || null,
        creditScore: formData.creditScore?.toLowerCase() || 'good',
        militaryAffiliation: formData.militaryAffiliation === 'Yes'
      };
      
      console.log('Sending API request with body:', JSON.stringify(requestBody));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-Key': 'TQecSzP3TZm3uzvU7SqP9u4aH9vVu7T8',
          'Origin': window.location.origin
        },
        body: JSON.stringify(requestBody),
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);
        responseData = data;
        success = true;
      } else {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        
        if (response.status === 400) {
          console.log('Received 400 error, checking response body for details');
          try {
            const errorJson = JSON.parse(errorText);
            console.log('Parsed error response:', errorJson);
          } catch (e) {
            console.log('Could not parse error response as JSON:', errorText);
          }
        }
        
        retries++;
        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    } catch (error) {
      console.error('API request failed with error:', error);
      retries++;
      if (retries < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  if (!success) {
    console.error('All API attempts failed');
    return { 
      success: false, 
      providers: [], 
      useAlternateResults: false 
    };
  }
  
  // Process the API response
  const listings = responseData?.listing || [];
  console.log(`Processing ${listings.length} providers from API response`);
  
  const providers: Provider[] = listings.map((item: any, index: number) => ({
    id: item.vendorKey || String(index + 1),
    name: item.displayname || item.company || 'Insurance Provider',
    cpc: item.cpc || '0.00',
    rank: item.rank || String(index + 1),
    rate: item.title || 'Contact for rates',
    url: item.clickUrl || item.img_pixel || '#',
    logo: item.logo || ''
  }));
  
  console.log('Transformed providers from API data:', providers);
  
  // Fall back to some testing data only if API returned no providers
  if (providers.length === 0) {
    console.warn('API returned no providers, falling back to testing data');
    
    // Sample testing data to ensure the app still works
    const testProviders: Provider[] = [
      {
        id: '1',
        name: 'Elephant Insurance',
        cpc: 4.30,
        rank: 1,
        rate: 'Get Instant Quote for Elephant',
        url: 'https://www.elephant.com',
        logo: 'https://www.insurancespecialists.com/wp-content/uploads/2020/06/elephant-insurance.jpg'
      },
      {
        id: '2',
        name: 'Ultimate Insurance',
        cpc: 4.00,
        rank: 2,
        rate: 'Insurance As Low As $419/Mo',
        url: 'https://ultimateinsurance.com',
        logo: 'https://insurancethoughtleadership.com/wp-content/uploads/2020/02/cropped-ITL-logo-w-background-100.jpg'
      },
      {
        id: '3',
        name: 'Branch Insurance',
        cpc: 3.80,
        rank: 3,
        rate: 'Bundle insurance with Branch',
        url: 'https://branch.com',
        logo: 'https://hireandretire.com/wp-content/uploads/2023/08/Branch-Insurance-Company-Review-2022.jpg'
      }
    ];
    
    sessionStorage.setItem('insuranceProviders', JSON.stringify(testProviders));
    console.log('Stored fallback providers in sessionStorage:', testProviders);
    
    // Use alternate results for fallback data
    return { 
      success: true, 
      providers: testProviders, 
      useAlternateResults: true 
    };
  }
  
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
};
