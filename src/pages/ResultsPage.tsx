import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import ResultCard from '@/components/ResultCard';
import FormCard from '@/components/FormCard';
import { useFormContext } from '@/context/FormContext';
import { Provider } from '@/utils/api';
import { Link } from 'react-router-dom';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { formState, resetForm } = useFormContext();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formState) {
      sessionStorage.setItem('formData', JSON.stringify(formState));
    }
    
    const storedProviders = sessionStorage.getItem('insuranceProviders');
    
    if (storedProviders) {
      try {
        const parsedProviders = JSON.parse(storedProviders);
        setProviders(parsedProviders);
      } catch (error) {
        console.error('Error parsing providers:', error);
      }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const clickId = urlParams.get('cid') || urlParams.get('clickid');
    if (clickId) {
      localStorage.setItem("clickId", clickId);
      console.log("Stored clickId from URL:", clickId);
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formState]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <div className="max-w-4xl mx-auto flex justify-center">
            <div className="animate-pulse w-full">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-grow">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto">
                      <div className="h-10 bg-gray-200 rounded w-full md:w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Your Top Car Insurance Matches
            </h1>
          </div>
          
          {providers.length > 0 ? (
            <div className="space-y-6 animate-fade-in mb-12">
              {providers.map((provider, index) => (
                <ResultCard 
                  key={provider.id} 
                  provider={provider} 
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <FormCard className="text-center py-12 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-brand-500 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h2 className="text-2xl font-bold mb-4">No Matches Found</h2>
              <p className="text-gray-600 mb-8">
                We couldn't find any insurance providers that match your criteria. Try adjusting your information to see more options.
              </p>
              <button 
                onClick={() => {
                  resetForm();
                  navigate('/');
                }}
                className="bg-brand-500 hover:bg-brand-600 text-white py-2 px-4 rounded-md font-medium"
              >
                Start Over
              </button>
            </FormCard>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Car Insurance: Your Complete Guide</h2>
            
            <div className="space-y-6 text-gray-700 mb-10">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Your Car Insurance Requirements</h3>
                <p className="mb-4">
                  Most states require drivers to carry auto insurance, with only New Hampshire and Virginia offering alternatives. For states where it's required, you'll need to maintain minimum coverage levels to legally operate your vehicle.
                </p>
                <p>
                  The foundation of most policies is liability coverage, but many drivers choose to enhance their protection with additional coverage options.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Main Types of Auto Insurance Coverage</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Liability Protection</h4>
                    <p>Liability insurance consists of two key components: bodily injury coverage and property damage coverage. The first helps pay for others' medical expenses if you're at fault in an accident, while the second covers damage you cause to other vehicles or property.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Collision Protection</h4>
                    <p>While liability covers damage to others' property, collision insurance protects your own vehicle in accidents involving other cars or objects. Though not legally required, lenders often mandate this coverage for financed vehicles.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Comprehensive Coverage</h4>
                    <p>This protection handles non-collision related damage to your vehicle, including theft, weather damage, vandalism, and animal collisions. While optional by law, it provides valuable protection against unexpected events. Like collision coverage, lenders may require it for financed vehicles.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Personal Injury Coverage (PIP)</h4>
                    <p>PIP helps cover medical expenses and related costs if you're injured in an accident, regardless of fault. It's required in eleven states: New York, New Jersey, Massachusetts, Florida, Michigan, Kentucky, Kansas, Minnesota, Oregon, Utah, and Hawaii.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Medical Coverage Options</h4>
                    <p>Medical payments coverage provides more focused medical expense protection than PIP but isn't required by law. Insurance providers typically offer it as an alternative to PIP coverage, not as a supplement.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Protection Against Uninsured Drivers</h4>
                    <p>With millions of drivers on the road, some unfortunately drive without proper insurance. Uninsured/underinsured motorist coverage provides affordable protection against such situations, including hit-and-run incidents. While 15 states require this coverage, it's optional but recommended in others.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Additional Coverage Options</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">24/7 Roadside Support</h4>
                    <p>Many insurers partner with service networks to provide comprehensive roadside assistance. This optional coverage typically includes services like towing, tire changes, battery jumps, fuel delivery, lockout assistance, and winching/extraction if your vehicle becomes stuck.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Vehicle Value Protection</h4>
                    <p>As vehicles become more expensive, gap insurance has grown in popularity. This coverage bridges the financial gap between your car's actual value and your remaining loan balance after an accident. A similar option, lease/loan coverage, specifically protects those with leased vehicles.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Rideshare Driver Protection</h4>
                    <p>Designed for the modern sharing economy, this specialized coverage protects drivers working with services like Uber, Lyft, and similar platforms. Coverage typically activates when transporting passengers.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Specialty Vehicle Coverage</h4>
                    <p>Designed for vintage, classic, and collector vehicles, this specialized insurance comes with specific requirements: garage parking, limited use as a secondary vehicle, and maintaining the vehicle in excellent condition.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Temporary Transportation Coverage</h4>
                    <p>This practical add-on covers rental car expenses while your vehicle undergoes covered repairs.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Aftermarket Equipment Protection</h4>
                    <p>Safeguards your investment in vehicle modifications and additions, such as custom audio systems or specialty wheels. This coverage specifically protects equipment you've added, rather than factory-installed features.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Factors Affecting Your Insurance Rates</h3>
                <p className="mb-4">Understanding what influences your premium can help you find better rates. Modern comparison tools make it easy to evaluate multiple providers and find competitive quotes that match your needs.</p>
                <p className="italic mb-4">Remember: The lowest price isn't always the best value. While cost matters, each insurer evaluates risk factors differently, resulting in varying premiums for similar coverage.</p>
                <p className="mb-3">Here are the primary factors insurers consider when calculating your rates:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Geographic Area: Your location significantly impacts rates - urban drivers typically pay more than rural ones due to higher traffic density, accident frequency, and theft rates.</li>
                  <li>Driver Age: Insurance costs typically decrease as you age and gain experience. New drivers, particularly teenagers, face higher premiums due to their increased accident risk.</li>
                  <li>Gender Factors: Statistical risk differences mean younger male drivers often see higher rates than their female counterparts, though this gap typically diminishes with age.</li>
                  <li>Financial History: Your credit rating can influence premiums, as insurers view financial responsibility as an indicator of risk behavior.</li>
                  <li>Safety Record: Your history of accidents and traffic violations directly affects your insurance costs.</li>
                  <li>Insurance History: A clean claims record often leads to lower premiums.</li>
                  <li>Car Specifications: Your vehicle's age, value, safety features, and repair costs all factor into premium calculations.</li>
                  <li>Policy Parameters: Higher coverage limits increase protection but also raise premiums.</li>
                  <li>Cost-Sharing Choice: Opting for a higher deductible typically reduces your premium but increases your out-of-pocket expenses if you file a claim.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 text-gray-600 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm mb-6">
              <p className="mb-4">
                The products on the websites (and any subdomains of those websites) listed above are from companies from which we may receive compensation. Compensation may impact where products appear on these websites (including the order in which they appear). These websites do not include all insurance companies or all types of products available in the marketplace. We encourage you to research all available insurance options for your situation.
              </p>
              <p>
                Disclaimer: The operator of this website is not an insurance broker or an insurance company, is not a representative or an agent to any broker or insurance company, does not endorse any particular broker or insurance provider, and does not make any insurance decisions. We will submit the information you provide to a broker and/or an insurance company. This website does not constitute an offer or solicitation for automobile or other insurance. Providing your information on this site does not guarantee that you will be approved for automobile or other insurance. Not all insurance providers can or will insure your vehicle. The quotes, rates, or savings advertised on this website are not necessarily available from all providers or advertisers. Your actual quotes, rates, or savings will vary based on many different factors like: Coverage Limits, Deductibles, Driving History, Education, Occupation Type, Vehicle Location, and more. For questions regarding your insurance policy, please contact your broker or insurance company directly. Residents of some states may not be eligible for insurance or may be subject to large premiums. You are under no obligation to use our website or service to initiate contact nor apply for insurance or any product with any broker or insurance company. We receive compensation in the form of referral fees from the insurance carriers, aggregators, or other offers that we direct you to. Therefore, the amount of compensation provided, along with other factors, may impact which policy or offer you are presented. The offer you receive may be coming from the company that bid the most for your information. This website does not always provide you with an offer with the best rates or terms. Our website does not include all companies or all available offers. We encourage you to research all available insurance policy options relative to your situation. All trademarks and copyrights are the property of their respective owners.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-600">
              <Link to="/terms" className="hover:text-brand-800 transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-brand-800 transition-colors">Privacy Policy</Link>
            </div>
            <div className="text-center mt-6 text-sm">
              &copy; {new Date().getFullYear()} AutoRateSaver. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultsPage;
