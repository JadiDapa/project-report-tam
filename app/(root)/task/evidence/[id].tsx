import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Image,
} from "react-native";
import LoadingScreen from "@/components/LoadingScreen";
import StackScreenHeader from "@/components/StackScreenHeader";
import { format } from "date-fns";
import { Cog, Send } from "lucide-react-native";
import {
  getTaskEvidenceById,
  updateTaskEvidence,
} from "@/lib/network/task-evidence";
import UploadTaskEvidence from "@/components/task/evidence/UploadTaskEvidences";
import { CreateTaskEvidenceType } from "@/lib/types/task-evidence";
import { useCustomToast } from "@/lib/useToast";
import FloatingInput from "@/components/FloatingInput";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";

export default function EvidenceDetail() {
  const [detail, setDetail] = useState<string>("");
  const [createEvidence, setCreateEvidence] = useState<boolean>(false);
  const [uploadedEvidences, setUploadedEvidences] = useState<
    CreateTaskEvidenceImageType[]
  >([]);

  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { showToast } = useCustomToast();

  const { data: evidence } = useQuery({
    queryFn: () => getTaskEvidenceById(id as string),
    queryKey: ["evidences", id],
  });

  useEffect(() => {
    if (
      evidence?.TaskEvidenceImages &&
      evidence.TaskEvidenceImages.length > 0
    ) {
      setUploadedEvidences(
        evidence.TaskEvidenceImages.map((image) => ({
          id: image.id,
          image: image.image,
          taskEvidenceId: image.taskEvidenceId,
          accountId: image.accountId,
        }))
      );
    }

    if (evidence?.description) {
      setDetail(evidence.description);
    }
  }, [evidence]);

  const { mutate: onCreateTaskEvidence } = useMutation({
    mutationFn: (values: CreateTaskEvidenceType) =>
      updateTaskEvidence(evidence!.id.toString(), values),
    onSuccess: () => {
      showToast("Success", "Evidence Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["evidences", id] });
      setCreateEvidence(false);
      setDetail("");
    },
    onError: (err) => {
      console.log(err);
      showToast("Error", err?.message || "Failed To Create Task");
    },
  });

  const onSubmit = () => {
    onCreateTaskEvidence({
      title: evidence?.title ?? "",
      taskId: Number(evidence?.taskId),
      description: detail,
    });
  };

  if (!evidence) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-primary-50 ">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Report Detail" />
      <ScrollView>
        <View className="">
          <View className="px-6 py-6 bg-white">
            <View className="flex flex-row items-center justify-center gap-2 ">
              <Cog color="#444" size={24} />
              <Text className="text-lg text-center font-cereal-medium text-slate-700">
                TASK EVIDENCE
              </Text>
              <Cog color="#444" size={24} />
            </View>

            <Text className="mt-3 text-lg leading-tight text-center capitalize text-primary-500 font-cereal-medium">
              {evidence.title}
            </Text>

            <Text className="mt-2 text-center text-primary-300 font-cereal-regular">
              {format(evidence.createdAt, "dd MMMM yyyy, HH:mm")}
            </Text>
          </View>

          {createEvidence ? (
            <View className="relative flex-row gap-3 px-6 py-6 mt-3 bg-white">
              <View className="flex-1">
                <FloatingInput
                  label="Description"
                  value={detail}
                  onChangeText={setDetail}
                />
              </View>

              <Pressable
                onPress={() => onSubmit()}
                className="justify-center px-2 rounded-md bg-primary-500"
              >
                <Send className="" color={"#fff"} />
              </Pressable>
            </View>
          ) : (
            <View className="flex-row items-end justify-between px-6 py-6 mt-3 bg-white">
              <View>
                <Text className="text-lg text-slate-600 font-cereal-medium">
                  Description
                </Text>
                <Text className="text-lg text-slate-600 font-cereal-regular">
                  {evidence.description || "No Description Provided"}
                </Text>
              </View>

              <Pressable
                onPress={() => setCreateEvidence(true)}
                className="justify-center px-2 py-1 rounded-md bg-primary-500"
              >
                <Text className="text-sm text-white font-cereal-regular ">
                  {evidence.description
                    ? "Edit Description"
                    : "Add Description"}
                </Text>
              </Pressable>
            </View>
          )}

          <UploadTaskEvidence
            uploadedEvidences={uploadedEvidences}
            setUploadedEvidences={setUploadedEvidences}
            evidenceId={evidence.id.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
