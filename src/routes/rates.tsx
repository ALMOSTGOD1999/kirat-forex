import { createFileRoute } from "@tanstack/react-router";
import { ExchangeWidget } from "@/components/site/ExchangeWidget";
import { RateTable } from "@/components/site/ExchangeWidget";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { RATE_UPDATED } from "@/lib/forex-data";

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Live Forex Rates in Murshidabad | Kirat Forex" },
      {
        name: "description",
        content:
          "Check today's buy and sell rates for USD, EUR, GBP, AED, SAR, THB and 20+ currencies at Kirat Forex, Murshidabad.",
      },
      { property: "og:title", content: "Today's Currency Exchange Rates | Kirat Forex" },
      {
        property: "og:description",
        content: "Live indicative buy and sell rates for 20+ world currencies.",
      },
    ],
  }),
  component: RatesPage,
});

function RatesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Live Rates"
        title="Today's currency buy & sell rates"
        sub={`Indicative rates, last updated ${RATE_UPDATED}. Call us to lock your rate.`}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <Reveal from="left">
          <RateTable />
        </Reveal>
        <Reveal from="right">
          <ExchangeWidget initialTab="buy" />
        </Reveal>
      </section>
    </div>
  );
}
