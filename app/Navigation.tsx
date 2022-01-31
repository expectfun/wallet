import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import { WelcomeFragment } from './fragments/onboarding/WelcomeFragment';
import { WalletImportFragment } from './fragments/onboarding/WalletImportFragment';
import { WalletCreateFragment } from './fragments/onboarding/WalletCreateFragment';
import { LegalFragment } from './fragments/onboarding/LegalFragment';
import { WalletCreatedFragment } from './fragments/onboarding/WalletCreatedFragment';
import { WalletBackupFragment } from './fragments/secure/WalletBackupFragment';
import { HomeFragment } from './fragments/HomeFragment';
import { TransferFragment } from './fragments/secure/TransferFragment';
import { SettingsFragment } from './fragments/SettingsFragment';
import { ScannerFragment } from './fragments/utils/ScannerFragment';
import { MigrationFragment } from './fragments/wallet/MigrationFragment';
import { ReceiveFragment } from './fragments/wallet/ReceiveFragment';
import { TransactionPreviewFragment } from './fragments/wallet/TransactionPreviewFragment';
import { PrivacyFragment } from './fragments/onboarding/PrivacyFragment';
import { TermsFragment } from './fragments/onboarding/TermsFragment';
import { SyncFragment } from './fragments/SyncFragment';
import { resolveOnboarding } from './fragments/resolveOnboarding';
import { DeveloperToolsFragment } from './fragments/dev/DeveloperToolsFragment';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationTheme } from './Theme';
import { getAppState } from './storage/appState';
import { Engine, EngineContext } from './sync/Engine';
import { storageCache } from './storage/storage';
import { createSimpleConnector } from './sync/Connector';
import { AppConfig } from './AppConfig';

const Stack = createNativeStackNavigator();// Platform.OS === 'ios' ? createNativeStackNavigator() : createStackNavigator();

function fullScreen(name: string, component: React.ComponentType<any>) {
    return (
        <Stack.Screen
            key={`fullScreen-${name}`}
            name={name}
            component={component}
            options={{ headerShown: false }}
        />
    );
}

function genericScreen(name: string, component: React.ComponentType<any>) {
    return (
        <Stack.Screen
            key={`genericScreen-${name}`}
            name={name}
            component={component}
            options={{ headerShown: Platform.OS === 'ios' }}
        />
    );
}

function formSheetScreen(name: string, component: React.ComponentType<any>) {
    return (
        <Stack.Screen
            key={`formSheetScreen-${name}`}
            name={name}
            component={component}
            options={{ headerShown: false }}
        />
    );
}

function modalScreen(name: string, component: React.ComponentType<any>) {
    return (
        <Stack.Screen
            key={`modalScreen-${name}`}
            name={name}
            component={component}
            options={{ presentation: 'modal', headerShown: false }}
        />
    );
}

function lockedModalScreen(name: string, component: React.ComponentType<any>) {
    return (
        <Stack.Screen
            key={`modalScreen-${name}`}
            name={name}
            component={component}
            options={{ presentation: 'modal', headerShown: false, gestureEnabled: false }}
        />
    );
}

function fullScreenModal(name: string, component: React.ComponentType<any>) {
    return (
        <Stack.Screen
            key={`fullScreenModal-${name}`}
            name={name}
            component={component}
            options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
    );
}

const navigation = [
    genericScreen('Welcome', WelcomeFragment),
    fullScreen('Home', HomeFragment),
    fullScreen('Sync', SyncFragment),
    genericScreen('LegalCreate', LegalFragment),
    genericScreen('LegalImport', LegalFragment),
    genericScreen('WalletImport', WalletImportFragment),
    genericScreen('WalletCreate', WalletCreateFragment),
    genericScreen('WalletCreated', WalletCreatedFragment),
    genericScreen('WalletBackupInit', WalletBackupFragment),
    genericScreen('WalletBackup', WalletBackupFragment),
    genericScreen('Settings', SettingsFragment),
    genericScreen('Privacy', PrivacyFragment),
    genericScreen('Terms', TermsFragment),
    modalScreen('Transfer', TransferFragment),
    modalScreen('Receive', ReceiveFragment),
    modalScreen('Transaction', TransactionPreviewFragment),
    genericScreen('Migration', MigrationFragment),
    lockedModalScreen('Scanner', ScannerFragment),
    genericScreen('DeveloperTools', DeveloperToolsFragment)
];

export const Navigation = React.memo(() => {

    const engine = React.useMemo(() => {
        let state = getAppState();
        if (0 <= state.selected && state.selected < state.addresses.length) {
            const ex = state.addresses[state.selected];
            return new Engine(
                ex.address,
                storageCache,
                createSimpleConnector(!AppConfig.isTestnet ? {
                    main: 'https://mainnet.tonhubapi.com',
                    estimate: 'https://wallet.toncenter.com/api/v2'
                } : {
                    main: 'https://testnet.toncenter.com/api/v2'
                })
            );
        } else {
            return null;
        }
    }, []);

    const initial = React.useMemo(() => {
        const onboarding = resolveOnboarding(engine);
        if (onboarding === 'backup') {
            return 'WalletCreated';
        } else if (onboarding === 'home') {
            return 'Home';
        } else if (onboarding === 'sync') {
            return 'Sync';
        } else if (onboarding === 'welcome') {
            return 'Welcome';
        } else {
            throw Error('Invalid onboarding state');
        }
    }, []);

    return (
        <EngineContext.Provider value={engine}>
            <View style={{ flexGrow: 1, alignItems: 'stretch' }}>
                <NavigationContainer theme={NavigationTheme}>
                    <Stack.Navigator
                        initialRouteName={initial}
                        screenOptions={{ headerBackTitle: 'Back', title: '', headerShadowVisible: false, headerTransparent: false, headerStyle: { backgroundColor: 'white' } }}
                    >
                        {navigation}
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </EngineContext.Provider>
    );
});