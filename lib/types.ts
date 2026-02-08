// Datenmodell für den Ringmaster

export interface Character {
  id: string
  name: string
  position: "main_event" | "upper_card" | "mid_card" | "lower_card" | "jobber" | "road_agent" | "manager" | "staff" | "commentary" | "referee"
  alignment: "face" | "heel" | "tweener"
  status: "active" | "injured" | "suspended" | "retired" | "inactive"
  hometown?: string
  imageUrl?: string
  avatarBlobId?: string
  contractAvailableUntil?: Date
  createdAt: Date
  updatedAt: Date
  championships?: string[]
}

export interface Promotion { 
  id: string; 
  name: string; 
  foundedYear: string; 
  owner: string; 
  logoBase64?: string; 
  createdAt: Date; 
  updatedAt: Date; 
}

export interface Arena {
  id: string
  name: string
  location: string
  capacity: number
  createdAt: Date
  updatedAt: Date
}

export interface Show {
  id: string
  name: string
  type: "weekly" | "ppv" | "special"
  frequency?: "weekly" | "bi_weekly" | "monthly" | "quarterly" | "yearly"
  description?: string
  defaultDuration?: number
  createdAt: Date
  updatedAt: Date
}

export interface Relationship {
  id: string
  characterIds: string[]
  type: "tag_team" | "stable" | "manager" | "rivalry" | "friendship"
  description: string
  intensity: number
  episodes: string[]
  evolution: RelationshipEvent[]
  teamName?: string
  isActive?: boolean
}

export interface RelationshipEvent {
  id: string
  episodeId: string
  description: string
  impactOnIntensity: number
  timestamp: Date
}

export interface CharacterArc {
  id: string
  characterId: string
  title: string
  description: string
  startEpisodeId?: string
  endEpisodeId?: string
  status: "planned" | "active" | "completed"
  milestones: ArcMilestone[]
  image?: string
  createdAt: Date
  updatedAt: Date
  type: "singles" | "tag_team" | "trios" | "six_man"
  prestige: "world" | "national" | "regional" | "local" | "developmental"
  currentChampionIds: string[]
  championHistory: ChampionshipReign[]
}

export interface ChampionshipReign {
  id: string
  championIds: string[]
  championNames?: string[]
  dateWon: Date
  dateLost?: Date
  defenses: number
  isHistorical?: boolean
}

export interface ArcMilestone {
  id: string
  title: string
  description: string
  episodeId?: string
  completed: boolean
}

export interface Storyline {
  id: string
  title: string
  description: string
  type: "main" | "subplot"
  status: "planning" | "active" | "paused" | "completed"
  characterIds: string[]
  color: string
  createdAt: Date
  characterReview?: string
  summary?: string
  storylineQuestions?: string
}

export interface Segment {
  id: string
  title: string
  description: string
  storylineIds?: string[]
  characterIds: string[]
  notes: string
  duration: number
  order: number
}

export interface CharacterAppearance {
  characterId: string
  characterName: string
  appearanceCount: number
  totalScreenTime: number
  segments: string[]
}

export interface StorylineProgress {
  storylineId: string
  storylineTitle: string
  storylineColor: string
  segmentCount: number
  characterIds: string[]
  status: "advanced" | "completed" | "paused" | "continued"
}

export interface EventReport {
  generatedAt: Date
  totalDuration: number
  segmentCount: number
  characterAppearances: CharacterAppearance[]
  storylineProgress: StorylineProgress[]
  summary: string
}

export interface Event {
  id: string
  eventType: "Weekly TV" | "PPV" | "TV-Special"
  eventNumber: number
  title: string
  synopsis: string
  sceneIds: string[]
  airDate?: Date
  imageUrl?: string
  status: "planning" | "writing" | "production" | "completed"
  notes: string
  completionReport?: EventReport
}

export interface Season {
  id: string
  number: number
  title: string
  description: string
  episodeIds: string[]
}

export interface Location {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Mood {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StateOfTheArtReport {
  generatedAt: Date
  totalActiveStorylines: number
  totalSegments: number
  totalBookedTime: number
  storylines: StorylineReport[]
  events: EventTimeAllocation[]
  summary: string
}

export interface StorylineReport {
  storyline: Storyline
  segments: Segment[]
  totalSegmentTime: number
  eventAssignments: EventAssignment[]
  availableEvents: Event[]
  characters: Character[]
  storylineQuestions?: string
}

export interface EventAssignment {
  eventId: string
  eventTitle: string
  eventType: string
  eventNumber: number
  segmentIds: string[]
  totalBookedTime: number
}

export interface EventTimeAllocation {
  event: Event
  totalDuration: number
  bookedDuration: number
  availableDuration: number
  assignedStorylines: string[]
}

export interface Series {
  id: string
  title: string
  logline: string
  genre: string[]
  createdAt: Date
  coverImageUrl?: string
  coverImageBlobId?: string
}

export interface SeriesData {
  series: Series[]
  characters: Character[]
  relationships: Relationship[]
  characterArcs: CharacterArc[]
  storylines: Storyline[]
  segments: Segment[]
  episodes: Event[]
  seasons: Season[]
  locations: Location[]
  moods: Mood[]
  promotions: Promotion[]
  arenas: Arena[]
  shows: Show[]
}
