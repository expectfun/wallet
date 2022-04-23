import * as React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { fragment } from "../fragment";
import { Theme } from '../Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WalletFragment } from './wallet/WalletFragment';
import { SettingsFragment } from './SettingsFragment';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { CachedLinking } from '../utils/CachedLinking';
import { resolveUrl } from '../utils/resolveUrl';
import { useTypedNavigation } from '../utils/useTypedNavigation';
import { AppConfig } from '../AppConfig';
import { t } from '../i18n/t';
import * as SplashScreen from 'expo-splash-screen';
import { useGlobalLoader } from '../components/useGlobalLoader';
import { backoff } from '../utils/time';
import { useAccount } from '../sync/Engine';

export const HomeFragment = fragment(() => {
    const safeArea = useSafeAreaInsets();
    const [tab, setTab] = React.useState(0);
    const navigation = useTypedNavigation();
    const loader = useGlobalLoader()
    const [account, engine] = useAccount();

    // Subscribe for links
    React.useEffect(() => {
        return CachedLinking.setListener((link: string) => {
            if (link === '/job') {
                let canceller = loader.show();
                (async () => {
                    try {
                        await backoff(async () => {
                            let existing = await engine.products.apps.fetchJob();
                            if (!existing) {
                                return;
                            }

                            if (existing.job.job.type === 'transaction') {
                                SplashScreen.hideAsync();
                                navigation.navigate('Transfer', {
                                    target: existing.job.job.target.toFriendly({ testOnly: AppConfig.isTestnet }),
                                    comment: existing.job.job.text,
                                    amount: existing.job.job.amount.toString(10),
                                    payload: existing.job.job.payload,
                                    stateInit: existing.job.job.stateInit,
                                    job: existing.raw
                                });
                            }
                            if (existing.job.job.type === 'sign') {
                                navigation.navigate('Sign', {
                                    job: existing.raw
                                });
                            }
                        });
                    } finally {
                        canceller();
                    }
                })()
            } else {
                let resolved = resolveUrl(link);
                if (resolved && resolved.type === 'transaction') {
                    SplashScreen.hideAsync();
                    navigation.navigate('Transfer', {
                        target: resolved.address.toFriendly({ testOnly: AppConfig.isTestnet }),
                        comment: resolved.comment,
                        amount: resolved.amount,
                        payload: resolved.payload,
                        stateInit: resolved.stateInit
                    });
                }
                if (resolved && resolved.type === 'connect') {
                    SplashScreen.hideAsync();
                    navigation.navigate('Authenticate', {
                        session: resolved.session,
                        endpoint: resolved.endpoint
                    });
                }
            }
        });
    }, []);

    return (
        <View style={{ flexGrow: 1 }}>
            <View style={{ flexGrow: 1 }} />
            <StatusBar style={'dark'} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: tab === 0 ? 1 : 0 }} pointerEvents={tab === 0 ? 'box-none' : 'none'}>
                <WalletFragment />
            </View>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: tab === 1 ? 1 : 0 }} pointerEvents={tab === 1 ? 'box-none' : 'none'}>
                <SettingsFragment />
            </View>
            <View style={{ height: 52 + safeArea.bottom, }}>
                {Platform.OS === 'ios' && (
                    <BlurView
                        style={{
                            height: 52 + safeArea.bottom,
                            paddingBottom: safeArea.bottom, paddingHorizontal: 16,
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                                backgroundColor: Theme.background,
                                opacity: 0.9
                            }}
                        />
                        <Pressable style={{ height: 52, flexGrow: 1, flexBasis: 0, alignItems: 'center', justifyContent: 'center' }} onPress={() => setTab(0)}>
                            <Image
                                source={tab === 0 ? require('../../assets/ic_wallet_selected.png') : require('../../assets/ic_wallet.png')}
                                style={{ tintColor: tab === 0 ? Theme.accent : Theme.textSecondary }}
                            />
                            <Text
                                style={{ fontSize: 10, fontWeight: '600', marginTop: 5, color: tab === 0 ? Theme.accent : Theme.textSecondary }}
                            >
                                {t('home.wallet')}
                            </Text>
                        </Pressable>
                        <Pressable style={{ height: 52, flexGrow: 1, flexBasis: 0, alignItems: 'center', justifyContent: 'center' }} onPress={() => setTab(1)}>
                            <Image
                                source={tab === 1 ? require('../../assets/ic_settings_selected.png') : require('../../assets/ic_settings.png')}
                                style={{ tintColor: tab === 1 ? Theme.accent : Theme.textSecondary }}
                            />
                            <Text
                                style={{ fontSize: 10, fontWeight: '600', marginTop: 5, color: tab === 1 ? Theme.accent : Theme.textSecondary }}
                            >
                                {t('home.settings')}
                            </Text>
                        </Pressable>
                    </BlurView>
                )}
                {Platform.OS === 'android' && (
                    <View style={{
                        height: 52 + safeArea.bottom,
                        paddingBottom: safeArea.bottom, paddingHorizontal: 16,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <Pressable style={{ height: 52, flexGrow: 1, flexBasis: 0, alignItems: 'center', justifyContent: 'center' }} onPress={() => setTab(0)}>
                            <Image
                                source={tab === 0 ? require('../../assets/ic_wallet_selected.png') : require('../../assets/ic_wallet.png')}
                                style={{ tintColor: tab === 0 ? Theme.accent : Theme.textSecondary }}
                            />
                            <Text
                                style={{ fontSize: 10, fontWeight: '600', marginTop: 5, color: tab === 0 ? Theme.accent : Theme.textSecondary }}
                            >
                                {t('home.wallet')}
                            </Text>
                        </Pressable>
                        <Pressable style={{ height: 52, flexGrow: 1, flexBasis: 0, alignItems: 'center', justifyContent: 'center' }} onPress={() => setTab(1)}>
                            <Image
                                source={tab === 1 ? require('../../assets/ic_settings_selected.png') : require('../../assets/ic_settings.png')}
                                style={{ tintColor: tab === 1 ? Theme.accent : Theme.textSecondary }}
                            />
                            <Text style={{ fontSize: 10, fontWeight: '600', marginTop: 5, color: tab === 1 ? Theme.accent : Theme.textSecondary }}>
                                {t('home.settings')}
                            </Text>
                        </Pressable>
                    </View>
                )}
                <View
                    style={{
                        position: 'absolute',
                        top: 0.5, left: 0, right: 0,
                        height: 0.5,
                        width: '100%',
                        backgroundColor: '#000',
                        opacity: 0.08
                    }}
                />
            </View>
        </View>
    );
});