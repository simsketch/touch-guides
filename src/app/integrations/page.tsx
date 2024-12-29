'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
}

export default function IntegrationsPage() {
  const { user } = useUser();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'airbnb',
      name: 'Airbnb',
      description: 'Import your properties and sync guest information automatically.',
      icon: '🏠',
      connected: false,
    },
    {
      id: 'vrbo',
      name: 'VRBO',
      description: 'Connect your VRBO listings and manage everything in one place.',
      icon: '🏡',
      connected: false,
    },
    {
      id: 'booking',
      name: 'Booking.com',
      description: 'Sync your Booking.com properties and guest communications.',
      icon: '🌐',
      connected: false,
    },
    {
      id: 'google',
      name: 'Google Calendar',
      description: 'Sync bookings with your Google Calendar.',
      icon: '📅',
      connected: false,
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace.',
      icon: '💬',
      connected: false,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with thousands of apps through Zapier automations.',
      icon: '⚡',
      connected: false,
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 gradient-bg min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
          Integrations
        </h1>
        <p className="text-gray-600 mt-2">
          Connect your favorite services to streamline your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="glass card-gradient p-6 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <h3 className="text-xl font-semibold">{integration.name}</h3>
              </div>
              <button
                onClick={() => toggleIntegration(integration.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  integration.connected ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    integration.connected ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-gray-600 text-sm">{integration.description}</p>
            <button
              onClick={() => toggleIntegration(integration.id)}
              className={`mt-4 w-full px-4 py-2 rounded-full transition-all ${
                integration.connected
                  ? 'text-red-500 hover:text-red-600 animated-border'
                  : 'button-gradient text-white hover:shadow-lg'
              }`}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 