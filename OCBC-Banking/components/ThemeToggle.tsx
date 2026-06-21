import React from 'react';
import { Button } from 'tamagui';
import { useTheme } from '../hooks/ThemeContext';
import { Feather } from '@expo/vector-icons';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      circular 
      size="$3" 
      onPress={toggleTheme}
      backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
    >
      {theme === 'dark' ? (
        <Feather name="sun" size={20} color="white" />
      ) : (
        <Feather name="moon" size={20} color="black" />
      )}
    </Button>
  );
};
