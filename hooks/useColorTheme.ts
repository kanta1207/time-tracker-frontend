import { useCallback } from 'react';
import { defaultColorThemeName } from '../const/colorTheme';

import { getColorThemeCookie, setColorThemeCookie } from '../utils/cookie/colorTheme';

import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { selectColorTheme, updateColorTheme } from '../stores/slices/colorThemeSlice';

import { themeNameStyleMap } from '../config/styles/colorThemes';

import { ColorThemeName, ColorThemeStyle, isColorThemeName } from '../types/colorTheme';

/**
 * Custom hook for handling color themes
 *
 */
export const useColorTheme = () => {
  const dispatch = useAppDispatch();
  const currentColorTheme = useAppSelector(selectColorTheme);

  /**
   * Set color theme cookie and state
   *
   * @param {ColorThemeName} colorThemeName
   */
  const setColorTheme = useCallback((colorThemeName: ColorThemeName) => {
    setColorThemeCookie(colorThemeName);
    dispatch(updateColorTheme(colorThemeName));
  }, [dispatch]);

  /**
   * Initialize color theme cookie and state
   *
   * @return {void}
   */
  const initColorTheme = useCallback(() => {
    const currentColorThemeCookie = getColorThemeCookie();

    if (!currentColorThemeCookie || !isColorThemeName(currentColorThemeCookie)) {
      setColorTheme(defaultColorThemeName);
      return;
    }

    dispatch(updateColorTheme(currentColorThemeCookie));
  }, [dispatch, setColorTheme]);

  /**
   *
   *
   * @return {*}  {ColorThemeStyle}
   */
  const getCurrentColorThemeStyle = useCallback((): ColorThemeStyle => (
    themeNameStyleMap[currentColorTheme]
  ), [currentColorTheme]);

  return {
    setColorTheme,
    initColorTheme,
    getCurrentColorThemeStyle,
  };
};
