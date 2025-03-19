
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  url?: string;
  name?: string;
  description?: string;
  logo?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
  url = 'https://yourcontentengine.ai',
  name = 'Content Engine',
  description = 'Content Engine helps consultants and business owners transform meeting insights into engaging content that grows their audience.',
  logo = 'https://yourcontentengine.ai/logo.png',
}) => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/ComingSoon'
    },
    url,
    logo,
    provider: {
      '@type': 'Organization',
      name,
      logo
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
