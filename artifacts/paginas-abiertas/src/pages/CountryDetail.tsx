import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Camera, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClubAvatar } from "@/components/Avatars";
import {
  useGetLiteraryCountry,
  useGetCountryExpeditions,
  useGetCountryGallery,
  useGetCurrentBook,
  useGetCountryBooks,
} from "@workspace/api-client-react";

function ClosingActivityBadge({ activity, desc }: { activity: string; desc: string }) {
  if (activity === "cinema") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full px-3 py-1">
        🎬 {desc || "Cine en casa"}
      </span>
    );
  }
  if (activity === "visit") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full px-3 py-1">
        📍 {desc || "Visita al lugar"}
      </span>
    );
  }
  return null;
}

export default function CountryDetail() {
  const params = useParams<{ id: string }>();
  const countryId = parseInt(params.id ?? "0", 10);

  const { data: country, isLoading: loadingCountry } = useGetLiteraryCountry(countryId);
  const { data: expeditions = [] } = useGetCountryExpeditions(countryId);
  const { data: gallery = [] } = useGetCountryGallery(countryId);
  const { data: currentBookData } = useGetCurrentBook();
  const { data: countryBooks = [] } = useGetCountryBooks(countryId);

  const currentBook = currentBookData?.book;
  const isCurrentCountry =
    currentBook && country && currentBook.genre.toLowerCase() === country.name.toLowerCase();

  if (loadingCountry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Cargando...</div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">País literario no encontrado.</p>
        <Link href="/" className="text-[#E8523A] font-semibold hover:underline">← Volver al inicio</Link>
      </div>
    );
  }

  const totalBooks = expeditions.length + (isCurrentCountry ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden"
        style={{ backgroundColor: country.color, minHeight: 240 }}
      >
        {/* Passport stamp dashed border */}
        <div className="absolute inset-4 border-2 border-white/20 rounded-2xl border-dashed pointer-events-none" />
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-lg" />

        <div className="relative container mx-auto px-6 py-10 flex flex-col gap-4">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="flex flex-col md:flex-row md:items-end gap-6 mt-2">
            {/* Emoji + Info */}
            <div className="flex items-center gap-6">
              <span className="text-7xl md:text-8xl drop-shadow-lg">{country.emoji}</span>
              <div>
                <h1 className="font-display font-bold text-4xl md:text-5xl text-white drop-shadow">
                  {country.name}
                </h1>
                <p className="text-white/85 text-lg mt-1 max-w-xl">{country.description}</p>
              </div>
            </div>

            {/* Books badge */}
            <div className="md:ml-auto flex-shrink-0">
              {totalBooks > 0 ? (
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white font-bold rounded-full px-5 py-2 text-sm border border-white/30">
                  <BookOpen className="h-4 w-4" />
                  {totalBooks} {totalBooks === 1 ? "libro leído" : "libros leídos"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white/70 rounded-full px-5 py-2 text-sm border border-white/20">
                  Próximamente
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 space-y-16 max-w-5xl">

        {/* ── EN RUTA AHORA ────────────────────────────────────────────── */}
        {isCurrentCountry && currentBook && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display font-bold text-2xl text-[#0F1F3D]">En Ruta Ahora</h2>
              <Badge className="bg-[#E8523A] text-white text-xs">📍 Leyendo ahora</Badge>
            </div>
            <div
              className="rounded-2xl overflow-hidden shadow-xl border"
              style={{ borderColor: country.color + "40" }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Cover */}
                {currentBook.coverUrl && (
                  <div className="md:w-48 flex-shrink-0 bg-gray-100">
                    <img
                      src={currentBook.coverUrl}
                      alt={currentBook.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 p-6 bg-white">
                  <p className="text-sm font-semibold text-[#E8523A] mb-1 uppercase tracking-wide">
                    Expedición activa
                  </p>
                  <h3 className="font-display font-bold text-2xl text-[#0F1F3D]">{currentBook.title}</h3>
                  <p className="text-gray-500 mb-4">{currentBook.author}</p>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{currentBook.synopsis}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-gray-100 rounded-full px-3 py-1 font-medium text-gray-700">
                      📅 Semana {currentBook.currentWeek} de {currentBook.totalWeeks}
                    </span>
                    {currentBook.nextSessionDate && (
                      <span className="bg-gray-100 rounded-full px-3 py-1 font-medium text-gray-700">
                        🗓️ {currentBook.nextSessionDate}
                      </span>
                    )}
                    {currentBook.weekActivity && (
                      <span className="bg-[#F5E642]/30 rounded-full px-3 py-1 font-medium text-[#0F1F3D]">
                        ✨ {currentBook.weekActivity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ── LIBROS DEL PAÍS ──────────────────────────────────────────── */}
        {countryBooks.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display font-bold text-2xl text-[#0F1F3D]">Libros de este País</h2>
              <Badge variant="outline" className="text-xs">{countryBooks.length} {countryBooks.length === 1 ? "libro" : "libros"}</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {countryBooks.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 flex gap-4 p-4 overflow-hidden"
                >
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div
                      className="w-16 h-24 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: country.color + "30" }}
                    >
                      {country.emoji}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0F1F3D] leading-tight line-clamp-2">{book.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                    {book.isWinner && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full px-2 py-0.5 mt-2">
                        🏆 Ganador
                      </span>
                    )}
                    {book.synopsis && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{book.synopsis}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── EXPEDICIONES COMPLETADAS ──────────────────────────────────── */}
        <section>
          <h2 className="font-display font-bold text-2xl text-[#0F1F3D] mb-6">
            Expediciones Completadas
          </h2>

          {expeditions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-5xl mb-4 block">🗺️</span>
              <p className="text-gray-500 font-medium">¡Pronto habrá aventuras que contar aquí!</p>
              <p className="text-gray-400 text-sm mt-1">
                {isCurrentCountry
                  ? "Estamos en medio de la primera expedición."
                  : "Este país aún no ha sido explorado."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {expeditions.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Book cover */}
                  {exp.coverUrl ? (
                    <div className="md:w-32 flex-shrink-0 bg-gray-50">
                      <img
                        src={exp.coverUrl}
                        alt={exp.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="md:w-32 flex-shrink-0 flex items-center justify-center text-4xl"
                      style={{ backgroundColor: country.color + "30", minHeight: 120 }}
                    >
                      {country.emoji}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h3 className="font-display font-bold text-xl text-[#0F1F3D] flex-1">
                        {exp.title}
                      </h3>
                      <ClosingActivityBadge activity={exp.closingActivity} desc={exp.closingActivityDesc} />
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{exp.author}</p>

                    {(exp.startDate || exp.endDate) && (
                      <p className="text-xs text-gray-400 mb-3">
                        {exp.startDate}{exp.startDate && exp.endDate ? " → " : ""}{exp.endDate}
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{exp.description}</p>
                    )}

                    {/* Readers */}
                    {exp.readers.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-400 font-medium">Exploradoras:</span>
                        <div className="flex -space-x-2">
                          {exp.readers.map((r) => (
                            <div key={r.id} title={r.alias} className="ring-2 ring-white rounded-full">
                              <ClubAvatar avatarId={r.avatar} size={28} />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {exp.readers.map((r) => r.alias).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ── GALERÍA ───────────────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Camera className="h-5 w-5 text-[#E8523A]" />
              <h2 className="font-display font-bold text-2xl text-[#0F1F3D]">Galería de Actividades</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group"
                >
                  {/* Polaroid frame */}
                  <div className="bg-white p-3 pb-8 shadow-md rounded-sm rotate-0 group-hover:rotate-1 transition-transform duration-200 border border-gray-100">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full aspect-square object-cover rounded-sm"
                    />
                    {photo.caption && (
                      <p className="text-center text-xs text-gray-500 mt-3 font-medium leading-tight">
                        {photo.caption}
                      </p>
                    )}
                    {/* Passport stamp overlay */}
                    <div
                      className="absolute -bottom-2 -right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                    >
                      {country.emoji}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── FOOTER BACK ───────────────────────────────────────────────── */}
        <div className="flex justify-center pt-4 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#0F1F3D] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#0F1F3D]/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Pasaporte
          </Link>
        </div>
      </main>
    </div>
  );
}
