const members = [
  {
    name: "Randall Graida",
    role: "Software Engineer",
    img: "/Randall_2x2_png.PNG",
  },
  {
    name: "Wilbert Laiño",
    role: "Software Engineer",
    img: "/Wilbert_photo.webp",
  },
  {
    name: "Mae Sujide",
    role: "Project Manager",
    img: "/Sujide_photo.webp",
  },
  {
    name: "Andrew Urcia",
    role: "Project Manager",
    img: "/Urcia_photo.webp",
  },
];

export default function Members() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
    <div className="mb-10">
      <h2 className="text-4xl font-extrabold text-slate-900">Our team</h2>
      <p className="mt-4 text-slate-500 max-w-2xl">
      We are a dynamic group of individuals who are passionate about what we do
      and dedicated to delivering the best results for our clients.
      </p>
    </div>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((m) => (
      <article
        key={m.name}
        className="group bg-white rounded-2xl p-4 shadow-sm transform transition-transform duration-300 hover:-translate-y-2"
      >
        <div className="overflow-hidden rounded-xl">
        <img
          src={m.img}
          alt={`${m.name} portrait`}
          className="w-full h-56 object-cover rounded-xl filter brightness-95 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        </div>

        <div className="mt-4">
        <h3 className="text-lg font-semibold text-slate-900">{m.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{m.role}</p>
        </div>
      </article>
      ))}
    </div>
    </section>
  )
}