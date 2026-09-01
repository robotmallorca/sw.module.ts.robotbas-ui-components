import { themeQuartz } from 'ag-grid-community'

/**
 * Tema de ag-grid con el aspecto Robotbas.
 *
 * La Theming API toma parámetros JS, no SCSS, así que los tokens tienen que ser
 * custom properties de CSS: las variables SCSS del consumidor ya no existen en
 * tiempo de ejecución. Cada una lleva su fallback, de modo que el grid se ve
 * correcto aunque la app no defina ninguna.
 */
export const robotbasGridTheme = themeQuartz.withParams({
  accentColor: 'var(--rb-primary-500, var(--bs-primary, #0d6efd))',
  backgroundColor: 'var(--bs-body-bg, #ffffff)',
  borderColor: 'var(--bs-gray-300, #dee2e6)',
  borderRadius: 4,
  browserColorScheme: 'light',
  cellHorizontalPaddingScale: 0.7,
  chromeBackgroundColor: { ref: 'backgroundColor' },
  columnBorder: false,
  // Heredada del consumidor. RobotDesk pide aquí una googleFont; la librería no
  // debe salir a la red a por una fuente en runtime.
  fontFamily: 'inherit',
  fontSize: 13,
  foregroundColor: 'var(--bs-body-color, #495057)',
  headerBackgroundColor: 'var(--bs-gray-100, #f8f9fa)',
  headerFontSize: 13,
  headerFontWeight: 500,
  headerTextColor: 'var(--bs-gray-700, #495057)',
  rowBorder: true,
  rowVerticalPaddingScale: 0.8,
  sidePanelBorder: true,
  spacing: 6,
  wrapperBorder: true,
  wrapperBorderRadius: 'var(--robotbas-border-radius-default, 4px)',
})
