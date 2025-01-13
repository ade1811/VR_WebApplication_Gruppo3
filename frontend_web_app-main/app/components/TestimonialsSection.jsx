const TestimonialsSection = () => {
    return (
      <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
        {/* Testimonial 1 */}
        <div className="relative lg:row-span-2">
          <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
            <div className="px-8 pb-3 sm:px-10 sm:pb-0 sm:pt-10">
              <p className="text-sans mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Interfaccia mobile friendly
              </p>
              <p className="text-sans mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Punti di accesso alle funzioni semplici ed intuitivi
              </p>
            </div>
            <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
              <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                <img
                  className="size-full object-cover object-top"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-mobile-friendly.png"
                  alt="Mobile Friendly"
                />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
        </div>
  
        {/* Testimonial 2 */}
        <div className="relative max-lg:row-start-1">
          <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
              <p className="text-sans mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Monitoraggio Eventi</p>
              <p className="text-sans mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Tramite interfacce intuitive si può vedere rapidamente l'andamento dei propri eventi
              </p>
            </div>
            <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
              <img
                className="w-full max-lg:max-w-xs"
                src="https://tailwindui.com/plus/img/component-images/bento-03-performance.png"
                alt="Monitoraggio Eventi"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
        </div>
  
        {/* Testimonial 3 */}
        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
          <div className="absolute inset-px rounded-lg bg-white"></div>
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
              <p className="text-sans mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
              <p className="text-sans mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Assicurata la sicurezza dei tuoi dati. Crea eventi ed acquista i biglietti in modo sicuro!
              </p>
            </div>
            <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
              <img
                className="h-[min(152px,40cqw)] object-cover object-center"
                src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                alt="Security"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
        </div>
  
        {/* Testimonial 4 */}
        <div className="relative lg:row-span-2">
          <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
            <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
              <p className="text-sans mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Statistiche Promoter
              </p>
              <p className="text-sans mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Accesso ad una multitudine di dati utili per creare e personalizzare il tuo evento
              </p>
            </div>
            <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
              <img
                className="object-cover object-center h-96 mx-auto"
                src="images/stat.png"
                alt="Statistiche Promoter"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
        </div>
      </div>
    );
  }
  
  export default TestimonialsSection;
  