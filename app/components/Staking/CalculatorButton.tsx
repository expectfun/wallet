import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import CalcIcon from '../../../assets/ic_staking_calc.svg';
import Arrow from '../../../assets/ic_ios_forward_grey.svg';
import { t } from "../../i18n/t";
import { Theme } from "../../Theme";
import { useTypedNavigation } from "../../utils/useTypedNavigation";
import { Address } from "ton";

export const CalculatorButton = React.memo(({ style, target }: { style: StyleProp<ViewStyle>, target: Address }) => {
    const navigation = useTypedNavigation();

    return (
        <Pressable style={({ pressed }) => {
            return [
                { opacity: pressed ? 0.3 : 1 },
                style
            ]
        }}
            onPress={() => navigation.navigateStakingCalculator({ target })}
        >
            <View style={{
                borderRadius: 14,
                backgroundColor: Theme.item,
                paddingLeft: 16, paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <CalcIcon style={{ marginRight: 10 }} />
                <Text style={{
                    fontSize: 16,
                    fontWeight: '500'
                }}>
                    {t('products.staking.calc.text')}
                </Text>
                <View style={{ flexGrow: 1 }} />
                <Arrow />
            </View>
        </Pressable>
    );
});