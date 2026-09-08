import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import type { RefObject } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { smoothMotion } from '@/constants/motion';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  inputRef?: RefObject<TextInput | null>;
}

export function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        smoothMotion(),
        {
          backgroundColor: focused ? colors.surfaceHover : colors.surfaceInput,
          borderColor: focused ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons name="search" size={18} color={focused ? colors.primary : colors.textMuted} />
      <TextInput
        ref={inputRef}
        accessibilityLabel={strings.search.accessibilityLabel}
        value={value}
        onChangeText={onChange}
        placeholder={strings.search.placeholder}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        selectionColor={colors.primary}
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.search.clear}
          hitSlop={8}
          onPress={() => onChange('')}
          style={({ pressed }) => [
            styles.clearButton,
            { backgroundColor: pressed ? colors.surfacePressed : 'transparent' },
          ]}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 46,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing.xs + 2,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});