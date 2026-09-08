import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { TaskForm } from '@/components/TaskForm';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/store/toastStore';
import type { TaskInput } from '@/types/task';

export default function EditTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const task = useTaskStore((state) => state.tasks.find((t) => t.id === id));
  const updateTask = useTaskStore((state) => state.updateTask);
  const showToast = useToastStore((state) => state.show);

  useEffect(() => {
    if (!id || !task) {
      router.replace('/');
    }
  }, [id, task, router]);

  if (!id || !task) {
    return null;
  }

  const handleSubmit = (input: TaskInput) => {
    updateTask(id, input);
    showToast(strings.toast.taskUpdated);
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
          <TaskForm
            key={task.id}
            initial={{
              title: task.title,
              description: task.description,
              categoryId: task.categoryId ?? undefined,
              priority: task.priority,
              dueDate: task.dueDate,
            }}
            submitLabel={strings.form.editTaskSubmit}
            onSubmit={handleSubmit}
          />
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