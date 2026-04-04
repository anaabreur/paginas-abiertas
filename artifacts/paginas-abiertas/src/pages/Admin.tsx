import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BookOpen, Settings, Users, Vote, Plus, Edit2, Trash2, KeyRound } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  useVerifyAdminPassword,
  useGetVotingSession,
  useCreateVotingSession,
  useCloseVotingSession,
  useOpenVotingSession,
  useGetVotingBooks,
  useAddCandidateBook,
  useGenerateVotingCodes,
  useGetVotingCodes,
  useGetAdminLeaderboard,
  useAddMember,
  useUpdateMember,
  useArchiveMember,
  useGetCurrentBook,
  useUpdateCurrentBook,
  getGetVotingSessionQueryKey,
  getGetVotingBooksQueryKey,
  getGetVotingCodesQueryKey,
  getGetAdminLeaderboardQueryKey,
  getGetCurrentBookQueryKey
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
  const addBook = useAddCandidateBook();
  const generateCodes = useGenerateVotingCodes();

  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  const sessionForm = useForm({ defaultValues: { title: "", deadline: "" } });
  const bookForm = useForm({ defaultValues: { title: "", author: "", genre: "", coverUrl: "", synopsis: "" } });
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
                      <FormLabel>Título (Ej: Febrero 2026)</FormLabel>
                      <Input {...sessionForm.register("title")} required />
                    </div>
                    <div className="space-y-2">
                      <FormLabel>Fecha Límite (Opcional)</FormLabel>
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
                <div>
                  <h3 className="font-bold text-xl">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    Creada: {format(new Date(session.createdAt), "dd/MM/yyyy")} 
                    {session.deadline && ` • Cierra: ${format(new Date(session.deadline), "dd/MM/yyyy")}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
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
                    <TableCell>
                      {book.isWinner && <Badge className="bg-yellow-500">Ganador</Badge>}
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
                  <FormLabel className="text-xs">Cantidad</FormLabel>
                  <Input type="number" {...codeForm.register("quantity")} min={1} max={50} />
                </div>
                <div className="flex-1 space-y-1">
                  <FormLabel className="text-xs">Tipo</FormLabel>
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
  const form = useForm({ defaultValues: { alias: "", avatar: "", points: 0 } });

  const handleAdd = (values: any) => {
    addMember.mutate({ data: { ...values, points: Number(values.points) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminLeaderboardQueryKey() });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Éxito", description: "Miembro añadido" });
      }
    });
  };

  const handleUpdatePoints = (id: number, points: number) => {
    updateMember.mutate({ id, data: { points } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetAdminLeaderboardQueryKey() })
    });
  };

  const handleArchive = (id: number) => {
    if(confirm("¿Seguro que quieres archivar este miembro? No aparecerá en el ranking público.")) {
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
          <CardDescription>Administra puntos y rangos</CardDescription>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0F1F3D] text-white"><Plus className="w-4 h-4 mr-2"/> Nuevo Miembro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Exploradora Manual</DialogTitle></DialogHeader>
            <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
              <Input placeholder="Alias" {...form.register("alias")} required />
              <Input placeholder="URL Avatar" {...form.register("avatar")} required />
              <Input type="number" placeholder="Puntos Iniciales" {...form.register("points")} required />
              <Button type="submit" className="w-full" disabled={addMember.isPending}>Guardar</Button>
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
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map(m => (
              <TableRow key={m.id} className={m.archived ? "opacity-50 bg-gray-50" : ""}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8"><AvatarImage src={m.avatar}/></Avatar>
                  <span className="font-bold">{m.alias} {m.archived && "(Archivado)"}</span>
                </TableCell>
                <TableCell><Badge variant="outline">{m.rank}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 max-w-[120px]">
                    <Input 
                      type="number" 
                      defaultValue={m.points} 
                      className="h-8 w-20 text-right"
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== m.points) handleUpdatePoints(m.id, val);
                      }}
                      disabled={m.archived}
                    />
                  </div>
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
