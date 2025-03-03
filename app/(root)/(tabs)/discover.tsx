import { ScrollView } from "react-native";
import SuggestedHabits from "@/components/tabs/discover/SuggestedHabits";
import HabitClubs from "@/components/tabs/discover/HabitClubs";
import Challenges from "@/components/tabs/discover/Challenges";
import MeetFriends from "@/components/tabs/discover/MeetFriends";
import Learning from "@/components/tabs/discover/Learning";
import DiscoverHeader from "@/components/tabs/discover/DiscoverHeader";

export default function Discover() {
  return (
    <ScrollView className="">
      <DiscoverHeader />
      <SuggestedHabits />
      <HabitClubs />
      <Challenges />
      <Learning />
      <MeetFriends />
    </ScrollView>
  );
}
