import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import {
  Icon,
  SearchIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@/components/ui/icon";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/lib/network/account";
import { AccountType } from "@/lib/types/account";
import { Image } from "react-native";
import { getInitials } from "@/lib/getInitials";

interface SelectEmployeProps {
  selectedEmployees: number[];
  handleSelectEmployees: (employeeId: number) => void;
}

export default function SelectEmployee({
  selectedEmployees,
  handleSelectEmployees,
}: SelectEmployeProps) {
  const [showModal, setShowModal] = useState(false);

  const { data: accounts } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["accounts"],
  });

  if (!accounts) return <Text>... Loading ...</Text>;

  return (
    <View className="relative px-6 mb-2">
      <Text className="text-lg font-cereal-medium">Employee</Text>
      <SelectEmployeeModal
        accounts={accounts}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedEmployees={selectedEmployees}
        toggleEmployeeSelection={handleSelectEmployees}
      />
      <FlatList
        data={accounts.filter((u) => selectedEmployees.includes(u.id))}
        horizontal
        className="mt-2"
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() => (
          <View className="items-center me-2">
            <Pressable
              onPress={() => setShowModal(true)}
              className="items-center justify-center border-2 border-dashed rounded-full border-slate-700 size-16"
            >
              <Entypo name="plus" size={32} color="#343539" />
            </Pressable>
            <Text className="mt-1 text-xs text-center capitalize font-cereal-medium">
              Add
            </Text>
          </View>
        )}
        keyExtractor={(employee) => employee.id.toString()}
        renderItem={({ item: employee }) => (
          <View className="items-center justify-start w-20 me-1 rounded-xl">
            <View className="relative items-center justify-center overflow-hidden rounded-full bg-primary-300 size-16">
              {employee.image ? (
                <Image
                  src={employee.image}
                  className="w-full h-full "
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-xl text-white font-cereal-medium">
                  {getInitials(employee.fullname)}
                </Text>
              )}
            </View>
            <Text className="mt-1 text-xs text-center capitalize">
              {employee.fullname}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

interface SelectEmployeeModal {
  accounts: AccountType[];
  showModal: boolean;
  setShowModal: (string: boolean) => void;
  selectedEmployees: number[];
  toggleEmployeeSelection: (employeeId: number) => void;
}

function SelectEmployeeModal({
  accounts,
  showModal,
  setShowModal,
  selectedEmployees,
  toggleEmployeeSelection,
}: SelectEmployeeModal) {
  const [searchValue, setSearchValue] = useState("");
  const filteredUsers = accounts.filter((u) =>
    u.fullname.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
      <ModalContent className="pb-0 rounded-3xl">
        <ModalHeader className="flex flex-row gap-1">
          <View className="relative flex-1 border rounded-lg border-slate-600">
            <Icon
              as={SearchIcon}
              size="md"
              className="absolute -translate-y-1/2 left-2 top-1/2"
            />
            <TextInput
              onChangeText={setSearchValue}
              placeholder="Search Employee"
              className="w-full h-11 ps-10 pe-2 font-cereal-medium"
            />
            <View className="absolute items-center justify-center w-10 h-6 -translate-y-1/2 rounded-full bg-primary-200 right-2 top-1/2">
              <Text className="text-sm text-primary-600 font-cereal-medium">
                {selectedEmployees.length}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setShowModal(false)}
            className="items-center justify-center w-8 h-12 rounded-lg bg-primary-500"
          >
            <Icon as={ChevronRightIcon} size="md" className="text-white" />
          </Pressable>
        </ModalHeader>

        <ModalBody className="">
          <ScrollView className="h-56">
            {filteredUsers.map((employee: AccountType) => {
              const isSelected = selectedEmployees.includes(employee.id);
              return (
                <Pressable
                  key={employee.id}
                  onPress={() => toggleEmployeeSelection(employee.id)}
                  className={`flex flex-row items-center w-full gap-3 py-2 px-2 border-b border-slate-200 me-1 ${
                    isSelected ? "bg-primary-100" : ""
                  }`}
                >
                  <View className="relative items-center justify-center overflow-hidden rounded-full bg-primary-300 size-10">
                    {employee.image ? (
                      <Image
                        src={employee.image}
                        className="w-full h-full "
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-white font-cereal-medium">
                        {getInitials(employee.fullname)}
                      </Text>
                    )}
                  </View>
                  <Text className="flex-1 capitalize font-cereal">
                    {employee.fullname}
                  </Text>
                  {isSelected && (
                    <Icon
                      as={CheckIcon}
                      size="md"
                      className="border text-primary-700 pe-4"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
