import { Carousel } from "@material-tailwind/react";
import { CalendarIcon, LockClosedIcon, UserGroupIcon} from '@heroicons/react/solid';

export function Carousel1() {
  return (
    <Carousel
      className="rounded-xl relative space-x-3"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <>
          {/* Navigazione indicatori */}
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          {/* Frecce di navigazione */}
          <button
            className="absolute top-1/2 left-4 z-50 -translate-y-1/2 text-white hover:text-gray-300"
            onClick={() =>
              setActiveIndex((prev) => (prev === 0 ? length - 1 : prev - 1))
            }
            aria-label="Previous Slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            className="absolute top-1/2 right-4 z-50 -translate-y-1/2 text-white hover:text-gray-300"
            onClick={() =>
              setActiveIndex((prev) => (prev === length - 1 ? 0 : prev + 1))
            }
            aria-label="Next Slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    >
      {/* Slide 1 */}
      <div className="relative h-96 w-full">
        <img
          src="..\images\img_slide1.jpg"
          alt="Slide 1"
          className="absolute inset-0 h-full w-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/70 rounded-3xl"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">
          <LockClosedIcon className="w-10 h-10 text-gray-100 mb-2" />
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pagamenti sicuri ed autorizzati
          </h2>
          <p className="mt-4 text-lg sm:text-xl">
            Acquista con la massima tranquillità! Il nostro sistema di pagamento è
            progettato per garantire sicurezza e affidabilità, utilizzando
            protocolli avanzati per la protezione dei tuoi dati.
          </p>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="relative h-96 w-full">
        <img
          src="..\images\img_slide2.jpg"
          alt="Slide 2"
          className="absolute inset-0 h-full w-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/70 rounded-3xl"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">
          <CalendarIcon className="w-10 h-10 text-gray-100 mb-2" />
          <h2 className="text-3xl font-bold sm:text-4xl">
            Calendario interattivo degli eventi
          </h2>
          <p className="mt-4 text-lg sm:text-xl">
            Scopri il nostro calendario interattivo, progettato per offrirti una
            panoramica chiara e dettagliata di tutti gli eventi disponibili.
          </p>
        </div>
      </div>

      {/* Slide 3 */}
      <div className="relative h-96 w-full">
        <img
          src="..\images\img_slide3.jpg"
          alt="Slide 3"
          className="absolute inset-0 h-full w-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/70 rounded-3xl"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">
          <UserGroupIcon className="w-10 h-10 text-gray-100 mb-2" />
          <h2 className="text-3xl font-bold sm:text-4xl">
            Organizzazione professionale degli eventi
          </h2>
          <p className="mt-4 text-lg sm:text-xl">
            Dalla cura dei dettagli all'atmosfera perfetta, garantiamo eventi
            indimenticabili che lasceranno tutti senza parole. Scegli il meglio per
            te e i tuoi ospiti.
          </p>
        </div>
      </div>
    </Carousel>

  );
}
