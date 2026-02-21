"use client";
import {
  Crown,
  Users,
  Trophy,
  MessageSquare,
  BarChart3,
  Star,
  CheckCircle,
  ChevronRight,
  Puzzle,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Full-width wrapper that breaks out of the parent container
function FullWidth({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen -mt-6">
      {/* Hero Section */}
      <FullWidth className="bg-gradient-to-b from-amber-50 via-white to-white">
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          {/* Glowing orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl" />

          <div className="container max-w-7xl mx-auto px-4 md:px-6 relative">
            <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-6">
                <Badge
                  variant="secondary"
                  className="w-fit bg-amber-100 text-amber-700 border-amber-200 px-3 py-1"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Open Community Platform
                </Badge>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="text-slate-900">Your Move.</span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Your Community.
                  </span>
                </h1>
                <p className="max-w-[550px] text-slate-600 text-lg md:text-xl leading-relaxed">
                  Connect with chess players worldwide. Share puzzles, discuss
                  strategies, and join communities built by players, for players.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-200/50 hover:shadow-amber-300/60 transition-all duration-300 px-8 group"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-100 px-8"
                    >
                      Learn More
                    </Button>
                  </a>
                </div>
                <div className="flex items-center gap-6 pt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Free to join
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    No ads
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Open source
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-2xl blur-2xl scale-110" />
                <img
                  src="/images/hero.jpg"
                  width="600"
                  height="400"
                  alt="Chess community"
                  className="relative mx-auto aspect-[3/2] overflow-hidden rounded-2xl object-cover shadow-2xl shadow-amber-900/20 ring-1 ring-slate-200"
                />
                {/* Floating stat cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg shadow-slate-200/60 p-3 flex items-center gap-2 ring-1 ring-slate-100">
                  <div className="bg-amber-100 rounded-lg p-2">
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Active Members</p>
                    <p className="text-sm font-bold text-slate-800">
                      Growing daily
                    </p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg shadow-slate-200/60 p-3 flex items-center gap-2 ring-1 ring-slate-100">
                  <div className="bg-emerald-100 rounded-lg p-2">
                    <Puzzle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Daily Puzzles</p>
                    <p className="text-sm font-bold text-slate-800">
                      New every day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FullWidth>

      {/* Features Section */}
      <FullWidth className="bg-white border-y border-slate-100">
        <section id="features" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 border-amber-200"
              >
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  Master Chess
                </span>
              </h2>
              <p className="max-w-[700px] text-slate-500 md:text-lg">
                From game analysis to community discussions, we provide all the
                tools chess players need to improve and connect.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3">
              {[
                {
                  icon: BarChart3,
                  title: "Chess Puzzles",
                  description:
                    "Solve daily puzzles, share your own challenges, and sharpen your tactical skills with community-created content.",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  barGradient: "from-amber-500 to-amber-400",
                },
                {
                  icon: Users,
                  title: "Social Communities",
                  description:
                    "Create or join communities, post analyses, discuss openings, and connect with players who share your passion.",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  barGradient: "from-blue-500 to-blue-400",
                },
                {
                  icon: Trophy,
                  title: "Compete & Discuss",
                  description:
                    "Vote on the best solutions, comment on positions, and build your reputation in the chess community.",
                  iconBg: "bg-emerald-100",
                  iconColor: "text-emerald-600",
                  barGradient: "from-emerald-500 to-emerald-400",
                },
                {
                  icon: MessageSquare,
                  title: "Rich Discussions",
                  description:
                    "Threaded comments, upvotes, and a rich text editor make discussions structured and engaging.",
                  iconBg: "bg-violet-100",
                  iconColor: "text-violet-600",
                  barGradient: "from-violet-500 to-violet-400",
                },
                {
                  icon: Newspaper,
                  title: "Chess News",
                  description:
                    "Stay up to date with trending chess news from around the world, curated and translated for the community.",
                  iconBg: "bg-rose-100",
                  iconColor: "text-rose-600",
                  barGradient: "from-rose-500 to-rose-400",
                },
                {
                  icon: Star,
                  title: "Personalized Feed",
                  description:
                    "See content from your subscribed communities. Your home feed adapts to what you care about most.",
                  iconBg: "bg-orange-100",
                  iconColor: "text-orange-600",
                  barGradient: "from-orange-500 to-orange-400",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${feature.iconBg}`}
                    >
                      <feature.icon
                        className={`h-6 w-6 ${feature.iconColor}`}
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.barGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  />
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FullWidth>

      {/* Community Section */}
      <FullWidth>
        <section id="community" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <Badge
                  variant="secondary"
                  className="w-fit bg-amber-100 text-amber-700 border-amber-200"
                >
                  Community
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  Join a Thriving Chess Community
                </h2>
                <p className="max-w-[600px] text-slate-500 md:text-lg leading-relaxed">
                  Connect with chess players from around the world. Share your
                  games, discuss strategies, and learn from fellow enthusiasts
                  in our vibrant community.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Create communities",
                    "Share chess puzzles",
                    "Discuss strategies",
                    "Vote on content",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/sign-up" className="w-fit">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-200/50 group"
                  >
                    Join Community
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-2xl blur-2xl scale-110" />
                <img
                  src="/images/hero.jpg"
                  width="600"
                  height="400"
                  alt="Chess community"
                  className="relative mx-auto aspect-[3/2] overflow-hidden rounded-2xl object-cover shadow-2xl shadow-amber-900/15 ring-1 ring-slate-200 hover:shadow-amber-900/25 transition-shadow duration-500"
                />
              </div>
            </div>
          </div>
        </section>
      </FullWidth>

      {/* How It Works */}
      <FullWidth className="bg-slate-50 border-y border-slate-100">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 border-amber-200"
              >
                How It Works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                Get Started in Minutes
              </h2>
            </div>
            <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  description:
                    "Sign up with Google or create an account with your email. It takes less than a minute.",
                },
                {
                  step: "02",
                  title: "Join Communities",
                  description:
                    "Browse and subscribe to communities that match your interests — openings, tactics, endgames, and more.",
                },
                {
                  step: "03",
                  title: "Start Playing",
                  description:
                    "Post puzzles, discuss games, solve daily challenges, and connect with the chess community.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200/50">
                    <span className="text-xl font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {i < 2 && (
                    <ChevronRight className="hidden md:block absolute -right-4 top-8 w-6 h-6 text-amber-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FullWidth>

      {/* Coming Soon / Roadmap */}
      <FullWidth>
        <section id="tournaments" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 border-amber-200"
              >
                Coming Soon
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                What&apos;s Next for ChessMates
              </h2>
              <p className="max-w-[700px] text-slate-500 md:text-lg">
                We&apos;re building exciting new features for the chess
                community. Here&apos;s a sneak peek at what&apos;s coming.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
              <Card className="border-dashed border-2 border-slate-200 hover:border-amber-300 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      Live Tournaments
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-300"
                    >
                      Planned
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">
                    Compete in community-organized tournaments with various time
                    controls and formats.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Blitz & Rapid</span>
                      <span className="font-medium text-amber-600">⚡</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Leaderboards</span>
                      <span className="font-medium text-amber-600">📊</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Community Events</span>
                      <span className="font-medium text-amber-600">🏆</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-slate-200 hover:border-amber-300 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      Game Analysis
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-300"
                    >
                      Planned
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">
                    Upload full PGN games and get AI-powered analysis with
                    move-by-move insights.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>PGN Import</span>
                      <span className="font-medium text-blue-600">📥</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Move Navigation</span>
                      <span className="font-medium text-blue-600">🔄</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Blunder Detection</span>
                      <span className="font-medium text-blue-600">🔍</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-slate-200 hover:border-amber-300 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      Offline Meetups
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-emerald-600 border-emerald-300"
                    >
                      Planned
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">
                    Discover and organize local chess events, clubs, and meetups
                    in your area.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Event Calendar</span>
                      <span className="font-medium text-emerald-600">📅</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Location Based</span>
                      <span className="font-medium text-emerald-600">📍</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>RSVP System</span>
                      <span className="font-medium text-emerald-600">✅</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FullWidth>

      {/* CTA Section */}
      <FullWidth className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500">
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          <div className="container max-w-7xl mx-auto px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-6 text-center text-white">
              <Crown className="w-12 h-12 text-amber-200" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Elevate Your Chess Game?
              </h2>
              <p className="mx-auto max-w-[600px] text-amber-100 md:text-xl/relaxed">
                Join a community of chess enthusiasts who are already improving
                their game with ChessMates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-white text-amber-700 hover:bg-amber-50 shadow-lg shadow-amber-900/20 px-8 font-semibold group"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-amber-200 pt-2">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </FullWidth>

      {/* Footer */}
      <FullWidth className="bg-slate-900">
        <footer className="py-12">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-amber-500" />
                  <span className="text-lg font-bold text-white">
                    ChessMates
                  </span>
                </div>
                <p className="text-sm text-slate-500 max-w-xs">
                  A community platform built by chess players, for chess players.
                  Open source and free forever.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Platform
                </h4>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Home Feed
                  </Link>
                  <Link
                    href="/puzzle"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Daily Puzzles
                  </Link>
                  <Link
                    href="/news"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Chess News
                  </Link>
                  <Link
                    href="/c/create"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Create Community
                  </Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Legal
                </h4>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Support
                  </Link>
                </nav>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center">
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} ChessMates. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </FullWidth>
    </div>
  );
}
