import type { ComponentProps } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/constants/spacing';
import type { Task } from '@/types/task';
import type { SectionKey, TaskSection } from '@/utils/sections';
import { SectionHeader } from './SectionHeader';

type IconName = ComponentProps<typeof Ionicons>['name'];

const SECTION_ICONS: Record<SectionKey, IconName> = {
  overdue: 'alert-circle-outline',
  today: 'calendar-outline',
  tomorrow: 'calendar-outline',
  upcoming: 'calendar-outline',
  noDate: 'remove-circle-outline',
  completed: 'checkmark-done-outline',
};

interface TaskListProps {
  sections: TaskSection[];
  renderItem: (task: Task) => React.ReactElement | null;
  listEmptyComponent: React.ReactElement | null;
  showSectionHeaders?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function TaskList({
  sections,
  renderItem,
  listEmptyComponent,
  showSectionHeaders = true,
  contentContainerStyle,
}: TaskListProps) {
  return (
    <SectionList
      style={styles.flex}
      sections={sections.map((section) => ({ title: section, data: section.tasks }))}
      keyExtractor={(task) => task.id}
      renderItem={({ item }) => renderItem(item)}
      renderSectionHeader={
        showSectionHeaders
          ? ({ section: { title } }) => (
              <SectionHeader
                title={title.title}
                count={title.count}
                icon={SECTION_ICONS[title.key]}
              />
            )
          : undefined
      }
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={listEmptyComponent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  separator: {
    height: spacing.sm,
  },
});