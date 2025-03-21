
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const TermsPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-500 mb-6">Last Updated: 02/12/2025</p>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Welcome to AutoRateSaver.com ("Company," "we," "our," or "us"). By accessing or using our website and services, you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please refrain from using our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Use of the Website</h2>
            <p className="mb-4">
              By using this website, you confirm that you are at least 18 years old or have legal parental or guardian consent to use our services. You agree to use this website in accordance with all applicable laws and regulations.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Services Provided</h2>
            <p className="mb-4">
              AutoRateSaver.com provides information and resources related to auto insurance savings. We do not provide insurance services directly but may connect users with third-party providers. We are not responsible for the policies or decisions made by these third parties.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To access certain features, you may need to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Prohibited Activities</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the website for fraudulent or illegal activities.</li>
              <li>Copy, distribute, or modify any part of the website without our written permission.</li>
              <li>Introduce viruses or malicious software.</li>
              <li>Engage in data mining, scraping, or similar activities.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Links and Services</h2>
            <p className="mb-4">
              Our website may contain links to third-party websites or services. We do not endorse or control these third parties and are not responsible for their content, policies, or practices. Your interactions with these third parties are solely at your own risk.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Our website and services are provided on an "as-is" and "as available" basis.</li>
              <li>We do not guarantee that our services will be uninterrupted, secure, or error-free.</li>
              <li>We disclaim all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, AutoRateSaver.com and its affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our website or services.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless AutoRateSaver.com, its affiliates, and employees from any claims, losses, or damages, including legal fees, resulting from your violation of these Terms or your use of our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Modifications to Terms</h2>
            <p className="mb-4">
              We reserve the right to update or modify these Terms at any time. Changes will be effective upon posting. Continued use of the website after modifications constitutes acceptance of the updated Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Termination</h2>
            <p className="mb-4">
              We may suspend or terminate your access to our website without notice if we determine that you have violated these Terms or engaged in unlawful activity.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">11. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by and construed in accordance with the laws of Austin, TX. Any disputes shall be resolved in the courts of Austin, TX.
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

export default TermsPage;
