import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Hero from '../components/Hero';
import MidSec from '../components/MidSec';
import Dash from '../components/Dash';

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <MidSec />
      <Dash />
    </div>
  );
}

export default Home;
