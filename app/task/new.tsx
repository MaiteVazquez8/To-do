import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { TaskForm } from '@/components/TaskForm';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/store/toastStore';
import type { TaskInput } from '@/types/task';

export default function NewTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const addTask = useTaskStore((state) => state.addTask);
  const showToast = useToastStore((state) => state.show);

  const handleSubmit = (input: TaskInput) => {
    addTask(input);
    showToast(strings.toast.taskCreated);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenContainer>
          <TaskForm submitLabel={strings.form.newTaskSubmit} onSubmit={handleSubmit} />
        </ScreenContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});