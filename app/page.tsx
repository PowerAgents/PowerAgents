'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Calendar, Plane, BotIcon as Robot, Bolt, Star, Twitter, Facebook, Instagram, Linkedin, Menu, X } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-yellow-200 font-mono">
      {/* Navbar */}
      <nav className="bg-black  text-white py-4 px-6 sticky top-0 z-10">
        <div className="container md:w-4/5 mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">SUPERAGENTS</Link>
          <div className="hidden md:flex space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#cta">Get Started</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white py-4 px-6">
          <div className="flex flex-col space-y-4">
            <NavLink href="#features" onClick={toggleMenu}>Features</NavLink>
            <NavLink href="#cta" onClick={toggleMenu}>Get Started</NavLink>
            <NavLink href="#contact" onClick={toggleMenu}>Contact</NavLink>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container md:w-4/5 mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 uppercase">
              Superagents: <br /> Your Supercharged <br /> AI Assistant
            </h1>
            <p className="text-2xl mb-8">
              Imagine Jarvis, but cooler and with a better sense of humor!
            </p>
            <Link href="/product">
            <Button className="bg-black text-white text-xl py-6 px-8 rounded-none border-4 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1">
              Get Supercharged!
            </Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src="/supercharged.webp"
                alt="Superagent in action"
                width={500}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-blue-500 py-20 px-4">
        <div className="container md:w-4/5 mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center uppercase">
            What makes Superagent so super?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="w-12 h-12" />}
              title="Schedule Like a Boss"
              description="Book meetings faster than you can say 'synergy'!"
            />
            <FeatureCard
              icon={<Plane className="w-12 h-12" />}
              title="Fly Me to the Moon"
              description="Book flights while you're still dreaming about your vacation."
            />
            <FeatureCard
              icon={<Robot className="w-12 h-12" />}
              title="AI Brainpower"
              description="It's like having Einstein on speed dial, but cooler."
            />
            <FeatureCard
              icon={<Bolt className="w-12 h-12" />}
              title="Lightning Fast"
              description="Blink and you might miss it. It's that quick!"
            />
            <FeatureCard
              icon={<Star className="w-12 h-12" />}
              title="Personalized Magic"
              description="It knows you better than you know yourself. Creepy? Nah, just super!"
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Supercharged Everything"
              description="If it's not supercharged, we don't do it. Simple as that."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="container md:w-4/5 mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-5xl font-bold mb-8 uppercase">
              Ready to Supercharge Your Life?
            </h2>
            <p className="text-2xl mb-12">
              Join the league of extraordinary individuals who&apos;ve embraced the power of Superagent!
            </p>
            <Button className="bg-black text-white text-xl py-6 px-8 rounded-none border-4 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1">
              Become Super Now!
            </Button>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src="/battery.webp"
                alt="Supercharged life with Superagent"
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white py-12 px-4">
        <div className="container md:w-4/5 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-3xl font-bold mb-4">SUPERAGENT</h3>
              <p className="text-xl">Making your life super, one task at a time!</p>
            </div>
            <div className="flex space-x-6">
              <SocialLink href="https://twitter.com" icon={<Twitter size={24} />} />
              <SocialLink href="https://facebook.com" icon={<Facebook size={24} />} />
              <SocialLink href="https://instagram.com" icon={<Instagram size={24} />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={24} />} />
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-xl">© 2023 Superagent - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-lg">{description}</p>
      </CardContent>
    </Card>
  )
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link href={href} className="text-white hover:text-yellow-200 font-bold text-lg transition-colors duration-300" onClick={onClick}>
      {children}
    </Link>
  )
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <Link href={href} className="text-white hover:text-yellow-200 transition-colors duration-300">
      {icon}
    </Link>
  )
}

