"use client";
import {
  Crown,
  Users,
  Trophy,
  MessageSquare,
  BarChart3,
  Calendar,
  Star,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      {/* <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-amber-600" />
          <span className="text-xl font-bold text-slate-800">Chessmates</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-amber-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#community"
            className="text-sm font-medium hover:text-amber-600 transition-colors"
          >
            Community
          </Link>
          <Link
            href="#tournaments"
            className="text-sm font-medium hover:text-amber-600 transition-colors"
          >
            Tournaments
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-amber-600 transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="ml-6 flex gap-2">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            Join Now
          </Button>
        </div>
      </header> */}

      <main className="flex-1">
        {/* Community Section */}
        <section id="community" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                {/* <Badge variant="secondary" className="w-fit">
                  Community
                </Badge> */}
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join a Thriving Chess Community
                </h2>
                <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed">
                  Connect with chess players from around the world. Share your
                  games, discuss strategies, and learn from masters and
                  grandmasters in our vibrant community.
                </p>
                {/* <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">{"50,000+"} active members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">
                      {"1,000+"} daily games analyzed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">{"100+"} study groups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm">{"24/7"} tournaments</span>
                  </div>
                </div> */}
                <Button
                  size="lg"
                  className="w-fit bg-amber-600 hover:bg-amber-700"
                >
                  Join Community
                </Button>
              </div>
              <div className="flex items-center justify-center relative">
                <img
                  src="/images/hero.jpg"
                  width="600"
                  height="400"
                  alt="Chess community"
                  className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover shadow-xl"
                />
                <div className="absolute hover:opacity-0 transition-opacity inset-0 opacity-50 bg-gradient-to-b from-black to-amber-900 bg-opacity-50 bg-blend-multiply rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-slate-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Master Chess
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From game analysis to community discussions, we provide all
                  the tools chess players need to improve and connect.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <BarChart3 className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Game Analysis</h3>
                  <p className="text-slate-600">
                    Advanced AI-powered analysis of your games with detailed
                    insights, blunder detection, and improvement suggestions.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Social Features</h3>
                  <p className="text-slate-600">
                    Connect with players worldwide, share games, discuss
                    strategies, and build your chess network.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Trophy className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Tournaments</h3>
                  <p className="text-slate-600">
                    Participate in daily tournaments, create custom events, and
                    compete for rankings and prizes.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <MessageSquare className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Study Groups</h3>
                  <p className="text-slate-600">
                    Join study groups, share opening repertoires, and learn from
                    experienced players in your area of interest.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Calendar className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Training Schedule</h3>
                  <p className="text-slate-600">
                    Personalized training programs, puzzle rush challenges, and
                    structured learning paths for all skill levels.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Star className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Rating System</h3>
                  <p className="text-slate-600">
                    Comprehensive rating system across different time controls
                    with detailed progress tracking and statistics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

        {/* Tournaments Section */}
        {/* <section
          id="tournaments"
          className="w-full py-12 md:py-24 lg:py-32 bg-slate-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="secondary">Tournaments</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Compete in Exciting Tournaments
              </h2>
              <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed">
                Test your skills in various tournament formats, from blitz to
                classical, and climb the leaderboards.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Daily Blitz</h3>
                    <Badge>Live</Badge>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Fast-paced 5-minute games with instant matchmaking
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prize Pool:</span>
                      <span className="font-medium">$500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Control:</span>
                      <span className="font-medium">5+0</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-transparent"
                    variant="outline"
                  >
                    Join Tournament
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Weekend Classical</h3>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Serious classical games for dedicated players
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prize Pool:</span>
                      <span className="font-medium">$2,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Control:</span>
                      <span className="font-medium">90+30</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Monthly Championship</h3>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Elite tournament for top-rated players
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prize Pool:</span>
                      <span className="font-medium">$10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Rating:</span>
                      <span className="font-medium">2000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Control:</span>
                      <span className="font-medium">15+10</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-transparent"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-amber-600 to-amber-700">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Elevate Your Chess Game?
                </h2>
                <p className="mx-auto max-w-[600px] text-amber-100 md:text-xl/relaxed">
                  Join thousands of chess enthusiasts who are already improving
                  their game with ChessMates.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-amber-100"
                  />
                  <Button
                    type="submit"
                    className="bg-white text-amber-700 hover:bg-amber-50"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-amber-100">Free to join.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-slate-50">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <p className="text-xs text-slate-600">
            © 2024 ChessMates. All rights reserved.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-600"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-600"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-600"
          >
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
