# Meejo App 🎉

A modern React Native application built with **TypeScript** and **TailwindCSS** (NativeWind).

## Tech Stack

- **React Native** (0.81.5) with Expo SDK 54
- **TypeScript** (5.9.2)
- **TailwindCSS** (v4.1.18) via NativeWind (v4.2.1)
- **React Native Reanimated** (v4.2.0)

## Project Structure

```
meejo_app/
├── App.tsx              # Main application component
├── global.css           # TailwindCSS styles
├── tailwind.config.js   # TailwindCSS configuration
├── babel.config.js      # Babel configuration with NativeWind
├── metro.config.js      # Metro bundler configuration
├── nativewind-env.d.ts  # TypeScript declarations for NativeWind
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies
└── assets/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

Dependencies are already installed! If you need to reinstall:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

Then choose your platform:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web browser
- Scan the QR code with Expo Go app on your physical device

Or run directly on a specific platform:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Using TailwindCSS

This project uses **NativeWind v4**, which brings TailwindCSS to React Native. You can use Tailwind classes directly in the `className` prop:

```tsx
<View className="flex-1 bg-blue-500 items-center justify-center">
  <Text className="text-2xl font-bold text-white">
    Hello, TailwindCSS!
  </Text>
</View>
```

### Supported Features

- ✅ All Tailwind utility classes
- ✅ Responsive design with breakpoints
- ✅ Dark mode support
- ✅ Custom theme configuration
- ✅ TypeScript intellisense for classes

### Customizing Tailwind

Edit `tailwind.config.js` to customize your theme:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
    },
  },
}
```

## TypeScript

The project is fully configured with TypeScript. Type definitions for NativeWind are included via `nativewind-env.d.ts`.

## Project Configuration

### Babel (`babel.config.js`)
- Expo preset with NativeWind JSX import source
- NativeWind Babel plugin
- React Native Reanimated plugin

### Metro (`metro.config.js`)
- Configured to process CSS files with NativeWind
- Handles CSS imports in components

### TailwindCSS (`tailwind.config.js`)
- Content paths configured for all component directories
- NativeWind preset enabled
- Extensible theme configuration

## Development Tips

1. **Clear Cache**: If you encounter styling issues:
   ```bash
   npm start -- --clear
   ```

2. **TypeScript Checking**: Run type checking:
   ```bash
   npx tsc --noEmit
   ```

3. **Linting**: The project uses Expo's default linting setup

## Next Steps

- [ ] Add navigation (React Navigation)
- [ ] Set up state management (Redux, Zustand, etc.)
- [ ] Add UI component library
- [ ] Configure app icon and splash screen
- [ ] Set up environment variables
- [ ] Add testing (Jest, React Native Testing Library)

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

This project is available for personal and commercial use.

---

**Happy Coding! 🚀**
