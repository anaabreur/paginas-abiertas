import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BookOpen, Globe, Users, Vote, Plus, Trash2, KeyRound, Pencil, Check, X, ChevronDown, ChevronUp, Camera, Image } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLUB_AVATARS, ClubAvatar } from "@/components/Avatars";

import {
  useVerifyAdminPassword,
  useGetVotingSession,
  useCreateVotingSession,
  useCloseVotingSession,
  useOpenVotingSession,
  useUpdateVotingSession,
  useGetVotingBooks,
  useAddCandidateBook,
  useUpdateCandidateBook,
  useDeleteCandidateBook,
  useGenerateVotingCodes,
  useGetVotingCodes,
  useGetAdminLeaderboard,
  useAddMember,
  useUpdateMember,
  useArchiveMember,
  useGetCurrentBook,
  useUpdateCurrentBook,
  useGetLiteraryCountries,
  useUpdateLiteraryCountry,
  useGetCountryExpeditions,
  useGetCountryGallery,
  useAddExpedition,
  useUpdateExpedition,
  useDeleteExpedition,
  useAddGalleryPhoto,
  useDeleteGalleryPhoto,
  getGetVotingSessionQueryKey,
  getGetVotingBooksQueryKey,
  getGetVotingCodesQueryKey,
  getGetAdminLeaderboardQueryKey,
  getGetCurrentBookQueryKey,
  getGetLiteraryCountriesQueryKey,
  getGetCountryExpeditionsQueryKey,
  getGetCountryGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const [isAuthenticated, setIsAuth] = useState(false);
  const verifyPassword = useVerifyAdminPassword();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    
    verifyPassword.mutate({ data: { password } }, {
      onSuccess: () => setIsAuth(true),
      onError: () => {
        toast({ title: "Error", description: "Contraseña incorrecta", variant: "destructive" });
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F1F3D] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-[#E8523A]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="h-8 w-8 text-[#E8523A]" />
            </div>
            <CardTitle className="font-display text-2xl text-[#0F1F3D]">Acceso Restringido</CardTitle>
            <CardDescription>Panel de administración de Páginas Abiertas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="password" name="password" placeholder="Contraseña secreta..." className="h-12 text-center text-lg" required />
              <Button type="submit" className="w-full h-12 bg-[#0F1F3D] hover:bg-[#0F1F3D]/90 text-white font-bold" disabled={verifyPassword.isPending}>
                {verifyPassword.isPending ? "Verificando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[#E8523A] h-6 w-6" />
          <span className="font-display font-bold text-xl text-[#0F1F3D]">PA Admin</span>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sesión Segura</Badge>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Tabs defaultValue="voting" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 w-full justify-start h-auto overflow-x-auto">
            <TabsTrigger value="voting" className="data-[state=active]:bg-[#0F1F3D] data-[state=active]:text-white px-6 py-2.5 rounded-md">
              <Vote className="w-4 h-4 mr-2" /> Votación
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#0F1F3D] data-[state=active]:text-white px-6 py-2.5 rounded-md">
              <Users className="w-4 h-4 mr-2" /> Exploradoras
            </TabsTrigger>
            <TabsTrigger value="current" className="data-[state=active]:bg-[#0F1F3D] data-[state=active]:text-white px-6 py-2.5 rounded-md">
              <BookOpen className="w-4 h-4 mr-2" /> Libro en Ruta
            </TabsTrigger>
            <TabsTrigger value="countries" className="data-[state=active]:bg-[#0F1F3D] data-[state=active]:text-white px-6 py-2.5 rounded-md">
              <Globe className="w-4 h-4 mr-2" /> Países Literarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voting" className="m-0">
            <VotingAdminTab />
          </TabsContent>
          <TabsContent value="leaderboard" className="m-0">
            <LeaderboardAdminTab />
          </TabsContent>
          <TabsContent value="current" className="m-0">
            <CurrentBookAdminTab />
          </TabsContent>
          <TabsContent value="countries" className="m-0">
            <LiteraryCountriesAdminTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function VotingAdminTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: sessionData } = useGetVotingSession();
  const { data: books } = useGetVotingBooks();
  const { data: codes } = useGetVotingCodes();

  const session = sessionData?.session;

  const createSession = useCreateVotingSession();
  const closeSession = useCloseVotingSession();
  const openSession = useOpenVotingSession();
  const updateSession = useUpdateVotingSession();
  const addBook = useAddCandidateBook();
  const updateBook = useUpdateCandidateBook();
  const deleteBook = useDeleteCandidateBook();
  const generateCodes = useGenerateVotingCodes();

  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [isEditDeadlineOpen, setIsEditDeadlineOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [editDeadline, setEditDeadline] = useState("");

  const sessionForm = useForm({ defaultValues: { title: "", deadline: "" } });
  const bookForm = useForm({ defaultValues: { title: "", author: "", genre: "", coverUrl: "", synopsis: "" } });
  const editBookForm = useForm({ defaultValues: { title: "", author: "", genre: "", coverUrl: "", synopsis: "" } });
  const codeForm = useForm({ defaultValues: { quantity: 10, type: "standard" as const } });

  const handleCreateSession = (values: any) => {
    createSession.mutate({ data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVotingSessionQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetVotingBooksQueryKey() });
        setIsNewSessionOpen(false);
        toast({ title: "Éxito", description: "Sesión creada" });
      }
    });
  };

  const handleToggleStatus = (checked: boolean) => {
    if (!session) return;
    if (checked) {
      openSession.mutate({ id: session.id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetVotingSessionQueryKey() })
      });
    } else {
      closeSession.mutate({ id: session.id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetVotingSessionQueryKey() })
      });
    }
  };

  const handleUpdateDeadline = () => {
    if (!session) return;
    updateSession.mutate({ id: session.id, data: { deadline: editDeadline || null } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVotingSessionQueryKey() });
        setIsEditDeadlineOpen(false);
        setEditDeadline("");
        toast({ title: "Éxito", description: "Fecha de cierre actualizada" });
      }
    });
  };

  const openEditDeadlineDialog = () => {
    if (session?.deadline) {
      const d = new Date(session.deadline);
      setEditDeadline(d.toISOString().split('T')[0]);
    } else {
      setEditDeadline("");
    }
    setIsEditDeadlineOpen(true);
  };

  const handleAddBook = (values: any) => {
    addBook.mutate({ data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVotingBooksQueryKey() });
        setIsAddBookOpen(false);
        bookForm.reset();
        toast({ title: "Éxito", description: "Libro añadido" });
      }
    });
  };

  const handleEditBook = (values: any) => {
    if (!editingBookId) return;
    updateBook.mutate({ id: editingBookId, data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVotingBooksQueryKey() });
        setIsEditBookOpen(false);
        setEditingBookId(null);
        editBookForm.reset();
        toast({ title: "Éxito", description: "Libro actualizado" });
      }
    });
  };

  const handleDeleteBook = (bookId: number) => {
    if (!confirm("¿Eliminar este libro?")) return;
    deleteBook.mutate({ id: bookId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVotingBooksQueryKey() });
        toast({ title: "Éxito", description: "Libro eliminado" });
      }
    });
  };

  const openEditDialog = (book: any) => {
    setEditingBookId(book.id);
    editBookForm.reset({
      title: book.title,
      author: book.author,
      genre: book.genre,
      coverUrl: book.coverUrl,
      synopsis: book.synopsis
    });
    setIsEditBookOpen(true);
  };

  const handleGenerateCodes = (values: any) => {
    generateCodes.mutate({ data: { quantity: Number(values.quantity), type: values.type } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetVotingCodesQueryKey() });
        toast({ title: "Éxito", description: "Códigos generados" });
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Session Control */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <CardTitle>Sesión Actual</CardTitle>
              <CardDescription>Controla el estado de la votación</CardDescription>
            </div>
            {!session && (
              <Dialog open={isNewSessionOpen} onOpenChange={setIsNewSessionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#0F1F3D] text-white">Nueva Sesión</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Crear Votación</DialogTitle></DialogHeader>
                  <form onSubmit={sessionForm.handleSubmit(handleCreateSession)} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título (Ej: Febrero 2026)</label>
                      <Input {...sessionForm.register("title")} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fecha Límite (Opcional)</label>
                      <Input type="date" {...sessionForm.register("deadline")} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createSession.isPending}>Crear</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {session ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    Creada: {format(new Date(session.createdAt), "dd/MM/yyyy")} 
                    {session.deadline && ` • Cierra: ${format(new Date(session.deadline), "dd/MM/yyyy")}`}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={openEditDeadlineDialog}><Pencil className="w-4 h-4"/></Button>
                <Dialog open={isEditDeadlineOpen} onOpenChange={setIsEditDeadlineOpen}>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Editar Fecha de Cierre</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <Input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                      <Button onClick={handleUpdateDeadline} className="w-full" disabled={updateSession.isPending}>Guardar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm font-medium">{session.status === 'open' ? 'Abierta' : 'Cerrada'}</span>
                  <Switch 
                    checked={session.status === 'open'} 
                    onCheckedChange={handleToggleStatus}
                    disabled={openSession.isPending || closeSession.isPending}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No hay sesión activa.</div>
            )}
          </CardContent>
        </Card>

        {/* Books List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
            <CardTitle>Candidatos</CardTitle>
            <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={!session}><Plus className="w-4 h-4 mr-2"/> Añadir Libro</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nuevo Candidato</DialogTitle></DialogHeader>
                <form onSubmit={bookForm.handleSubmit(handleAddBook)} className="space-y-4">
                  <Input placeholder="Título" {...bookForm.register("title")} required />
                  <Input placeholder="Autor" {...bookForm.register("author")} required />
                  <Input placeholder="Género (Ej: Fantasía)" {...bookForm.register("genre")} required />
                  <Input placeholder="URL de Portada" {...bookForm.register("coverUrl")} required />
                  <Textarea placeholder="Sinopsis" {...bookForm.register("synopsis")} required />
                  <Button type="submit" className="w-full" disabled={addBook.isPending}>Guardar</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isEditBookOpen} onOpenChange={setIsEditBookOpen}>
              <DialogContent>
                <DialogHeader><DialogTitle>Editar Candidato</DialogTitle></DialogHeader>
                <form onSubmit={editBookForm.handleSubmit(handleEditBook)} className="space-y-4">
                  <Input placeholder="Título" {...editBookForm.register("title")} required />
                  <Input placeholder="Autor" {...editBookForm.register("author")} required />
                  <Input placeholder="Género (Ej: Fantasía)" {...editBookForm.register("genre")} required />
                  <Input placeholder="URL de Portada" {...editBookForm.register("coverUrl")} required />
                  <Textarea placeholder="Sinopsis" {...editBookForm.register("synopsis")} required />
                  <Button type="submit" className="w-full" disabled={updateBook.isPending}>Guardar Cambios</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="pt-0 p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Portada</TableHead>
                  <TableHead>Libro</TableHead>
                  <TableHead className="text-right">Votos</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books?.map(book => (
                  <TableRow key={book.id} className={book.isWinner ? "bg-yellow-50" : ""}>
                    <TableCell><img src={book.coverUrl} className="w-10 h-14 object-cover rounded" alt=""/></TableCell>
                    <TableCell>
                      <p className="font-bold">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-lg">{book.votes}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(book)}><Pencil className="w-4 h-4"/></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteBook(book.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                      {book.isWinner && <Badge className="bg-yellow-500 ml-2">Ganador</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
                {!books?.length && (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-gray-500">Sin candidatos</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Codes Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Códigos de Voto</CardTitle>
            <CardDescription>Genera códigos para repartir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={codeForm.handleSubmit(handleGenerateCodes)} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Cantidad</label>
                  <Input type="number" {...codeForm.register("quantity")} min={1} max={50} />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Tipo</label>
                  <Select defaultValue="standard" onValueChange={(v) => codeForm.setValue("type", v as any)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (1 voto)</SelectItem>
                      <SelectItem value="premium">Premium (2 votos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!session || generateCodes.isPending}>
                Generar Códigos
              </Button>
            </form>

            <div className="space-y-2">
              <h4 className="text-sm font-bold flex justify-between">
                <span>Disponibles</span>
                <span>{codes?.filter(c => !c.used).length || 0} / {codes?.length || 0}</span>
              </h4>
              <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
                {codes?.map(code => (
                  <div key={code.id} className={`flex items-center justify-between p-2 rounded text-sm font-mono border ${code.used ? 'bg-gray-50 text-gray-400 border-gray-100 line-through' : 'bg-white border-gray-200'}`}>
                    <span>{code.code}</span>
                    <Badge variant={code.type === 'premium' ? 'default' : 'secondary'} className="text-[10px] px-1 py-0 h-4">
                      {code.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LeaderboardAdminTab() {
  const queryClient = useQueryClient();
  const { data: members } = useGetAdminLeaderboard();
  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const archiveMember = useArchiveMember();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("luna");
  const [alias, setAlias] = useState("");
  const [points, setPoints] = useState(0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim() || !selectedAvatar) return;
    addMember.mutate({ data: { alias: alias.trim(), avatar: selectedAvatar, points } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminLeaderboardQueryKey() });
        setIsAddOpen(false);
        setAlias(""); setPoints(0); setSelectedAvatar("luna");
        toast({ title: "Éxito", description: "Miembro añadido" });
      }
    });
  };

  const handleUpdatePoints = (id: number, newPoints: number) => {
    updateMember.mutate({ id, data: { points: newPoints } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetAdminLeaderboardQueryKey() })
    });
  };

  const handleArchive = (id: number) => {
    if (confirm("¿Seguro que quieres archivar este miembro? No aparecerá en el ranking público.")) {
      archiveMember.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetAdminLeaderboardQueryKey() })
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Exploradoras</CardTitle>
          <CardDescription>Administra puntos y rangos del Muro de Exploradoras</CardDescription>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0F1F3D] text-white"><Plus className="w-4 h-4 mr-2"/> Nueva Exploradora</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Registrar Exploradora</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Alias</label>
                <Input placeholder="Alias" value={alias} onChange={e => setAlias(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Personaje</label>
                <div className="grid grid-cols-4 gap-2">
                  {CLUB_AVATARS.map(def => (
                    <button key={def.id} type="button" onClick={() => setSelectedAvatar(def.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${selectedAvatar === def.id ? 'border-[#E8523A] bg-[#E8523A]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="rounded-full overflow-hidden" style={{ width: 44, height: 44, background: def.bg }}>
                        <div style={{ width: 44, height: 44 }}>{def.svg}</div>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight">{def.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Puntos Iniciales</label>
                <Input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
              </div>
              <Button type="submit" className="w-full bg-[#0F1F3D] text-white" disabled={addMember.isPending || !alias.trim()}>Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Rango</TableHead>
              <TableHead>Puntos</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map(m => (
              <TableRow key={m.id} className={m.archived ? "opacity-50 bg-gray-50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <ClubAvatar avatarId={m.avatar} size={32} />
                    <span className="font-bold">{m.alias} {m.archived && <span className="text-gray-400 font-normal text-xs">(Archivada)</span>}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{m.rank}</Badge></TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={m.points}
                    className="h-8 w-24 text-right"
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (val !== m.points) handleUpdatePoints(m.id, val);
                    }}
                    disabled={m.archived}
                  />
                </TableCell>
                <TableCell>
                  {!m.archived && (
                    <Button variant="ghost" size="icon" onClick={() => handleArchive(m.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CurrentBookAdminTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data } = useGetCurrentBook();
  const updateBook = useUpdateCurrentBook();
  
  const book = data?.book;

  const form = useForm({
    values: book || {
      title: "", author: "", genre: "", coverUrl: "", synopsis: "",
      currentWeek: 1, totalWeeks: 4, nextSessionDate: "",
      nextSessionDescription: "", weekActivity: "", motivationalPhrase: ""
    }
  });

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      currentWeek: Number(values.currentWeek),
      totalWeeks: Number(values.totalWeeks)
    };
    updateBook.mutate({ data: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentBookQueryKey() });
        toast({ title: "Éxito", description: "Libro actual actualizado" });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Libro en Ruta</CardTitle>
        <CardDescription>Actualiza el progreso de lectura y la próxima reunión</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700">Información del Libro</h4>
                <FormField control={form.control} name="title" render={({field}) => (
                  <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="author" render={({field}) => (
                    <FormItem><FormLabel>Autor</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                  <FormField control={form.control} name="genre" render={({field}) => (
                    <FormItem><FormLabel>Género</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="coverUrl" render={({field}) => (
                  <FormItem><FormLabel>URL Portada</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="synopsis" render={({field}) => (
                  <FormItem><FormLabel>Sinopsis Breve</FormLabel><FormControl><Textarea {...field}/></FormControl></FormItem>
                )}/>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-700">Progreso y Misiones</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="currentWeek" render={({field}) => (
                    <FormItem><FormLabel>Semana Actual</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>
                  )}/>
                  <FormField control={form.control} name="totalWeeks" render={({field}) => (
                    <FormItem><FormLabel>Semanas Total</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="nextSessionDate" render={({field}) => (
                  <FormItem><FormLabel>Fecha Próxima Sesión (ISO: YYYY-MM-DD)</FormLabel><FormControl><Input type="date" {...field}/></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="nextSessionDescription" render={({field}) => (
                  <FormItem><FormLabel>Descripción Sesión (Ej: Discusión cap 1-5)</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="weekActivity" render={({field}) => (
                  <FormItem><FormLabel>Actividad Semanal</FormLabel><FormControl><Textarea className="h-20" {...field}/></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="motivationalPhrase" render={({field}) => (
                  <FormItem><FormLabel>Frase Motivacional</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                )}/>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-[#0F1F3D] text-white" disabled={updateBook.isPending}>
              {updateBook.isPending ? "Guardando..." : "Guardar Cambios del Libro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function CountryExpeditionsPanel({ countryId, countryEmoji }: { countryId: number; countryEmoji: string }) {
  const queryClient = useQueryClient();
  const { data: expeditions = [] } = useGetCountryExpeditions(countryId);
  const { data: gallery = [] } = useGetCountryGallery(countryId);
  const addExpedition = useAddExpedition();
  const updateExpedition = useUpdateExpedition();
  const deleteExpedition = useDeleteExpedition();
  const addPhoto = useAddGalleryPhoto();
  const deletePhoto = useDeleteGalleryPhoto();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", author: "", coverUrl: "", startDate: "", endDate: "", closingActivity: "none", closingActivityDesc: "", description: "" });
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");

  const blankForm = () => ({ title: "", author: "", coverUrl: "", startDate: "", endDate: "", closingActivity: "none", closingActivityDesc: "", description: "" });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetCountryExpeditionsQueryKey(countryId) });
    queryClient.invalidateQueries({ queryKey: getGetCountryGalleryQueryKey(countryId) });
  };

  const handleSaveExp = () => {
    if (!form.title || !form.author) {
      toast({ title: "Título y autora son requeridos", variant: "destructive" });
      return;
    }
    if (editingExpId) {
      updateExpedition.mutate({ id: editingExpId, data: form }, {
        onSuccess: () => { invalidate(); setEditingExpId(null); setForm(blankForm()); toast({ title: "Expedición actualizada" }); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    } else {
      addExpedition.mutate({ id: countryId, data: form }, {
        onSuccess: () => { invalidate(); setShowForm(false); setForm(blankForm()); toast({ title: "Expedición añadida" }); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    }
  };

  const handleDeleteExp = (id: number) => {
    deleteExpedition.mutate({ id }, {
      onSuccess: () => { invalidate(); toast({ title: "Eliminada" }); },
    });
  };

  const handleAddPhoto = () => {
    if (!photoUrl) return;
    addPhoto.mutate({ id: countryId, data: { url: photoUrl, caption: photoCaption } }, {
      onSuccess: () => { invalidate(); setPhotoUrl(""); setPhotoCaption(""); toast({ title: "Foto añadida" }); },
    });
  };

  const handleDeletePhoto = (id: number) => {
    deletePhoto.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Foto eliminada" }); } });
  };

  const expFormFields = (
    <div className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Título *</label>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título del libro" className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Autora *</label>
          <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Nombre del autor" className="h-8 text-sm" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">URL portada</label>
        <Input value={form.coverUrl} onChange={e => setForm(f => ({ ...f, coverUrl: e.target.value }))} placeholder="https://..." className="h-8 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Fecha inicio</label>
          <Input value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} placeholder="ej: marzo 2025" className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Fecha fin</label>
          <Input value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} placeholder="ej: abril 2025" className="h-8 text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Actividad de cierre</label>
          <select
            value={form.closingActivity}
            onChange={e => setForm(f => ({ ...f, closingActivity: e.target.value }))}
            className="h-8 text-sm w-full border border-gray-200 rounded-md px-2"
          >
            <option value="none">Sin actividad</option>
            <option value="cinema">🎬 Cine en casa</option>
            <option value="visit">📍 Visita al lugar</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Desc. actividad</label>
          <Input value={form.closingActivityDesc} onChange={e => setForm(f => ({ ...f, closingActivityDesc: e.target.value }))} placeholder="Descripción breve" className="h-8 text-sm" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600">Notas / reseña corta</label>
        <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Opcional" className="h-8 text-sm" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="bg-[#E8523A] text-white h-8 flex-1" onClick={handleSaveExp}>
          <Check className="w-3 h-3 mr-1" /> {editingExpId ? "Actualizar" : "Añadir expedición"}
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={() => { setShowForm(false); setEditingExpId(null); setForm(blankForm()); }}>
          <X className="w-3 h-3 mr-1" /> Cancelar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 mt-4 border-t pt-4">
      {/* Expediciones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-700">📚 Expediciones completadas</h4>
          {!showForm && !editingExpId && (
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowForm(true)}>
              <Plus className="w-3 h-3 mr-1" /> Nueva
            </Button>
          )}
        </div>

        {(showForm && !editingExpId) && expFormFields}

        {expeditions.length === 0 && !showForm ? (
          <p className="text-xs text-gray-400 italic">Ninguna expedición registrada aún.</p>
        ) : (
          <div className="space-y-2">
            {expeditions.map(exp => (
              <div key={exp.id} className="text-sm">
                {editingExpId === exp.id ? expFormFields : (
                  <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
                    <span className="flex-1 font-medium text-gray-800 truncate">{exp.title}</span>
                    <span className="text-xs text-gray-400">{exp.author}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setEditingExpId(exp.id); setShowForm(false); setForm({ title: exp.title, author: exp.author, coverUrl: exp.coverUrl, startDate: exp.startDate, endDate: exp.endDate, closingActivity: exp.closingActivity, closingActivityDesc: exp.closingActivityDesc, description: exp.description }); }}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-600" onClick={() => handleDeleteExp(exp.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Galería */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">📸 Galería de actividades</h4>
        <div className="flex gap-2 mb-3">
          <Input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="URL de foto" className="h-8 text-sm flex-1" />
          <Input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} placeholder="Pie de foto" className="h-8 text-sm w-36" />
          <Button size="sm" className="bg-[#4DC8E0] text-white h-8 px-3" onClick={handleAddPhoto} disabled={!photoUrl}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {gallery.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Sin fotos en la galería.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {gallery.map(p => (
              <div key={p.id} className="relative group">
                <img src={p.url} alt={p.caption} className="w-full aspect-square object-cover rounded-lg border border-gray-100" />
                <button
                  onClick={() => handleDeletePhoto(p.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >×</button>
                {p.caption && <p className="text-xs text-gray-500 mt-1 truncate">{p.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LiteraryCountriesAdminTab() {
  const queryClient = useQueryClient();
  const { data: countries } = useGetLiteraryCountries();
  const updateCountry = useUpdateLiteraryCountry();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", emoji: "", description: "", color: "", booksRead: 0 });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const startEdit = (c: { id: number; name: string; emoji: string; description: string; color: string; booksRead: number }) => {
    setEditingId(c.id);
    setEditForm({ name: c.name, emoji: c.emoji, description: c.description, color: c.color, booksRead: c.booksRead });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: number) => {
    updateCountry.mutate({ id, data: { ...editForm, booksRead: Number(editForm.booksRead) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetLiteraryCountriesQueryKey() });
        setEditingId(null);
        toast({ title: "Guardado", description: "País literario actualizado" });
      },
      onError: () => toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0F1F3D]">Los 7 Países Literarios</h2>
          <p className="text-sm text-gray-500">Edita el nombre, descripción, emoji, color y libros leídos de cada género</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {countries?.map(c => (
          <Card key={c.id} className={`overflow-hidden ${expandedId === c.id ? "md:col-span-2 xl:col-span-3" : ""}`}>
            {/* Preview header */}
            <div className="h-16 flex items-center px-5 gap-3 relative" style={{ backgroundColor: c.color }}>
              <span className="text-3xl">{editingId === c.id ? editForm.emoji : c.emoji}</span>
              <span className="font-display font-bold text-white text-lg">
                {editingId === c.id ? editForm.name : c.name}
              </span>
              <div className="absolute inset-2 border border-white/20 rounded-md border-dashed pointer-events-none"></div>
            </div>

            <CardContent className="p-4">
              {editingId === c.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Nombre</label>
                      <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Emoji</label>
                      <Input value={editForm.emoji} onChange={e => setEditForm(f => ({ ...f, emoji: e.target.value }))} className="h-8 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Descripción</label>
                    <Input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Color (hex)</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={editForm.color} onChange={e => setEditForm(f => ({ ...f, color: e.target.value }))} className="h-8 w-10 rounded cursor-pointer border border-gray-200" />
                        <Input value={editForm.color} onChange={e => setEditForm(f => ({ ...f, color: e.target.value }))} className="h-8 text-sm flex-1" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Libros leídos</label>
                      <Input type="number" min={0} value={editForm.booksRead} onChange={e => setEditForm(f => ({ ...f, booksRead: Number(e.target.value) }))} className="h-8 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1 bg-[#E8523A] text-white h-8" onClick={() => saveEdit(c.id)} disabled={updateCountry.isPending}>
                      <Check className="w-3 h-3 mr-1" /> Guardar
                    </Button>
                    <Button size="sm" variant="outline" className="h-8" onClick={cancelEdit}>
                      <X className="w-3 h-3 mr-1" /> Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{c.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">📚 {c.booksRead} libros leídos</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-7 text-xs ${expandedId === c.id ? "border-[#4DC8E0] text-[#4DC8E0]" : ""}`}
                        onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                      >
                        {expandedId === c.id ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        Expediciones
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEdit(c)}>
                        <Pencil className="w-3 h-3 mr-1" /> Editar
                      </Button>
                    </div>
                  </div>
                  {expandedId === c.id && (
                    <CountryExpeditionsPanel countryId={c.id} countryEmoji={c.emoji} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
