import React from 'react';
import { GoogleAdSlot } from '../ui/GoogleAdSlot';
import { StatsCounter } from '../ui/StatsCounter';
import { AncientWisdom } from '../ui/AncientWisdom';
import { Testimonials } from '../ui/Testimonials';
import { WhyChooseUs } from '../ui/WhyChooseUs';
import { HowItWorks } from '../ui/HowItWorks';
import { ArticlesCarousel } from '../ui/ArticlesCarousel';
import { HeroSection } from '../home/HeroSection';
import { CTASection } from '../home/CTASection';
import { RunePromoSection } from '../home/RunePromoSection';

export const MenuState = ({ topic, setTopic, readingType, setReadingType, startReading, isDark, openArticle, credits, isDailyFreeAvailable, openDailyReward }) => {
    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
            {/* ═══════════════════════════════════ */}
            {/* 1+2. HERO + SERVICES (รวมกัน) */}
            {/* ═══════════════════════════════════ */}
            <HeroSection
                openDailyReward={openDailyReward}
                topic={topic}
                setTopic={setTopic}
                readingType={readingType}
                setReadingType={setReadingType}
                startReading={startReading}
                isDark={isDark}
                credits={credits}
                isDailyFreeAvailable={isDailyFreeAvailable}
            />

            {/* ═══════════════════════════════════ */}
            {/* 3. STATS */}
            {/* ═══════════════════════════════════ */}
            <div className="mt-16 w-full">
                <StatsCounter />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* 3.5 RUNE PROMO */}
            {/* ═══════════════════════════════════ */}
            <div className="mt-16 w-full">
                <RunePromoSection />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* 4. ANCIENT WISDOM */}
            {/* ═══════════════════════════════════ */}
            <div className="mt-20 w-full">
                <AncientWisdom openArticle={openArticle} />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* 5. HOW IT WORKS */}
            {/* ═══════════════════════════════════ */}
            <div className="mt-20 w-full">
                <HowItWorks />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* 6. TESTIMONIALS */}
            {/* ═══════════════════════════════════ */}
            <div className="mt-20 w-full">
                <Testimonials />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* 7. WHY CHOOSE US */}
            {/* ═══════════════════════════════════ */}
            <div className="mt-20 w-full">
                <WhyChooseUs />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* 8. ARTICLES */}
            {/* ═══════════════════════════════════ */}
            {openArticle && (
                <div className="mt-20 w-full">
                    <ArticlesCarousel openArticle={openArticle} />
                </div>
            )}

            {/* ═══════════════════════════════════ */}
            {/* 9. CTA */}
            {/* ═══════════════════════════════════ */}
            <CTASection onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

            {/* ═══════════════════════════════════ */}
            {/* 10. AD SLOT */}
            {/* ═══════════════════════════════════ */}
            <GoogleAdSlot className="mt-8" />
        </div>
    );
};
