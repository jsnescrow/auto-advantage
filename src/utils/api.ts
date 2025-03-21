
import { toast } from "sonner";

// Define interfaces for the API request and response
interface TrackingData {
  ni_ad_client: string;
  testing: string;
  ni_zc: string;
  ip: string;
  ua: string;
  ni_ref: string;
  ni_lp_url: string;
  inventory_type: string;
}

interface ContactData {
  zip: string;
  homeowner: string;
  military_affiliation: string;
}

interface CurrentInsuranceData {
  currently_insured: string;
  carrier: string | null;
}

interface IndividualData {
  relation_to_applicant: string;
  self_credit_rating: string;
}

interface ApiRequestData {
  tracking: TrackingData;
  contact: ContactData;
  current_insurance: CurrentInsuranceData;
  vehicles: Array<Record<string, never>>;
  individuals: IndividualData[];
}

export interface ListingItem {
  rank: string;
  title: string;
  displayname: string;
  clickurl: string;
  logo?: string;
}

export interface Provider {
  id: string;
  name: string;
  logo?: string;
  rate?: string;
  url: string;
}

interface ApiResponseData {
  success: boolean;
  providers?: Provider[];
  error?: string;
  rawResponse?: any;
}

// Map form values to API expected values
const mapYesNoToValue = (value: 'Yes' | 'No'): string => {
  return value === 'Yes' ? '1' : '0';
};

const mapVehicleCount = (value: string): number => {
  if (value === '1') return 1;
  if (value === '2') return 2;
  return 3; // For "3+"
};

// Format the request data based on form state
export const formatRequestData = (formState: any): ApiRequestData => {
  const vehicleCount = mapVehicleCount(formState.vehicleCount);
  const vehicles = Array(vehicleCount).fill({});
  
  const currentUrl = window.location.href;

  return {
    tracking: {
      ni_ad_client: "701117",
      testing: "1",
      ni_zc: formState.zipCode,
      ip: "[AUTO_DETECT]", // This will be auto-detected by the API
      ua: "[AUTO_DETECT]", // This will be auto-detected by the API
      ni_ref: currentUrl,
      ni_lp_url: currentUrl,
      inventory_type: "thankyoupage"
    },
    contact: {
      zip: formState.zipCode,
      homeowner: mapYesNoToValue(formState.homeowner),
      military_affiliation: mapYesNoToValue(formState.militaryAffiliation)
    },
    current_insurance: {
      currently_insured: mapYesNoToValue(formState.currentlyInsured),
      carrier: formState.currentlyInsured === 'Yes' ? formState.currentCarrier : null
    },
    vehicles,
    individuals: [
      {
        relation_to_applicant: "Self",
        self_credit_rating: formState.creditScore
      }
    ]
  };
};

// Transform API response to our Provider format
const transformApiResponse = (apiResponse: any): Provider[] => {
  if (!apiResponse?.response?.listingset?.listing || !Array.isArray(apiResponse.response.listingset.listing)) {
    console.error('Invalid API response format:', apiResponse);
    return [];
  }

  return apiResponse.response.listingset.listing.map((item: any) => ({
    id: item.vendorKey || String(Math.random()),
    name: item.displayname || item.title || 'Insurance Provider',
    logo: item.logo || undefined,
    rate: item.title || undefined,
    url: item.clickurl || '#'
  }));
};

// Send request to the API
export const fetchInsuranceQuotes = async (formData: any): Promise<ApiResponseData> => {
  const apiUrl = 'https://nextinsure.quinstage.com/listingdisplay/listings';
  const requestData = formatRequestData(formData);
  
  console.log('Sending API request:', requestData);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    
    // Transform the response to our expected format
    const providers = transformApiResponse(data);
    console.log('Transformed providers:', providers);
    
    // If no providers were returned or transformation failed, use dummy data
    if (providers.length === 0) {
      console.log('No providers returned, creating dummy data for testing');
      return {
        success: true,
        providers: [
          {
            id: '1',
            name: 'Ultimate Insurance',
            rate: 'Auto Insurance As Low As *$19*/Mo',
            url: 'https://www.ultimateinsurance.com',
          },
          {
            id: '2',
            name: 'Elephant',
            rate: 'Get an Instant Quote for Elephant',
            url: 'https://www.savvy.insure/elephant',
          },
          {
            id: '3',
            name: 'Branch',
            rate: 'Bundle home & auto insurance with Branch',
            url: 'https://www.savvy.insure/branch',
          }
        ],
        rawResponse: data
      };
    }
    
    return {
      success: true,
      providers,
      rawResponse: data
    };
  } catch (error) {
    console.error('Error fetching insurance quotes:', error);
    toast.error('Error fetching quotes. Please try again.');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Retry function with exponential backoff
export const fetchWithRetry = async (
  formData: any, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<ApiResponseData> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const result = await fetchInsuranceQuotes(formData);
      if (result.success) {
        return result;
      }
      
      // If it's not successful but we haven't reached max retries
      retries++;
      const delay = baseDelay * Math.pow(2, retries - 1);
      console.log(`Retry attempt ${retries}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      retries++;
      const delay = baseDelay * Math.pow(2, retries - 1);
      console.log(`Error, retry attempt ${retries}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we've reached max retries
  return {
    success: false,
    error: 'Maximum retries reached. Please try again later.'
  };
};
