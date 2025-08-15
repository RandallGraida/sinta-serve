export default function Introduction() {
  return (
    <section className="bg-red-800 mb-18">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <div className="max-w-lg md:max-w-none">
              <h2 className="font-semibold text-white text-5xl">
                Walk-in anxiety? Never again. 
              </h2>

              <p className="mt-4 text-white text-xl mt-8">
                Sinta Serve works on your schedule, allowing you to submit documents at your convenience.
              </p>
            </div>
          </div>

          <div>
            <img
              src="/time.png"
              className="rounded h-100"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  )
}