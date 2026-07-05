import React, { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Trophy, Plus, Calendar, Medal, Crown, Star } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const placeIcons = [Crown, Medal, Star];

export default function AdminCompetitions() {
  const { data: competitions, isLoading, refetch } = trpc.admin.getCompetitions.useQuery(undefined, { retry: false });
  const createMutation = trpc.admin.createCompetition.useMutation({
    onSuccess: () => { toast.success("Competition created"); refetch(); setIsOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", prize: "", difficulty: "All Levels", startsAt: "", endsAt: "" });
  const [selectedComp, setSelectedComp] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => { e.preventDefault(); createMutation.mutate(form); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Trophy className="h-6 w-6" /> Competitions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create competitions, manage entries, and select winners</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Create Competition</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Competition</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Prize</Label><Input value={form.prize} onChange={(e) => setForm({...form, prize: e.target.value})} /></div>
                <div className="space-y-2"><Label>Difficulty</Label><Input value={form.difficulty} onChange={(e) => setForm({...form, difficulty: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({...form, startsAt: e.target.value})} /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({...form, endsAt: e.target.value})} /></div>
              </div>
              <DialogFooter><Button type="submit" disabled={createMutation.isPending}>Create</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}</div>
      ) : !competitions || competitions.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">No competitions yet</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {competitions.map((c) => (
            <Card key={c.id} className={`hover:shadow-md transition-shadow cursor-pointer ${selectedComp === c.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedComp(selectedComp === c.id ? null : c.id)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Trophy className={`h-6 w-6 ${c.isActive ? "text-amber-500" : "text-muted-foreground"}`} />
                  <Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <h3 className="font-semibold mb-1">{c.title}</h3>
                {c.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {c.difficulty && <span>{c.difficulty}</span>}
                  {c.prize && <span>🏆 {c.prize}</span>}
                </div>
                {c.endsAt && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Ends {formatDistanceToNow(new Date(c.endsAt), { addSuffix: true })}
                  </p>
                )}
                {selectedComp === c.id && (
                  <div className="mt-3 pt-3 border-t">
                    <EntriesTab competitionId={c.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EntriesTab({ competitionId }: { competitionId: number }) {
  const { data: entries, isLoading, refetch } = trpc.admin.getCompetitionEntries.useQuery(
    { competitionId }, { retry: false },
  );
  const selectWinner = trpc.admin.selectWinner.useMutation({
    onSuccess: () => { toast.success("Winner selected!"); refetch(); },
  });
  const removeWinner = trpc.admin.removeWinner.useMutation({
    onSuccess: () => { toast.success("Winner removed"); refetch(); },
  });

  if (isLoading) return <Skeleton className="h-20 w-full" />;

  if (!entries || entries.length === 0) {
    return <div className="text-center py-6 text-sm text-muted-foreground">No entries yet</div>;
  }

  const winners = entries.filter(e => e.isWinner).sort((a, b) => (a.winnerPlace || 99) - (b.winnerPlace || 99));
  const nonWinners = entries.filter(e => !e.isWinner);

  return (
    <div className="space-y-3">
      {winners.length > 0 && (
        <div>
          <p className="text-xs font-medium text-amber-600 mb-2 flex items-center gap-1">
            <Crown className="h-3 w-3" /> Winners
          </p>
          <div className="space-y-2">
            {winners.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between bg-amber-50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  {entry.winnerPlace && (
                    <span className="text-amber-600 font-bold text-sm">#{entry.winnerPlace}</span>
                  )}
                  <div>
                    <p className="text-sm font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">User #{entry.userId}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive h-7"
                  onClick={() => removeWinner.mutate({ entryId: entry.id })}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {nonWinners.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Entries ({nonWinners.length})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {nonWinners.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between border rounded-lg p-2">
                <div>
                  <p className="text-sm font-medium">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">User #{entry.userId}</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((place) => (
                    <Button key={place} size="sm" variant="ghost" className="h-7 w-7 p-0"
                      onClick={() => selectWinner.mutate({ entryId: entry.id, place })}>
                      {React.createElement(placeIcons[place - 1], { className: "h-3 w-3" })}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


