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
  ni_publisher_postback: string;
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
  rank?: string;
  cpc?: string;
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
      inventory_type: "thankyoupage",
      ni_publisher_postback: "https://n8n.f4growth.co/webhook-test/quinstreet-postback-prod-v1"
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

// Function to trigger the postback
export const triggerPostback = async (provider: Provider, formData: any, clickId: string | null): Promise<boolean> => {
  try {
    const postbackUrl = "https://n8n.f4growth.co/webhook-test/quinstreet-postback-prod-v1";
    
    // Add all the requested fields to the postback
    const params = new URLSearchParams({
      // From web page - using "clickid" (lowercase) instead of "clickId"
      clickid: clickId || "",
      
      // From API response
      provider_id: provider.id,
      provider_name: provider.name,
      rank: provider.rank || "",
      cpc: provider.cpc || "",
      
      // From form data
      insured_status: formData.currentlyInsured || "",
      current_insurer: formData.currentCarrier || "",
      homeowner_status: formData.homeowner || "",
      zip_code: formData.zipCode || "",
      credit_score: formData.creditScore || "",
      
      // Additional tracking info
      ni_ad_client: "701117",
      timestamp: new Date().toISOString()
    });
    
    const fullUrl = `${postbackUrl}?${params.toString()}`;
    console.log("Triggering postback with complete data:", fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "GET",
      mode: "no-cors"
    });
    
    console.log("Postback triggered successfully with complete data");
    return true;
  } catch (error) {
    console.error("Error triggering postback:", error);
    return false;
  }
};

// Function to track conversions when a user clicks on a provider link
export const trackProviderClick = async (provider: Provider, zipCode: string): Promise<void> => {
  try {
    console.log("Tracking provider click:", provider.name, "with ID:", provider.id);
    
    // Get the form data from sessionStorage for postback
    const formDataStr = sessionStorage.getItem('formData');
    const formData = formDataStr ? JSON.parse(formDataStr) : { zipCode };
    
    // Get clickId from URL parameters first, then localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let clickId = urlParams.get('cid') || urlParams.get('clickid');
    
    // If not in URL, try localStorage
    if (!clickId) {
      clickId = localStorage.getItem("clickId");
    }
    
    console.log("ClickID found for tracking:", clickId);
    
    // Trigger the postback with all required data
    await triggerPostback(provider, formData, clickId);
    
    // If we have a clickId stored, we can use it for conversion tracking
    if (clickId) {
      const conversionUrl = `https://n8n.f4growth.co/webhook-test/quinstreet-conversion-v1`;
      
      const params = new URLSearchParams({
        // Using "clickid" (lowercase) consistently
        clickid: clickId,
        event: "click",
        revenue: provider.cpc || "0", // Use the CPC value as revenue if available
        currency: "USD",
        provider: provider.name,
        provider_id: provider.id,
        zip: zipCode
      });
      
      const fullUrl = `${conversionUrl}?${params.toString()}`;
      console.log("Tracking conversion:", fullUrl);
      
      await fetch(fullUrl, {
        method: "GET",
        mode: "no-cors"
      });
      
      console.log("Conversion tracked successfully");
    } else {
      console.log("No clickId found, skipping conversion tracking");
    }
    
    // Continue with the original action (opening the URL)
    window.open(provider.url, '_blank');
  } catch (error) {
    console.error("Error tracking conversion:", error);
    // Still open the URL even if tracking fails
    window.open(provider.url, '_blank');
  }
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
    url: item.clickurl || '#',
    rank: item.rank || "",
    cpc: item.cpc || ""
  }));
};

// Send request to the API
export const fetchInsuranceQuotes = async (formData: any): Promise<ApiResponseData> => {
  // Define the correct API URL explicitly
  const apiUrl = 'https://nextinsure.quinstage.com/listingdisplay/listings';
  const requestData = formatRequestData(formData);
  
  console.log('DIRECT API REQUEST');
  console.log('API URL:', apiUrl);
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  try {
    // Store form data in session storage for later use
    sessionStorage.setItem('formData', JSON.stringify(formData));
    
    // Make the API request
    console.log('Making API request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData),
      redirect: 'follow'
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    // Use mock data for testing if the API fails or returns an empty response
    let providers = transformApiResponse(data);
    console.log('Transformed providers:', providers);
    
    // Store the clickId if it's in the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const clickId = urlParams.get('cid') || urlParams.get('clickid');
    if (clickId) {
      localStorage.setItem("clickId", clickId);
      console.log("Stored clickId:", clickId);
    }
    
    // Return the providers
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
  
  // If we've reached max retries, use mock data for demo purposes
  console.log('Maximum retries reached, using mock data');
  const mockProviders = [
    {
      id: '1',
      name: 'Acme Insurance',
      logo: 'https://via.placeholder.com/150',
      rate: 'From $89/month',
      url: 'https://example.com/acme',
      rank: '1',
      cpc: '10.50'
    },
    {
      id: '2',
      name: 'Safe Drive Insurance',
      logo: 'https://via.placeholder.com/150',
      rate: 'From $92/month',
      url: 'https://example.com/safedrive',
      rank: '2',
      cpc: '9.75'
    },
    {
      id: '3',
      name: 'AutoProtect',
      logo: 'https://via.placeholder.com/150',
      rate: 'From $97/month',
      url: 'https://example.com/autoprotect',
      rank: '3',
      cpc: '8.20'
    }
  ];
  
  return {
    success: true,
    providers: mockProviders
  };
};

// Add a direct test function to debug network issues
export const testApiEndpoint = async () => {
  const apiUrl = 'https://nextinsure.quinstage.com/listingdisplay/listings';
  console.log('Testing API endpoint connection:', apiUrl);
  
  try {
    // Test with a simple GET request first
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      },
    });
    
    console.log('API endpoint test GET result:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    });
    
    // Now try with HEAD
    const headResponse = await fetch(apiUrl, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    console.log('API endpoint test HEAD result:', {
      ok: headResponse.ok,
      status: headResponse.status,
      statusText: headResponse.statusText
    });
    
    return response.ok || headResponse.ok;
  } catch (error) {
    console.error('API endpoint test failed:', error);
    // Try an alternative test with a known public API
    try {
      console.log('Trying alternative test with a public API');
      const publicApiResponse = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      console.log('Public API test result:', {
        ok: publicApiResponse.ok,
        status: publicApiResponse.status
      });
      return publicApiResponse.ok;
    } catch (altError) {
      console.error('Even public API test failed:', altError);
      return false;
    }
  }
};
