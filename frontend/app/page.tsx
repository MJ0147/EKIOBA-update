import AIAssistant from "./components/AIAssistant";
import StoreProducts from "./components/StoreProducts";

const cargoHighlights = [
  {
    title: "Air Cargo Consolidation",
    tag: "Air Freight",
    description: "Scheduled air freight for urgent personal and commercial shipments from diaspora hubs to Benin City.",
    image:
      "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Airport Handling & Dispatch",
    tag: "Airport Dispatch",
    description: "Secure cargo handling, customs coordination, and dispatch updates from pickup to final handoff.",
    image:
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Express Shipment Routing",
    tag: "Priority Route",
    description: "Priority routing options for time-sensitive documents, medicine, and high-value packages.",
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1600&q=80",
  },
];

const tourismAttractions = [
  {
    title: "Benin National Museum",
    description: "Discover Benin Bronzes, artifacts, and royal history in this iconic circular building.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/34/12/95/building.jpg?w=1200&h=-1&s=1",
    alt: "Benin National Museum",
  },
  {
    title: "Royal Palace of the Oba of Benin",
    description: "The living heart of Benin royalty - a must-see cultural landmark.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Royal_Palace_of_the_Oba_of_Benin.jpg",
    alt: "Royal Palace of the Oba of Benin",
  },
  {
    title: "Ogba Zoo & Biological Gardens",
    description: "Family-friendly zoo with local wildlife, gardens, and relaxation spots.",
    image:
      "https://venture-out.s3.us-east-2.amazonaws.com/guide-images/1744898884215-media%3Fkey%3DAIzaSyCkpNVocP1IwgtIz1s4aaTb1GgwMdUtzBw%26maxHeightPx%3D800%26maxWidthPx%3D800",
    alt: "Ogba Zoo",
  },
  {
    title: "Ososo Hills",
    description: "Stunning rocky landscapes, hiking trails, and panoramic views in Akoko-Edo.",
    image: "https://rexclarkeadventures.com/wp-content/uploads/2024/08/GFUTcBSWkAAmGfq.jpg-large.jpeg",
    alt: "Ososo Hills",
  },
  {
    title: "Okomu National Park",
    description: "Rainforest reserve with elephants, chimpanzees, and eco-safaris (~45 min from Benin City).",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/e7/19/be/base-of-tree-house.jpg?w=1200&h=-1&s=1",
    alt: "Okomu National Park",
  },
  {
    title: "Igue Festival",
    description: "Annual royal thanksgiving with colorful dances, processions, and Edo culture (December).",
    image: "https://img1.wsimg.com/isteam/ip/d770b666-9f81-4375-870f-c90da57d6553/Edo%20Women-f2173bd.jpg",
    alt: "Igue Festival",
  },
];

export default function Home() {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-5xl p-8 md:p-16">
        <img
          src="https://olive-adorable-cephalopod-171.mypinata.cloud/ipfs/bafkreiew5q3gtnnlelynqarakyarsntgq3dc6r6nqywxytk4ag5idd5zdm"
          alt="Ekioba logo"
          className="mb-6 h-16 w-16 rounded-2xl border border-ink/15 bg-white/80 object-cover shadow-sm"
        />
        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-6xl">Ekioba Platform</h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/80">
          Unified commerce, logistics, tourism, and Edo language intelligence in one stack.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Store", "Payments: Solana + TON verification"],
            ["Cargo", "Quotes + shipment tracking"],
            ["Hotels", "Listings API for tourism inventory"],
            ["Language Academy", "Vocabulary + quiz + translation"],
          ].map(([service, detail]) => (
            <div key={service} className="rounded-2xl border border-ink/15 bg-white/70 p-5 shadow-sm">
              <h2 className="text-xl font-semibold">{service}</h2>
              <p className="mt-2 text-sm text-ink/70">{detail}</p>
            </div>
          ))}
        </div>

        <section className="mt-14 rounded-3xl border border-ink/15 bg-white/80 p-6 shadow-sm md:p-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Cargo Service</h2>
          <p className="mt-3 max-w-3xl text-ink/75">
            Fast and reliable aviation-backed cargo delivery to Edo State. Send parcels with confidence and track shipment progress in real time.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {cargoHighlights.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-36 w-full object-cover object-center sm:h-44 md:h-48"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {item.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-ink/15 bg-bg p-4 md:p-5">
            <h3 className="text-lg font-semibold text-ink">Real-Time Shipment Tracking</h3>
            <p className="mt-1 text-sm text-ink/70">Enter your tracking number to view live shipment status.</p>
            <form action="https://your-tracking-page.com" method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="tracking"
                placeholder="Enter Tracking Number"
                className="w-full rounded-xl border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink outline-none ring-0 placeholder:text-ink/45 focus:border-accent"
              />
              <input
                type="submit"
                value="Track"
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              />
            </form>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-ink/15 bg-white/80 p-6 shadow-sm md:p-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Tourism</h2>
          <p className="mt-3 max-w-3xl text-ink/75">
            While your cargo arrives, explore the rich heritage and beauty of Edo State - home of the ancient Benin Kingdom.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tourismAttractions.map((attraction) => (
              <article
                key={attraction.title}
                className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm"
              >
                <img
                  src={attraction.image}
                  alt={attraction.alt}
                  className="h-36 w-full object-cover object-center sm:h-44 md:h-48"
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold text-ink">{attraction.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{attraction.description}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-center">
            <a
              href="https://yourwebsite.com/edotourism"
              className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Plan Your Edo Visit
            </a>
          </p>
        </section>

        <StoreProducts />
      </main>
      <AIAssistant />
    </>
  );
}
