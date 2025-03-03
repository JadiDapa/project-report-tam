import { View, Text } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

export default function ProfileHeader() {
  return (
    <View className="flex flex-row items-center justify-between px-6">
      <View className="items-center justify-center border rounded-full border-slate-400 size-10 ">
        <Text className="text-slate-500 font-cereal-bold">DP</Text>
      </View>
      <Text className="text-xl font-cereal-medium">User Profile</Text>
      <View className="items-center justify-center border rounded-full border-slate-400 size-10 ">
        <Feather name="bell" size={24} color="#57595f" />
      </View>
    </View>
  );
}

// import { View, Text, Image, Pressable } from "react-native";
// import FontAwesome5 from "@expo/vector-icsons/FontAwesome5";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { profileMenu } from "@/app/(root)/(tabs)/profile";

// export default function DiscoverHeader({
//   selectedMenu,
//   handleSelectMenu,
// }: {
//   selectedMenu: string;
//   handleSelectMenu: (menu: string) => void;
// }) {
//   return (
//     <View className="p-4 bg-white shadow-md ">
//       <View className="flex-row items-center justify-between">
//         <Text className="text-xl font-cereal-medium">Discover</Text>
//         <View className="relative items-center justify-center border border-slate-300 size-12 rounded-xl">
//           <AntDesign name="setting" size={24} color="black" />
//         </View>
//       </View>

//       <View className="flex-row gap-4 mt-4">
//         <View className="relative overflow-hidden rounded-full size-16">
//           <Image
//             source={{
//               uri: "https://avatars.githubusercontent.com/u/119063058?v=4",
//             }}
//             className="object-cover object-center w-full h-full"
//           />
//         </View>
//         <View>
//           <Text className="text-xl font-cereal-medium">Daffa Althaf</Text>
//           <View className="flex-row items-center gap-2 px-2 py-1 rounded-lg bg-warning-100">
//             <Text className="text-warning-500">
//               <FontAwesome5 name="medal" size={16} />
//             </Text>
//             <Text className="text-warning-500">1072 Points</Text>
//           </View>
//         </View>
//       </View>
//       <View className="flex flex-row p-0.5 mt-4 rounded-full bg-slate-200">
//         {profileMenu.map((item) => (
//           <Pressable
//             key={item}
//             onPress={() => handleSelectMenu(item)}
//             className={`flex-1 py-1.5 rounded-full ${
//               selectedMenu === item ? "bg-white" : ""
//             }`}
//           >
//             <Text
//               className={`text-center font-cereal-medium ${
//                 selectedMenu === item ? "text-primary-500" : ""
//               }`}
//             >
//               {item.charAt(0).toUpperCase() + item.slice(1)}
//             </Text>
//           </Pressable>
//         ))}
//       </View>
//     </View>
//   );
// }
