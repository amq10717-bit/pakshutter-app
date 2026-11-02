// Adds a release signing config to android/app/build.gradle that reads the
// upload keystore from environment variables, so release APK/AAB builds are
// signed for the Play Store. Values come from GitHub Actions secrets or your shell:
//   PS_KEYSTORE_FILE, PS_KEYSTORE_PASSWORD, PS_KEY_ALIAS, PS_KEY_PASSWORD
const { withAppBuildGradle } = require('expo/config-plugins');

const MARK = '// pakshutter-release-signing';

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let g = cfg.modResults.contents;
    if (g.includes(MARK)) return cfg;

    const releaseSigning = `
        release { ${MARK}
            if (System.getenv("PS_KEYSTORE_FILE")) {
                storeFile file(System.getenv("PS_KEYSTORE_FILE"))
                storePassword System.getenv("PS_KEYSTORE_PASSWORD")
                keyAlias System.getenv("PS_KEY_ALIAS")
                keyPassword System.getenv("PS_KEY_PASSWORD")
            }
        }`;

    // 1) add a "release" entry inside signingConfigs { ... } (after the debug block)
    g = g.replace(/signingConfigs\s*\{\s*\n(\s*)debug\s*\{[\s\S]*?\n\1\}/, (m) => `${m}${releaseSigning}`);

    // 2) make the release build type use it when a keystore is provided
    g = g.replace(/(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/, (m, pre) =>
      `${pre}signingConfig System.getenv("PS_KEYSTORE_FILE") ? signingConfigs.release : signingConfigs.debug`,
    );

    cfg.modResults.contents = g;
    return cfg;
  });
};
