
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-brand-800 to-brand-900 py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-6">Last Updated: 02/12/2025</p>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              AutoRateSaver.com ("Company," "we," or "our") is committed to protecting your privacy and ensuring a secure user experience. This Privacy Policy explains how we collect, store, share, and use personal information provided by you on our website. It also details our practices regarding non-personal information. By accessing and using our website, you agree to the collection, use, and transfer of your personal and non-personal information as described in this Privacy Policy. If you do not agree with these terms, please refrain from using this website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p className="mb-4">
              We collect two types of information:
              <br />
              <strong>Personal Information:</strong> Includes details you voluntarily provide, such as your name, address, phone number, email, and payment details. If you decline to provide certain information, we may be unable to offer specific services.
              <br />
              <strong>Non-Personal Information:</strong> Includes data related to your browsing behavior, website usage, device details, IP address, and geographic location.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Collect Your Information</h2>
            <p className="mb-4">
              We gather information through:
              <br />
              <strong>Direct Submission:</strong> When you register, request services, or communicate with us.
              <br />
              <strong>Automated Technologies:</strong> Cookies, web beacons, log files, and other tracking tools that collect website usage data.
              <br />
              <strong>Third-Party Services:</strong> Analytics providers and service partners who assist in enhancing our website's performance and marketing efforts.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">Your information is used to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our services and website functionality.</li>
              <li>Process transactions and deliver requested products or services.</li>
              <li>Personalize content, advertisements, and user experience.</li>
              <li>Communicate marketing offers, promotions, and service updates.</li>
              <li>Comply with legal requirements and resolve disputes.</li>
            </ul>
            <p className="mb-4">
              You may opt out of marketing communications at any time by clicking the "unsubscribe" link in our emails or contacting us directly.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Sharing of Information</h2>
            <p className="mb-2">
              We share your information with third parties only under the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service Providers: Third-party vendors who assist in website operation, marketing, payment processing, and customer service.</li>
              <li>Business Transfers: In the event of a merger, acquisition, or asset sale.</li>
              <li>Legal Compliance: If required by law, to protect our rights, or to prevent fraud.</li>
              <li>Marketing Partners: With affiliates or third-party advertisers who may send offers relevant to your interests.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance user experience and gather website analytics. You can manage cookie preferences through your browser settings, but disabling cookies may limit website functionality.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h2>
            <p className="mb-4">
              We implement security measures to protect your information from unauthorized access and misuse. While we strive to safeguard your data, no online transmission is entirely secure. Use of our website is at your own risk.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Your Rights and Choices</h2>
            <p className="mb-2">Depending on your location, you may have rights to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access, modify, or delete your personal information.</li>
              <li>Opt out of marketing communications.</li>
              <li>Request that we do not sell your information.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Third-Party Links and Services</h2>
            <p className="mb-4">
              Our website may contain links to external sites. We are not responsible for the privacy practices of third-party websites. Please review their privacy policies separately.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Children's Privacy</h2>
            <p className="mb-4">
              Our website is not intended for users under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us immediately.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. International Data Transfers</h2>
            <p className="mb-4">
              If you access our website outside the U.S., your information may be transferred and stored in jurisdictions with different privacy laws. We take necessary measures to ensure your data remains protected.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">11. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated "Last Updated" date. Continued use of our website constitutes acceptance of these changes.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white/70 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <div className="flex justify-center gap-4 mb-2">
            <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <Link to="/terms" className="hover:text-brand-400 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} AutoRateSaver. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
