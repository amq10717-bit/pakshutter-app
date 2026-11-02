import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cachedImage, isMediaRef, resolveImage } from '../lib/media';
import { colors } from '../theme';

/** Shows a remote URL, a data URI or an admin-uploaded "media:<id>" photo,
 *  with a branded placeholder while loading or if the photo is missing. */
export default function SmartImage({ source, style, contentFit = 'cover', icon = 'image-outline', iconSize = 34, children }) {
  const media = isMediaRef(source);
  const [resolved, setResolved] = useState(() => ({ key: source, uri: cachedImage(source) }));
  const [failedUri, setFailedUri] = useState(null);

  useEffect(() => {
    if (!media) return undefined;
    let alive = true;
    resolveImage(source)
      .then((u) => alive && setResolved({ key: source, uri: u }))
      .catch(() => alive && setResolved({ key: source, uri: null }));
    return () => {
      alive = false;
    };
  }, [source, media]);

  const uri = !source ? null : media ? (resolved.key === source ? resolved.uri : cachedImage(source)) : source;
  const failed = !!uri && failedUri === uri;

  const showPlaceholder = !uri || failed;

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient colors={[colors.navy, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill}>
        {showPlaceholder && icon ? (
          <View style={styles.center}>
            <Ionicons name={icon} size={iconSize} color="rgba(255,255,255,0.55)" />
          </View>
        ) : null}
      </LinearGradient>
      {!showPlaceholder ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={250}
          cachePolicy="memory-disk"
          onError={() => setFailedUri(uri)}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: colors.navy },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
