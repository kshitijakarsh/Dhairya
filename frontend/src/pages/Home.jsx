import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Hero from '../components/home/Hero';
import MidSec from '../components/home/MidSec';
import Dash from '../components/home/Dash';

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
