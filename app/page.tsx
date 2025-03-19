"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPinterest, FaArrowAltCircleRight } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {

  const { data: session } = useSession(); // Ambil data login
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/image/logo.png"
              alt="Inventu Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex space-x-6 text-[#2d3250] font-medium">
            <Link href="#features">Features</Link>
            {session && ( // Hanya tampilkan jika user sudah login
            <Link href="/dashboard">Dashboard</Link>
          )}
          </nav>

          {/* Actions (Login/Sign Up) */}
          <div className="hidden md:flex space-x-4 items-center">
          {session ? (
            // Jika user sudah login, tampilkan nama mereka
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-[#f9b17a] text-white px-5 py-2 rounded-md">
                <span className="font-semibold">{session.user?.name}</span>
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md p-2 right-0">
                <button onClick={() => signOut()} className="px-4 py-2 text-red-500">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Jika belum login, tampilkan tombol login
            <Link
              href="/auth"
              className="bg-[#f9b17a] hover:bg-[#e8a066] text-white px-5 py-2 rounded-md flex items-center space-x-2"
            >
              <span className="font-semibold">Login</span>
              <FaArrowAltCircleRight />
            </Link>
          )}
            {/* <Button className="bg-[#f9b17a] hover:bg-[#e8a066] text-white px-5 py-2 rounded-md">
              Sign Up
            </Button> */}
          </div>

          {/* Burger Menu (Mobile) */}
          <div className="md:hidden">
            <Button
              variant="outline"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#2d3250] border-[#2d3250]"
            >
              Menu
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-10">
            <nav className="flex flex-col items-center py-4">
              <Link
                href="#features"
                className="py-2 text-[#2d3250] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              {/* <Link
                href="#contact"
                className="py-2 text-[#2d3250] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link> */}
              {session && (
                <Link
                  href="/auth"
                  className="py-2 text-[#2d3250] font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              {/* <Link
                href="/signup"
                className="py-2 text-[#2d3250] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link> */}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-[#2d3250] text-white py-14">
        <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center">
          {/* Teks Hero */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              Welcome to Inventu Dashboard
              <br className="hidden md:block" />
              Streamline Your Inventory Management
            </h1>
            <p className="text-gray-200 mb-6">
              Manage your inventory and warehouse operations internally with ease.
            </p>
            <div className="flex space-x-4">
            <Button asChild className="bg-[#f9b17a] hover:bg-[#e8a066] text-white px-5 py-3 rounded-md">
                <Link href="/dashboard">Access Dashboard</Link>
            </Button>
              <Button
                variant="outline"
                className="border-[#f9b17a] text-[#f9b17a] px-5 py-3 rounded-md hover:bg-[#f9b17a]/10 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Gambar Hero */}
          <div className="w-full lg:w-1/2 flex justify-end">
            <Image
              src="/image/warehouse.png"
              alt="Warehouse"
              width={600}
              height={500}
              className="object-cover rounded-md shadow-lg transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-14 my-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#2d3250] mb-8">
            Key Features for Internal Operations
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Optimize your daily operations with real-time insights and smart automation.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="transition-transform duration-300 transform hover:scale-105">
              <CardHeader>
                <h3 className="text-xl font-semibold text-[#f9b17a]">
                  Real-Time Tracking
                </h3>
              </CardHeader>
              <CardContent>
                <p>
                  Monitor inventory changes as they happen, ensuring up-to-date data.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="transition-transform duration-300 transform hover:scale-105">
              <CardHeader>
                <h3 className="text-xl font-semibold text-[#f9b17a]">
                  Automated Workflows
                </h3>
              </CardHeader>
              <CardContent>
                <p>
                  Reduce manual tasks with smart automation and save valuable time.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="transition-transform duration-300 transform hover:scale-105">
              <CardHeader>
                <h3 className="text-xl font-semibold text-[#f9b17a]">
                  Seamless Integration
                </h3>
              </CardHeader>
              <CardContent>
                <p>
                  Easily integrate with other internal systems for a unified workflow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact / Call-to-Action Section */}
      {/* <section id="contact" className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#2d3250] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-700 mb-6">
            Log in to access your dashboard or sign up to manage your inventory.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button className="bg-[#f9b17a] hover:bg-[#e8a066] text-white px-6 py-3 rounded-md transition-all duration-300">
              Login
            </Button>
            <Button
              variant="outline"
              className="border-[#f9b17a] text-[#f9b17a] px-6 py-3 rounded-md hover:bg-[#f9b17a]/10 transition-all duration-300"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-[#2d3250] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-6">
            <Link href="#" className="text-white text-2xl hover:opacity-75">
              <FaFacebookF />
            </Link>
            <Link href="#" className="text-white text-2xl hover:opacity-75">
              <FaTwitter />
            </Link>
            <Link href="#" className="text-white text-2xl hover:opacity-75">
              <FaInstagram />
            </Link>
            <Link href="#" className="text-white text-2xl hover:opacity-75">
              <FaYoutube />
            </Link>
            <Link href="#" className="text-white text-2xl hover:opacity-75">
              <FaPinterest />
            </Link>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 max-w-2xl mx-auto mb-6">
            Inventu helps you streamline your inventory management efficiently. Founded in 2025,
            Inventu aims to be the leading platform for warehouse automation and logistics solutions.
            The content of this site is copyright-protected and is the property of Inventu.
          </p>

          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <Image src="/image/logo-white.png" alt="Inventu Logo" width={100} height={50} />
          </div>

          {/* Country & Currency */}
          <p className="text-sm text-gray-300">
            Inventu © {new Date().getFullYear()} - All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
