import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Screen } from '@/components/Screen';
import { getDiscreetMode } from '@/lib/storage';
import { useAppTheme } from '@/lib/theme';

const NAVY = '#071B4D';
const BLUE = '#1457EE';
const MUTED = '#71809E';

type CardProps = {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function SafetyCard({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
}: CardProps) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: iconBg },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.cardTitle,
            {
              color:
                theme.mode === 'dark'
                  ? '#F6F8FF'
                  : NAVY,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.cardSub,
            {
              color:
                theme.mode === 'dark'
                  ? '#9DA9C0'
                  : MUTED,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Text
        style={[
          styles.chevron,
          {
            color:
              theme.mode === 'dark'
                ? '#9DA9C0'
                : MUTED,
          },
        ]}
      >
        ›
      </Text>
    </Pressable>
  );
}

export default function Home() {
  const {
    theme,
    isDark,
    setPreference,
  } = useAppTheme();

  const [discreet, setDiscreet] = useState(false);
  const [sharing, setSharing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadDiscreetMode() {
        try {
          const value = await getDiscreetMode();
          setDiscreet(value);
        } catch (error) {
          console.error(
            'DISCREET MODE ERROR:',
            error
          );

          setDiscreet(false);
        }
      }

      loadDiscreetMode();
    }, [])
  );

  // --------------------------------
  // Discreet Mode
  // --------------------------------

  if (discreet) {
    return (
      <Screen>
        <View style={styles.discreetHeader}>
          <Text
            style={[
              styles.utilitiesTitle,
              { color: theme.text },
            ]}
          >
            Utilities
          </Text>

          <Pressable
            style={styles.settingsCircle}
            onPress={() =>
              router.push('/settings')
            }
          >
            <Text style={styles.settingsIcon}>
              ⚙
            </Text>
          </Pressable>
        </View>

        <SafetyCard
          icon="🧮"
          iconBg={
            isDark
              ? '#172B51'
              : '#E8F0FF'
          }
          title="Calculator"
          subtitle="Tap to open"
          onPress={() =>
            router.push('/more')
          }
        />

        <SafetyCard
          icon="📝"
          iconBg={
            isDark
              ? '#222B3A'
              : '#EEF1F6'
          }
          title="Notes"
          subtitle="Tap to open"
          onPress={() =>
            router.push('/fake-call')
          }
        />
      </Screen>
    );
  }

  // --------------------------------
  // Normal RideSafe Home
  // --------------------------------

  const titleColor = isDark
    ? '#F6F8FF'
    : NAVY;

  const muted = isDark
    ? '#9DA9C0'
    : MUTED;

  return (
    <Screen>
      {/* Header */}

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require('../assets/ridesafe-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View>
            <Text
              style={[
                styles.brand,
                { color: titleColor },
              ]}
            >
              RideSafe
            </Text>

            <Text
              style={[
                styles.tagline,
                { color: muted },
              ]}
            >
              Safer journeys ahead.
            </Text>
          </View>
        </View>

        {/* Light / Dark */}

        <View
          style={[
            styles.modeToggle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            onPress={() =>
              setPreference('light')
            }
            style={[
              styles.modeBtn,
              !isDark &&
                styles.modeSelected,
            ]}
          >
            <Text
              style={[
                styles.modeIcon,
                {
                  color: !isDark
                    ? BLUE
                    : muted,
                },
              ]}
            >
              ☀
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setPreference('dark')
            }
            style={[
              styles.modeBtn,
              isDark && {
                backgroundColor:
                  '#253149',
              },
            ]}
          >
            <Text
              style={[
                styles.modeIcon,
                {
                  color: isDark
                    ? '#F6F8FF'
                    : muted,
                },
              ]}
            >
              ☾
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Location Sharing */}

      <View
        style={[
          styles.sharePanel,
          {
            borderColor: theme.border,
            backgroundColor: isDark
              ? '#111C2F'
              : '#F1F7FF',
          },
        ]}
      >
        <View
          style={[
            styles.shareIcon,
            {
              backgroundColor: isDark
                ? '#202C40'
                : '#E4EAF3',
            },
          ]}
        >
          <Text style={{ fontSize: 25 }}>
            📍
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.shareTitle,
              { color: titleColor },
            ]}
          >
            {sharing
              ? 'Location sharing is active.'
              : "You're not sharing right now."}
          </Text>

          <Text
            style={[
              styles.shareSub,
              { color: muted },
            ]}
          >
            {sharing
              ? 'Trusted contacts can follow your trip.'
              : 'Your location is private.'}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            setSharing(
              (value) => !value
            )
          }
          style={styles.shareButton}
        >
          <Text
            style={styles.shareButtonText}
          >
            {sharing
              ? 'Stop'
              : 'Share Now'}
          </Text>
        </Pressable>
      </View>

      {/* Fake Call */}

      <SafetyCard
        icon="☎"
        iconBg={
          isDark
            ? '#172B51'
            : '#E8F0FF'
        }
        title="Fake Call"
        subtitle="Get a realistic incoming call."
        onPress={() =>
          router.push('/fake-call')
        }
      />

      {/* Call Me */}

      <SafetyCard
        icon="👥"
        iconBg={
          isDark
            ? '#27274D'
            : '#EEEEFF'
        }
        title="Call Me"
        subtitle="Trigger a call from a trusted contact."
        onPress={() =>
          router.push('/call-me')
        }
      />

      {/* Share Location */}

      <SafetyCard
        icon="📍"
        iconBg={
          isDark
            ? '#15392D'
            : '#E1F8EB'
        }
        title="Share Location"
        subtitle="Let trusted people know where you are."
        onPress={() =>
          router.push(
            '/share-location'
          )
        }
      />

      {/* I Feel Unsafe */}

      <SafetyCard
        icon="⚠"
        iconBg={
          isDark
            ? '#43291D'
            : '#FFF0DF'
        }
        title="I Feel Unsafe"
        subtitle="Alert your trusted contacts."
        onPress={() =>
          router.push('/unsafe')
        }
      />

      {/* Emergency */}

      <SafetyCard
        icon="🚨"
        iconBg={
          isDark
            ? '#442226'
            : '#FFE9EA'
        }
        title="Emergency"
        subtitle="Get immediate emergency help."
        onPress={() =>
          router.push('/emergency')
        }
      />

      {/* More Tools / Safe Ride */}

      <View style={styles.smallRow}>
        <Pressable
          onPress={() =>
            router.push('/more')
          }
          style={[
            styles.smallCard,
            {
              backgroundColor:
                theme.surface,
              borderColor:
                theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.smallIcon,
              {
                backgroundColor:
                  isDark
                    ? '#222B3A'
                    : '#EEF1F6',
              },
            ]}
          >
            <Text
              style={{
                fontSize: 20,
                color: muted,
              }}
            >
              •••
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.smallTitle,
                { color: titleColor },
              ]}
            >
              More tools
            </Text>

            <Text
              style={[
                styles.smallSub,
                { color: muted },
              ]}
            >
              Additional safety features.
            </Text>
          </View>

          <Text
            style={[
              styles.smallChevron,
              { color: muted },
            ]}
          >
            ›
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push('/safe-ride')
          }
          style={[
            styles.smallCard,
            {
              backgroundColor:
                theme.surface,
              borderColor:
                theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.smallIcon,
              {
                backgroundColor:
                  isDark
                    ? '#172B51'
                    : '#E8F0FF',
              },
            ]}
          >
            <Text style={{ fontSize: 22 }}>
              🚙
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.smallTitle,
                { color: titleColor },
              ]}
            >
              Start Safe Ride
            </Text>

            <Text
              style={[
                styles.smallSub,
                { color: muted },
              ]}
            >
              Share your ride in real time.
            </Text>
          </View>

          <Text
            style={[
              styles.smallChevron,
              { color: muted },
            ]}
          >
            ›
          </Text>
        </Pressable>
      </View>

      {/* Bottom Navigation */}

      <View
        style={[
          styles.bottomNav,
          {
            borderTopColor:
              theme.border,
          },
        ]}
      >
        <Pressable
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navIcon,
              { color: BLUE },
            ]}
          >
            ⌂
          </Text>

          <Text
            style={[
              styles.navText,
              { color: BLUE },
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push('/more')
          }
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navIcon,
              { color: muted },
            ]}
          >
            ▦
          </Text>

          <Text
            style={[
              styles.navText,
              { color: muted },
            ]}
          >
            Tools
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push('/settings')
          }
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navIcon,
              { color: muted },
            ]}
          >
            ⚙
          </Text>

          <Text
            style={[
              styles.navText,
              { color: muted },
            ]}
          >
            Settings
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  logo: {
    width: 70,
    height: 78,
  },

  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.2,
  },

  tagline: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },

  modeToggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 28,
    borderWidth: 1,
  },

  modeBtn: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modeSelected: {
    backgroundColor: '#E8F0FF',
  },

  modeIcon: {
    fontSize: 22,
    fontWeight: '600',
  },

  sharePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
  },

  shareIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shareTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  shareSub: {
    fontSize: 14,
    marginTop: 4,
  },

  shareButton: {
    minHeight: 44,
    paddingHorizontal: 15,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#9EBCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shareButtonText: {
    color: BLUE,
    fontWeight: '800',
    fontSize: 15,
  },

  card: {
    minHeight: 80,
    borderRadius: 21,
    borderWidth: 1,
    padding: 14,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 26,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  cardSub: {
    fontSize: 14.5,
    marginTop: 3,
  },

  chevron: {
    fontSize: 35,
    fontWeight: '300',
    marginLeft: 4,
  },

  smallRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 1,
  },

  smallCard: {
    flex: 1,
    minHeight: 83,
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  smallIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  smallSub: {
    fontSize: 11.5,
    marginTop: 2,
  },

  smallChevron: {
    fontSize: 26,
  },

  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 2,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    fontSize: 27,
    fontWeight: '700',
  },

  navText: {
    fontSize: 13,
    marginTop: 1,
  },

  discreetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  utilitiesTitle: {
    fontSize: 30,
    fontWeight: '800',
  },

  settingsCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsIcon: {
    color: '#FFFFFF',
    fontSize: 27,
  },
});