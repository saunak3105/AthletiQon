'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons/logo';

const carouselItems = [
  {
    title: 'Train Smart, Not Hard',
    description: 'Leverage AI-powered insights to perfect your form and maximize your gains. AthletiQon is your personal trainer, available 24/7.',
    image: PlaceHolderImages.find((img) => img.id === 'carousel-1'),
  },
  {
    title: 'Test Your Limits',
    description: 'Take on standardized fitness tests, track your progress with precision, and see how you stack up against the community.',
    image: PlaceHolderImages.find((img) => img.id === 'carousel-2'),
  },
  {
    title: 'Triumph and Conquer',
    description: 'Earn badges, climb the leaderboards, and celebrate your milestones. Your journey to peak fitness starts here.',
    image: PlaceHolderImages.find((img) => img.id === 'carousel-3'),
  },
];

export default function WelcomePage() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-background p-4 md:p-8">
      <div className="flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <Logo />
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Train, Test, Triumph
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Welcome to AthletiQon, the ultimate platform to elevate your fitness journey.
        </p>
        <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl">
          <CarouselContent>
            {carouselItems.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                      {item.image && (
                        <Image
                          src={item.image.imageUrl}
                          alt={item.image.description}
                          fill
                          className="object-cover"
                          data-ai-hint={item.image.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                      <div className="relative z-10 mt-auto flex flex-col items-center p-6 text-center text-primary-foreground">
                        <h3 className="font-headline text-2xl font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex" />
          <CarouselNext className="hidden md:inline-flex" />
        </Carousel>
        <Button asChild size="lg" className="mt-4">
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
