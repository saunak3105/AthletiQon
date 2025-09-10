import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

const generateLeaderboardData = (count: number, location: string) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      rank: i,
      name: `Athlete ${i}${location.charAt(0)}`,
      score: Math.floor(10000 - i * 50 - Math.random() * 100),
      location: `${location} City, ${location.slice(0, 2).toUpperCase()}`,
    });
  }
  return data;
};

const localData = [
  ...generateLeaderboardData(10, 'Local'),
  { rank: 12, name: 'You', score: 8200, location: 'Austin, USA' },
].sort((a,b) => a.rank - b.rank);

const stateData = [
  ...generateLeaderboardData(50, 'State'),
  { rank: 134, name: 'You', score: 8200, location: 'Austin, USA' },
].sort((a,b) => a.rank - b.rank);

const nationalData = [
  ...generateLeaderboardData(100, 'National'),
  { rank: 1257, name: 'You', score: 8200, location: 'Austin, USA' },
].sort((a,b) => a.rank - b.rank);

const LeaderboardTable = ({ data }: { data: typeof localData }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">Rank</TableHead>
        <TableHead>Athlete</TableHead>
        <TableHead>Location</TableHead>
        <TableHead className="text-right">Score</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((user) => (
        <TableRow
          key={user.rank}
          className={cn(user.name === 'You' && 'bg-primary/10 hover:bg-primary/20')}
        >
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              {user.rank <= 3 && <Trophy className={cn(
                  "h-5 w-5",
                  user.rank === 1 && "text-yellow-500",
                  user.rank === 2 && "text-gray-400",
                  user.rank === 3 && "text-yellow-700",
                )} />}
              <span>{user.rank}</span>
            </div>
          </TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.location}</TableCell>
          <TableCell className="text-right">{user.score}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);


export default function LeaderboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="local" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="local">Local</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="national">National</TabsTrigger>
          </TabsList>
          <TabsContent value="local">
            <LeaderboardTable data={localData} />
          </TabsContent>
          <TabsContent value="state">
            <LeaderboardTable data={stateData} />
          </TabsContent>
          <TabsContent value="national">
            <LeaderboardTable data={nationalData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
