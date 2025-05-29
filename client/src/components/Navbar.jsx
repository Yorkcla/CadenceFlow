import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <Link className="mr-4" to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
