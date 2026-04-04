import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  BookOpen, Compass, Map, Star, Award, 
  ChevronRight, Plane, MapPin, ChevronDown, Menu, X, Check
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CLUB_AVATARS, ClubAvatar } from "@/components/Avatars";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetVotingSession,
  useGetLiteraryCountries,
  useGetVotingBooks,
  useGetCurrentBook,
  useGetLeaderboard,
  useCastVote,
} from "@workspace/api-client-react";
import { fireConfetti } from "@/lib/confetti";

// -- COMPONENTS --

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1F3D] text-white py-4 shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <BookOpen className="text-[#E8523A] h-6 w-6" />
          <span className="font-display font-bold text-xl tracking-tight">Páginas Abiertas</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm">
          <button onClick={() => scrollTo("inicio")} className="hover:text-[#4DC8E0] transition-colors">Inicio</button>
          <button onClick={() => scrollTo("club")} className="hover:text-[#4DC8E0] transition-colors">El Club</button>
          <button onClick={() => scrollTo("paises")} className="hover:text-[#4DC8E0] transition-colors">Géneros</button>
          <button onClick={() => scrollTo("votacion")} className="hover:text-[#4DC8E0] transition-colors">Votación</button>
          <button onClick={() => scrollTo("exploradoras")} className="hover:text-[#4DC8E0] transition-colors">Exploradoras</button>
          <Button onClick={() => scrollTo("votacion")} className="bg-[#E8523A] hover:bg-[#E8523A]/90 text-white font-bold ml-4">
            ¿Cómo unirme?
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0F1F3D] overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 gap-4">
              <button onClick={() => scrollTo("inicio")} className="text-left font-medium">Inicio</button>
              <button onClick={() => scrollTo("club")} className="text-left font-medium">El Club</button>
              <button onClick={() => scrollTo("paises")} className="text-left font-medium">Géneros</button>
              <button onClick={() => scrollTo("votacion")} className="text-left font-medium">Votación</button>
              <button onClick={() => scrollTo("exploradoras")} className="text-left font-medium">Exploradoras</button>
              <Button onClick={() => scrollTo("votacion")} className="bg-[#E8523A] text-white font-bold mt-2">
                ¿Cómo unirme?
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const { data: currentBookData } = useGetCurrentBook();
  const book = currentBookData?.book;

  return (
    <section id="inicio" className="min-h-screen pt-24 pb-12 bg-[#0F1F3D] text-white relative overflow-hidden flex items-center">
      {/* Decorative SVG path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path d="M 0,500 Q 250,200 500,500 T 1000,500" fill="none" stroke="#F5E642" strokeWidth="4" strokeDasharray="10 10" />
      </svg>

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <Badge className="bg-[#4DC8E0]/20 text-[#4DC8E0] hover:bg-[#4DC8E0]/30 border-none px-3 py-1 text-sm font-semibold">
            ✈️ Pasaporte Literario 2026
          </Badge>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight text-white">
            Tu próxima aventura <span className="text-[#E8523A]">empieza en una página</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl">
            Club de lectura para exploradoras de 12 a 17 años. Viaja a nuevos mundos, colecciona sellos en tu pasaporte y elige nuestro próximo destino.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-[#E8523A] hover:bg-[#E8523A]/90 text-white font-bold text-lg h-14 px-8 rounded-full"
              onClick={() => document.getElementById("votacion")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver la votación
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold text-lg h-14 px-8 rounded-full"
              onClick={() => document.getElementById("club")?.scrollIntoView({ behavior: "smooth" })}
            >
              Conocer el club
            </Button>
          </div>
        </motion.div>

        {book && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative justify-self-center lg:justify-self-end"
          >
            <div className="absolute -inset-4 bg-[#F5E642]/20 blur-2xl rounded-full"></div>
            <div className="relative bg-white p-4 rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Badge className="absolute -top-3 -right-3 bg-[#E8523A] text-white border-2 border-white text-sm font-bold z-10">
                En ruta ahora
              </Badge>
              <img src={book.coverUrl} alt={book.title} className="w-64 h-auto rounded shadow-inner" />
              <div className="mt-4 text-center">
                <h3 className="font-display font-bold text-[#0F1F3D] text-lg">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </div>
            <Plane className="absolute -right-8 -bottom-8 text-[#4DC8E0] h-12 w-12 transform -rotate-12 animate-pulse" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ClubSection() {
  return (
    <section id="club" className="py-24 bg-white text-[#1A1A1A]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#0F1F3D] mb-6">
            <span className="italic font-light text-[#4DC8E0]">No solo lees libros,</span><br />
            viajas a mundos
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-1.5">Gratuito</Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-1.5">Presencial</Badge>
            <Badge variant="secondary" className="bg-[#E8523A]/10 text-[#E8523A] text-sm font-bold px-4 py-1.5">12–17 años</Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-1.5">Cada 2 semanas</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-dashed border-gray-200 hover:border-[#4DC8E0] transition-colors group">
            <CardHeader>
              <div className="h-14 w-14 rounded-full bg-[#4DC8E0]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-7 w-7 text-[#4DC8E0]" />
              </div>
              <CardTitle className="font-display text-xl text-[#0F1F3D]">Cada libro es un destino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Exploramos géneros como si fueran países. Un mes en el reino de la Fantasía, al siguiente en la capital del Misterio.</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-gray-200 hover:border-[#E8523A] transition-colors group">
            <CardHeader>
              <div className="h-14 w-14 rounded-full bg-[#E8523A]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7 text-[#E8523A]" />
              </div>
              <CardTitle className="font-display text-xl text-[#0F1F3D]">Gana sellos en tu pasaporte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Por cada libro leído y reunión asistida, obtienes sellos físicos para tu pasaporte oficial del club y puntos para el ranking.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-200 hover:border-[#F5E642] transition-colors group">
            <CardHeader>
              <div className="h-14 w-14 rounded-full bg-[#F5E642]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Compass className="h-7 w-7 text-[#D4C41B]" />
              </div>
              <CardTitle className="font-display text-xl text-[#0F1F3D]">Sube de rango como exploradora</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Desde Novata hasta Leyenda Literaria. Tu dedicación te da prestigio dentro del club y el poder de proponer libros.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function GenresSection() {
  const { data: countries } = useGetLiteraryCountries();

  const fallback = [
    { id: 0, name: "Misterio", emoji: "🕵️‍♀️", description: "Resuelve el caso antes de la última página", color: "#1E2D6B", booksRead: 0, displayOrder: 1 },
    { id: 0, name: "Fantasía", emoji: "🐉", description: "Magia, reinos perdidos y criaturas épicas", color: "#6B21A8", booksRead: 0, displayOrder: 2 },
    { id: 0, name: "Romance", emoji: "💖", description: "Amor verdadero y suspiros asegurados", color: "#DB2777", booksRead: 0, displayOrder: 3 },
    { id: 0, name: "Sci-Fi", emoji: "🚀", description: "Viajes en el tiempo y futuros distópicos", color: "#64748B", booksRead: 0, displayOrder: 4 },
    { id: 0, name: "Terror", emoji: "👻", description: "No leas esto con las luces apagadas", color: "#111111", booksRead: 0, displayOrder: 5 },
    { id: 0, name: "Drama", emoji: "🎭", description: "Lágrimas, emociones y vida real", color: "#B45309", booksRead: 0, displayOrder: 6 },
    { id: 0, name: "Aventura", emoji: "🗺️", description: "Mapas, tesoros y supervivencia", color: "#15803D", booksRead: 0, displayOrder: 7 },
  ];

  const genres = countries ?? fallback;

  return (
    <section id="paises" className="py-24 bg-gray-50 border-t border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[#0F1F3D] mb-12 text-center">
          Los 7 Países Literarios
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {genres.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-full md:w-64 relative group"
            >
              {g.id ? (
                <Link href={`/paises/${g.id}`} className="block cursor-pointer">
                  <div
                    className="absolute inset-0 transform translate-x-2 translate-y-2 rounded-xl opacity-20 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"
                    style={{ backgroundColor: g.color }}
                  ></div>
                  <div
                    className="relative p-6 rounded-xl text-white overflow-hidden transform transition-transform group-hover:-translate-y-1 h-full shadow-lg"
                    style={{ backgroundColor: g.color }}
                  >
                    <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none border-dashed"></div>
                    <div className="text-4xl mb-4">{g.emoji}</div>
                    <h3 className="font-display font-bold text-2xl mb-2">{g.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{g.description}</p>
                    {g.booksRead > 0 && (
                      <span className="inline-block text-xs font-semibold bg-white/20 rounded-full px-3 py-1">
                        📚 {g.booksRead} {g.booksRead === 1 ? "libro leído" : "libros leídos"}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/70 text-xs font-medium">
                      Explorar →
                    </div>
                  </div>
                </Link>
              ) : (
                <>
                  <div
                    className="absolute inset-0 transform translate-x-2 translate-y-2 rounded-xl opacity-20"
                    style={{ backgroundColor: g.color }}
                  ></div>
                  <div
                    className="relative p-6 rounded-xl text-white overflow-hidden h-full shadow-lg"
                    style={{ backgroundColor: g.color }}
                  >
                    <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none border-dashed"></div>
                    <div className="text-4xl mb-4">{g.emoji}</div>
                    <h3 className="font-display font-bold text-2xl mb-2">{g.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{g.description}</p>
                    {g.booksRead > 0 && (
                      <span className="inline-block text-xs font-semibold bg-white/20 rounded-full px-3 py-1">
                        📚 {g.booksRead} {g.booksRead === 1 ? "libro leído" : "libros leídos"}
                      </span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiteraryPassportMap() {
  const { data: countries } = useGetLiteraryCountries();

  if (!countries || countries.length === 0) return null;

  const visited = countries.filter(c => c.booksRead > 0);
  const total = countries.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-3xl mb-3 block">🗺️</span>
        <h3 className="font-display font-bold text-2xl text-[#0F1F3D] mb-2">
          Mapa de Exploración Literaria
        </h3>
        <p className="text-gray-500 text-sm">
          {visited.length} de {total} países explorados — ¡sigamos viajando!
        </p>
        {/* Progress bar */}
        <div className="w-48 mx-auto mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${(visited.length / total) * 100}%`, background: "linear-gradient(90deg, #4DC8E0, #E8523A)" }}
          />
        </div>
      </div>

      {/* Country grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {countries.map((c, i) => {
          const isVisited = c.booksRead > 0;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="relative"
            >
              {isVisited ? (
                <Link href={`/paises/${c.id}`} className="block group">
                  <div
                    className="relative rounded-xl overflow-hidden shadow-md border-2 border-transparent group-hover:border-white/30 transition-all duration-200"
                    style={{ backgroundColor: c.color }}
                  >
                    {/* Passport dashed border */}
                    <div className="absolute inset-2 border border-white/25 rounded-lg border-dashed pointer-events-none" />

                    <div className="p-4 flex flex-col items-center gap-2 text-center relative">
                      {/* Big emoji */}
                      <span className="text-4xl drop-shadow">{c.emoji}</span>
                      <span className="font-display font-bold text-white text-sm leading-tight">{c.name}</span>
                      <span className="text-white/70 text-xs">
                        📚 {c.booksRead} {c.booksRead === 1 ? "libro" : "libros"}
                      </span>

                      {/* Passport stamp overlay */}
                      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur rounded-full px-2 py-0.5 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-1.5 font-medium group-hover:text-[#E8523A] transition-colors">
                    Explorar →
                  </p>
                </Link>
              ) : (
                <div className="rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50">
                  <div className="p-4 flex flex-col items-center gap-2 text-center">
                    {/* Greyed emoji */}
                    <span className="text-4xl grayscale opacity-40">{c.emoji}</span>
                    <span className="font-display font-bold text-gray-400 text-sm leading-tight">{c.name}</span>
                    {/* Lock */}
                    <span className="text-gray-300 text-lg">🔒</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {visited.length === total && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 bg-[#F5E642]/20 border border-[#F5E642]/40 rounded-2xl py-5 px-6"
        >
          <span className="text-3xl mb-2 block">🏆</span>
          <p className="font-display font-bold text-[#0F1F3D] text-lg">¡Han explorado todos los países!</p>
          <p className="text-gray-500 text-sm mt-1">Leyendas Literarias del club, ¡felicidades!</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function VotingSection() {
  const { data: sessionData } = useGetVotingSession();
  const { data: books, refetch } = useGetVotingBooks();
  const castVote = useCastVote();
  const { toast } = useToast();
  
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const session = sessionData?.session;
  const isOpen = session?.status === "open";

  const totalVotes = books?.reduce((acc, b) => acc + b.votes, 0) || 0;

  const voteFormSchema = z.object({
    code: z.string().min(4, "El código debe tener al menos 4 caracteres"),
  });

  const form = useForm<z.infer<typeof voteFormSchema>>({
    resolver: zodResolver(voteFormSchema),
    defaultValues: { code: "" }
  });

  const onVoteSubmit = (values: z.infer<typeof voteFormSchema>) => {
    if (!selectedBook) return;
    
    castVote.mutate({ data: { code: values.code, bookId: selectedBook } }, {
      onSuccess: (data) => {
        setIsVoteModalOpen(false);
        form.reset();
        fireConfetti();
        refetch();
        toast({
          title: "¡Voto registrado!",
          description: data.message,
          className: "bg-[#4DC8E0] text-white border-none",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error al votar",
          description: error.message || "Código inválido o ya usado",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <section id="votacion" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge className={`mb-4 px-4 py-1 text-sm ${isOpen ? 'bg-[#E8523A] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {isOpen ? 'Votación Abierta' : 'Votación Cerrada'}
          </Badge>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#0F1F3D]">
            ¿Qué leemos próximo? <span className="text-[#E8523A]">Tú decides</span>
          </h2>
          {session?.deadline && isOpen && (
             <p className="mt-4 text-gray-500 font-medium text-lg">
               Termina el: {format(new Date(session.deadline), "d 'de' MMMM", { locale: es })}
             </p>
          )}
        </div>

        {!session ? (
          <>
            <div className="text-center py-12 text-gray-500">
              No hay ninguna votación activa en este momento.
            </div>
            <LiteraryPassportMap />
          </>
        ) : (
          <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {books?.map((book) => {
              const percent = totalVotes > 0 ? Math.round((book.votes / totalVotes) * 100) : 0;
              return (
                <Card key={book.id} className={`overflow-hidden border-2 flex flex-col ${book.isWinner ? 'border-[#F5E642] shadow-[0_0_15px_rgba(245,230,66,0.3)]' : 'border-transparent shadow-md'}`}>
                  {book.isWinner && (
                    <div className="bg-[#F5E642] text-[#0F1F3D] font-bold text-center py-1 text-sm">
                      👑 ¡GANADOR!
                    </div>
                  )}
                  <div className="h-64 overflow-hidden relative group">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#0F1F3D] text-white backdrop-blur-md">{book.genre}</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-xl leading-tight">{book.title}</CardTitle>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4" title={book.synopsis}>
                      {book.synopsis}
                    </p>
                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>{book.votes} votos</span>
                        <span>{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-2 bg-gray-100" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full bg-[#E8523A] hover:bg-[#E8523A]/90 text-white font-bold"
                      disabled={!isOpen}
                      onClick={() => {
                        setSelectedBook(book.id);
                        setIsVoteModalOpen(true);
                      }}
                    >
                      Votar por este
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {!isOpen && <LiteraryPassportMap />}
          </>
        )}
      </div>

      <Dialog open={isVoteModalOpen} onOpenChange={setIsVoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#0F1F3D]">Verifica tu voto</DialogTitle>
            <DialogDescription>
              Ingresa el código que recibiste en la última reunión o por correo para confirmar tu voto.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onVoteSubmit)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Ej: ABC-123" className="text-center font-mono text-xl uppercase tracking-widest h-14" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#4DC8E0] hover:bg-[#4DC8E0]/90 text-[#0F1F3D] font-bold h-12" disabled={castVote.isPending}>
                {castVote.isPending ? "Procesando..." : "Confirmar Voto"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function LeaderboardSection() {
  const { data: members } = useGetLeaderboard();
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [identity, setIdentity] = useState<{alias: string, avatar: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pa_identity");
    if (saved) {
      setIdentity(JSON.parse(saved));
    } else {
      setShowIdentityModal(true);
    }
  }, []);

  const saveIdentity = (alias: string, avatar: string) => {
    const id = { alias, avatar };
    localStorage.setItem("pa_identity", JSON.stringify(id));
    setIdentity(id);
    setShowIdentityModal(false);
  };

  const getRankColor = (rank: string) => {
    switch(rank) {
      case "Novata": return "bg-gray-200 text-gray-700";
      case "Viajera": return "bg-[#4DC8E0]/20 text-[#0F1F3D]";
      case "Aventurera": return "bg-[#E8523A]/20 text-[#E8523A]";
      case "Embajadora": return "bg-[#F5E642]/40 text-[#0F1F3D]";
      case "Leyenda Literaria": return "bg-gradient-to-r from-purple-400 to-pink-500 text-white";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const top3 = members?.slice(0, 3) || [];
  const rest = members?.slice(3) || [];

  return (
    <section id="exploradoras" className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#0F1F3D] mb-4">
            Muro de Exploradoras
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lee libros, asiste a reuniones y participa para subir de rango. Las leyendas literarias pueden proponer libros para las próximas votaciones.
          </p>
        </div>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16 h-[300px]">
            {/* Rank 2 - Silver */}
            {top3[1] && (
              <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="w-full md:w-48 flex flex-col items-center order-2 md:order-1">
                <div className="mb-4 shadow-xl border-4 border-gray-300 rounded-full overflow-hidden">
                  <ClubAvatar avatarId={top3[1].avatar} size={80} />
                </div>
                <div className="bg-gradient-to-t from-gray-300 to-gray-100 w-full h-32 rounded-t-xl flex flex-col items-center pt-4 shadow-lg border border-gray-300">
                  <span className="font-bold text-2xl text-gray-500">#2</span>
                  <span className="font-display font-bold text-[#0F1F3D] text-lg truncate w-full text-center px-2">{top3[1].alias}</span>
                  <span className="text-sm font-semibold">{top3[1].points} pts</span>
                </div>
              </motion.div>
            )}
            
            {/* Rank 1 - Gold */}
            {top3[0] && (
              <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-full md:w-56 flex flex-col items-center order-1 md:order-2 z-10">
                <div className="relative mb-4">
                  <div className="absolute -inset-4 bg-[#F5E642]/30 blur-xl rounded-full"></div>
                  <div className="relative border-4 border-[#F5E642] rounded-full overflow-hidden shadow-[0_0_20px_rgba(245,230,66,0.5)]">
                    <ClubAvatar avatarId={top3[0].avatar} size={112} />
                  </div>
                  <div className="absolute -top-4 -right-2 text-4xl">👑</div>
                </div>
                <div className="bg-gradient-to-t from-[#D4C41B] to-[#F5E642] w-full h-40 rounded-t-xl flex flex-col items-center pt-4 shadow-2xl border border-[#F5E642]">
                  <span className="font-bold text-3xl text-[#0F1F3D]">#1</span>
                  <span className="font-display font-bold text-[#0F1F3D] text-xl truncate w-full text-center px-2">{top3[0].alias}</span>
                  <span className="text-sm font-bold text-[#0F1F3D]">{top3[0].points} pts</span>
                </div>
              </motion.div>
            )}

            {/* Rank 3 - Bronze */}
            {top3[2] && (
              <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="w-full md:w-48 flex flex-col items-center order-3 md:order-3">
                <div className="mb-4 shadow-xl border-4 border-amber-600 rounded-full overflow-hidden">
                  <ClubAvatar avatarId={top3[2].avatar} size={80} />
                </div>
                <div className="bg-gradient-to-t from-amber-700 to-amber-500 w-full h-24 rounded-t-xl flex flex-col items-center pt-4 shadow-lg border border-amber-600 text-amber-50">
                  <span className="font-bold text-2xl">#3</span>
                  <span className="font-display font-bold text-white text-lg truncate w-full text-center px-2">{top3[2].alias}</span>
                  <span className="text-xs font-semibold">{top3[2].points} pts</span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {rest.map((member, idx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 text-center font-bold text-gray-400">#{member.position}</div>
              <div className="mr-4">
                <ClubAvatar avatarId={member.avatar} size={40} />
              </div>
              <div className="flex-grow">
                <div className="font-bold text-[#0F1F3D]">{member.alias}</div>
                <div className="text-xs text-gray-500 block md:hidden">{member.points} pts</div>
              </div>
              <div className="hidden md:block w-32 font-mono text-sm text-gray-500 text-right mr-4">
                {member.points} pts
              </div>
              <div className="w-32 text-right">
                <Badge className={`${getRankColor(member.rank)} border-none shadow-none`}>{member.rank}</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <IdentityModal 
        open={showIdentityModal} 
        onSave={saveIdentity} 
        onClose={() => setShowIdentityModal(false)} 
      />
    </section>
  );
}

function IdentityModal({ open, onSave, onClose }: { open: boolean, onSave: (alias: string, avatar: string) => void, onClose: () => void }) {
  const [alias, setAlias] = useState("");
  const [selectedId, setSelectedId] = useState("");

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[#0F1F3D]">
            Crea tu identidad de exploradora
          </DialogTitle>
          <DialogDescription>
            Elige tu personaje y un alias secreto para aparecer en el Muro de Exploradoras.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Alias input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0F1F3D]">Tu Alias Secreto</label>
            <Input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ej: LectoraNocturna"
              maxLength={20}
              className="border-2 focus:border-[#E8523A]"
            />
          </div>

          {/* Avatar grid */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#0F1F3D]">Elige tu Personaje</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CLUB_AVATARS.map((def) => {
                const selected = selectedId === def.id;
                return (
                  <button
                    key={def.id}
                    type="button"
                    onClick={() => setSelectedId(def.id)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 group
                      ${selected
                        ? "border-[#E8523A] bg-[#E8523A]/8 scale-[1.03] shadow-lg shadow-[#E8523A]/20"
                        : "border-gray-200 hover:border-[#E8523A]/50 hover:scale-[1.02]"
                      }`}
                  >
                    {/* Avatar circle */}
                    <div
                      className="rounded-full overflow-hidden shadow-md"
                      style={{
                        width: 72,
                        height: 72,
                        background: def.bg,
                        outline: selected ? "3px solid #E8523A" : "3px solid transparent",
                        outlineOffset: 2,
                        transition: "outline 0.15s",
                      }}
                    >
                      <div style={{ width: 72, height: 72 }}>{def.svg}</div>
                    </div>

                    {/* Name & role */}
                    <div className="text-center leading-tight">
                      <p
                        className="text-xs font-bold"
                        style={{ color: selected ? "#E8523A" : "#0F1F3D" }}
                      >
                        {def.name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">{def.role}</p>
                    </div>

                    {/* Selected check */}
                    {selected && (
                      <div className="absolute top-2 right-2 bg-[#E8523A] rounded-full w-5 h-5 flex items-center justify-center shadow">
                        <Check className="text-white h-3 w-3" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            className="w-full bg-[#E8523A] hover:bg-[#E8523A]/90 text-white font-bold py-3 text-base"
            disabled={!alias.trim() || !selectedId}
            onClick={() => onSave(alias.trim(), selectedId)}
          >
            ¡Listo, soy exploradora!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CurrentBookSection() {
  const { data: currentBookData } = useGetCurrentBook();
  const book = currentBookData?.book;

  if (!book) return null;

  const percent = Math.round((book.currentWeek / book.totalWeeks) * 100);

  return (
    <section className="py-24 bg-[#0F1F3D] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative compass */}
          <Compass className="absolute -right-20 -bottom-20 w-96 h-96 text-white/5 rotate-45 pointer-events-none" />
          
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 flex items-center gap-3">
            <Map className="text-[#F5E642]" />
            En Ruta Ahora
          </h2>

          <div className="grid md:grid-cols-12 gap-12 items-center relative z-10">
            <div className="md:col-span-4 relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#E8523A] to-[#4DC8E0] opacity-30 blur-xl group-hover:opacity-50 transition-opacity rounded-xl"></div>
              <img src={book.coverUrl} alt={book.title} className="w-full rounded-xl shadow-2xl relative z-10" />
              <Badge className="absolute -top-3 -right-3 z-20 bg-[#F5E642] text-[#0F1F3D] hover:bg-[#F5E642] text-sm font-bold border-none shadow-lg">
                {book.genre}
              </Badge>
            </div>

            <div className="md:col-span-8 space-y-8">
              <div>
                <h3 className="font-display font-bold text-4xl md:text-5xl mb-2">{book.title}</h3>
                <p className="text-xl text-gray-300 font-serif italic">{book.author}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-[#4DC8E0]">
                  <span>Progreso de viaje</span>
                  <span>Semana {book.currentWeek} de {book.totalWeeks}</span>
                </div>
                <Progress value={percent} className="h-3 bg-white/10" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Próxima Parada</h4>
                  <p className="font-bold text-[#E8523A] text-lg">{book.nextSessionDate}</p>
                  <p className="text-sm text-gray-300 mt-1">{book.nextSessionDescription}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Misión de la Semana</h4>
                  <p className="text-sm text-gray-300 bg-white/5 p-3 rounded border border-white/5">
                    {book.weekActivity}
                  </p>
                </div>
              </div>

              {book.motivationalPhrase && (
                <div className="pt-6">
                  <p className="text-lg md:text-xl font-serif italic text-[#F5E642] text-center bg-[#F5E642]/10 p-4 rounded-xl border border-[#F5E642]/20">
                    "{book.motivationalPhrase}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0F1F3D] border-t border-white/10 pt-16 pb-8 text-white text-center md:text-left">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center md:items-start mb-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-[#E8523A] h-8 w-8" />
              <span className="font-display font-bold text-2xl tracking-tight">Páginas Abiertas</span>
            </div>
            <p className="text-gray-400 italic">Cada página es un nuevo destino.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="font-bold mb-4 uppercase text-xs tracking-wider text-gray-500">Navegación</h4>
            <div className="space-y-2 flex flex-col">
              <button onClick={() => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" })} className="text-gray-300 hover:text-white text-sm">Inicio</button>
              <button onClick={() => document.getElementById("club")?.scrollIntoView({ behavior: "smooth" })} className="text-gray-300 hover:text-white text-sm">El Club</button>
              <button onClick={() => document.getElementById("votacion")?.scrollIntoView({ behavior: "smooth" })} className="text-gray-300 hover:text-white text-sm">Votación</button>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-bold mb-4 uppercase text-xs tracking-wider text-gray-500">Síguenos</h4>
            <a
              href="https://www.tiktok.com/@paginasabiertas"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#010101] transition-colors group"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.74a8.26 8.26 0 0 0 4.82 1.53V6.79a4.85 4.85 0 0 1-1.05-.1z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 pt-8 border-t border-white/5">
          © {new Date().getFullYear()} Páginas Abiertas Club. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#E8523A] selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <ClubSection />
        <GenresSection />
        <VotingSection />
        <LeaderboardSection />
        <CurrentBookSection />
      </main>
      <Footer />
    </div>
  );
}
