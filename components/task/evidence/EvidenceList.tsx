import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";
import Entypo from "@expo/vector-icons/Entypo";
import { Text, Pressable, Image, FlatList, Alert } from "react-native";

interface EvidenceListProps {
  onDeleteImage: (id: number) => void;
  uploadedEvidences: CreateTaskEvidenceImageType[];
  isUpload: boolean;
  setModalVisible: (visible: boolean) => void;
  setSelectedEvidence: (evidence: CreateTaskEvidenceImageType) => void;
  isUploading?: boolean;
}

export default function EvidenceList({
  onDeleteImage,
  uploadedEvidences,
  isUpload,
  setModalVisible,
  setSelectedEvidence,
  isUploading,
}: EvidenceListProps) {
  const confirmDelete = (id: number) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDeleteImage(id),
      },
    ]);
  };

  return (
    <FlatList
      data={uploadedEvidences}
      className="px-6 mt-2"
      numColumns={3}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={() =>
        isUpload ? (
          <Pressable
            onPress={() => setModalVisible(true)}
            disabled={isUploading}
            className="items-center justify-center gap-2 border-2 border-dashed w-28 h-36 rounded-xl border-slate-500 "
          >
            <Entypo name="plus" size={24} color="#56585f" />
            <Text className="font-cereal-medium">Upload</Text>
          </Pressable>
        ) : null
      }
      renderItem={({ item: evidence }) => (
        <Pressable
          onPress={() => setSelectedEvidence(evidence)}
          onLongPress={() => {
            if (evidence.id) {
              confirmDelete(evidence.id);
            }
          }}
          className="relative items-center justify-center mb-2 overflow-hidden border-2 w-28 h-36 me-2 rounded-xl border-slate-500"
        >
          <Image
            source={{ uri: evidence.image }}
            resizeMode="cover"
            className="w-full h-full"
          />
        </Pressable>
      )}
    />
  );
}
