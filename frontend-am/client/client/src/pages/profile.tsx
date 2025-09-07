import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, Trophy, LogOut, Save, MapPin, Calendar, Award } from "lucide-react";
import AchievementBadge from "@/components/ui/achievement-badge";

export default function Profile() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    sport: "",
    position: "",
    height: "",
    weight: "",
    state: "",
    city: "",
    school: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: athleteProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/athlete-profile"],
    retry: false,
  });

  const { data: userAchievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements/user"],
    retry: false,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (athleteProfile) {
      setFormData({
        age: athleteProfile.age?.toString() || "",
        sport: athleteProfile.sport || "",
        position: athleteProfile.position || "",
        height: athleteProfile.height || "",
        weight: athleteProfile.weight || "",
        state: athleteProfile.state || "",
        city: athleteProfile.city || "",
        school: athleteProfile.school || "",
      });
    }
  }, [athleteProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/athlete-profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your athlete profile has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete-profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    const profileData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
    };

    updateProfileMutation.mutate(profileData);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const email = user?.email || "";
  const profileImageUrl = user?.profileImageUrl;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
            <div>
              <h1 data-testid="text-page-title" className="text-lg font-bold">Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your athlete profile</p>
            </div>
          </div>
          
          <Button
            data-testid="button-logout"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* User Info */}
        <Card data-testid="card-user-info">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Account Information</span>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button data-testid="button-edit-profile" size="sm" variant="outline">
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-edit-profile" className="sm:max-w-md max-h-screen overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Athlete Profile</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          data-testid="input-age"
                          type="number"
                          placeholder="Age"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sport">Sport</Label>
                        <Select
                          value={formData.sport}
                          onValueChange={(value) => setFormData({ ...formData, sport: value })}
                        >
                          <SelectTrigger data-testid="select-sport">
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="baseball">Baseball</SelectItem>
                            <SelectItem value="track">Track & Field</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                            <SelectItem value="wrestling">Wrestling</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        data-testid="input-position"
                        placeholder="Position/Role"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (inches)</Label>
                        <Input
                          id="height"
                          data-testid="input-height"
                          type="number"
                          step="0.5"
                          placeholder="Height"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (lbs)</Label>
                        <Input
                          id="weight"
                          data-testid="input-weight"
                          type="number"
                          step="0.5"
                          placeholder="Weight"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => setFormData({ ...formData, state: value })}
                        >
                          <SelectTrigger data-testid="select-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="PA">Pennsylvania</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="OH">Ohio</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="NC">North Carolina</SelectItem>
                            <SelectItem value="MI">Michigan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          data-testid="input-city"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input
                        id="school"
                        data-testid="input-school"
                        placeholder="School/Organization"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        data-testid="button-cancel-edit"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        data-testid="button-save-profile"
                        onClick={handleSubmit}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1"
                      >
                        {updateProfileMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save size={16} />
                            <span>Save</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 data-testid="text-user-name" className="text-xl font-semibold">
                  {firstName} {lastName}
                </h3>
                <p data-testid="text-user-email" className="text-muted-foreground">{email}</p>
              </div>
            </div>

            {profileLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : athleteProfile ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Age</Label>
                  <p data-testid="text-age" className="font-medium">{athleteProfile.age || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Sport</Label>
                  <p data-testid="text-sport" className="font-medium capitalize">{athleteProfile.sport || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Position</Label>
                  <p data-testid="text-position" className="font-medium">{athleteProfile.position || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Overall Score</Label>
                  <p data-testid="text-overall-score" className="font-medium text-accent">
                    {athleteProfile.overallScore ? parseFloat(athleteProfile.overallScore).toFixed(1) : "--"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Height</Label>
                  <p data-testid="text-height" className="font-medium">
                    {athleteProfile.height ? `${athleteProfile.height}"` : "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Weight</Label>
                  <p data-testid="text-weight" className="font-medium">
                    {athleteProfile.weight ? `${athleteProfile.weight} lbs` : "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <p data-testid="text-location" className="font-medium flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>
                      {athleteProfile.city && athleteProfile.state 
                        ? `${athleteProfile.city}, ${athleteProfile.state}`
                        : "Not set"}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">School</Label>
                  <p data-testid="text-school" className="font-medium">{athleteProfile.school || "Not set"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Complete your athlete profile to track your performance and compete on leaderboards
                </p>
                <Button data-testid="button-create-profile" onClick={() => setIsEditing(true)}>
                  Create Athlete Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card data-testid="card-achievements">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-accent" size={20} />
              <span>Achievements</span>
              <Badge variant="outline">{userAchievements.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : userAchievements.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {userAchievements.map((achievement: any, index: number) => (
                  <AchievementBadge 
                    key={achievement.id} 
                    achievement={achievement} 
                    showDate
                    testId={`profile-achievement-${index}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Award className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h4 className="font-medium mb-2">No achievements yet</h4>
                <p className="text-sm text-muted-foreground">
                  Complete fitness tests to unlock your first achievement!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card data-testid="card-account-stats">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="text-primary" size={20} />
              <span>Account Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member Since</span>
                <span data-testid="text-member-since" className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profile Completed</span>
                <span data-testid="text-profile-completion" className="font-medium">
                  {athleteProfile ? "100%" : "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Achievements Unlocked</span>
                <span data-testid="text-achievements-count" className="font-medium text-accent">
                  {userAchievements.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
